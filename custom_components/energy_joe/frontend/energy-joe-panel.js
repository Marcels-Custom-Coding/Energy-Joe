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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, ee = globalThis, te = ee.trustedTypes, ne = te ? te.emptyScript : "", re = ee.reactiveElementPolyfillSupport, ie = (e, t) => e, ae = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ne : null;
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
}, oe = (e, t) => !l(e, t), se = {
	attribute: !0,
	type: String,
	converter: ae,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), ee.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ce = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
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
		return this.elementProperties.get(e) ?? se;
	}
	static _$Ei() {
		if (this.hasOwnProperty(ie("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(ie("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ie("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? ae : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ae : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? oe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
ce.elementStyles = [], ce.shadowRootOptions = { mode: "open" }, ce[ie("elementProperties")] = /* @__PURE__ */ new Map(), ce[ie("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: ce }), (ee.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var le = globalThis, ue = (e) => e, de = le.trustedTypes, fe = de ? de.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pe = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, me = "?" + h, he = `<${me}>`, g = document, ge = () => g.createComment(""), _e = (e) => e === null || typeof e != "object" && typeof e != "function", ve = Array.isArray, ye = (e) => ve(e) || typeof e?.[Symbol.iterator] == "function", be = "[ 	\n\f\r]", xe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Se = /-->/g, Ce = />/g, we = RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Te = /'/g, Ee = /"/g, De = /^(?:script|style|textarea|title)$/i, Oe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), _ = Oe(1), v = Oe(2), ke = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), Ae = /* @__PURE__ */ new WeakMap(), b = g.createTreeWalker(g, 129);
function je(e, t) {
	if (!ve(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return fe === void 0 ? t : fe.createHTML(t);
}
var Me = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = xe;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === xe ? c[1] === "!--" ? o = Se : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = we) : (De.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = we) : o = Ce : o === we ? c[0] === ">" ? (o = i ?? xe, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? we : c[3] === "\"" ? Ee : Te) : o === Ee || o === Te ? o = we : o === Se || o === Ce ? o = xe : (o = we, i = void 0);
		let d = o === we && e[t + 1].startsWith("/>") ? " " : "";
		a += o === xe ? n + he : l >= 0 ? (r.push(s), n.slice(0, l) + pe + n.slice(l) + h + d) : n + h + (l === -2 ? t : d);
	}
	return [je(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ne = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Me(t, n);
		if (this.el = e.createElement(l, r), b.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = b.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(pe)) {
					let t = u[o++], n = i.getAttribute(e).split(h), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Re : r[1] === "?" ? ze : r[1] === "@" ? Be : Le
					}), i.removeAttribute(e);
				} else e.startsWith(h) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (De.test(i.tagName)) {
					let e = i.textContent.split(h), t = e.length - 1;
					if (t > 0) {
						i.textContent = de ? de.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ge()), b.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], ge());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === me) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(h, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += h.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = g.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Pe(e, t, n = e, r) {
	if (t === ke) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = _e(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Pe(e, i._$AS(e, t.values), i, r)), t;
}
var Fe = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? g).importNode(t, !0);
		b.currentNode = r;
		let i = b.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Ie(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ve(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = b.nextNode(), a++);
		}
		return b.currentNode = g, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ie = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = Pe(this, e, t), _e(e) ? e === y || e == null || e === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : e !== this._$AH && e !== ke && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ye(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== y && _e(this._$AH) ? this._$AA.nextSibling.data = e : this.T(g.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ne.createElement(je(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Fe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ae.get(e.strings);
		return t === void 0 && Ae.set(e.strings, t = new Ne(e)), t;
	}
	k(t) {
		ve(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(ge()), this.O(ge()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ue(e).nextSibling;
			ue(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Le = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = y, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = y;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Pe(this, e, t, 0), a = !_e(e) || e !== this._$AH && e !== ke, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Pe(this, r[n + o], t, o), s === ke && (s = this._$AH[o]), a ||= !_e(s) || s !== this._$AH[o], s === y ? e = y : e !== y && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Re = class extends Le {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === y ? void 0 : e;
	}
}, ze = class extends Le {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== y);
	}
}, Be = class extends Le {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Pe(this, e, t, 0) ?? y) === ke) return;
		let n = this._$AH, r = e === y && n !== y || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== y && (n === y || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ve = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Pe(this, e);
	}
}, He = le.litHtmlPolyfillSupport;
He?.(Ne, Ie), (le.litHtmlVersions ??= []).push("3.3.3");
var Ue = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ie(t.insertBefore(ge(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, We = globalThis, x = class extends ce {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ue(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return ke;
	}
};
x._$litElement$ = !0, x.finalized = !0, We.litElementHydrateSupport?.({ LitElement: x });
var Ge = We.litElementPolyfillSupport;
Ge?.({ LitElement: x }), (We.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var Ke = {
	attribute: !0,
	type: String,
	converter: ae,
	reflect: !1,
	hasChanged: oe
}, qe = (e = Ke, t, n) => {
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
function S(e) {
	return (t, n) => typeof n == "object" ? qe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function C(e) {
	return S({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Je = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Ye(e, t) {
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
			return Je(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Je(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region src/assets.ts
var Xe = import.meta.url.replace(/[^/]*$/, ""), w = (e) => `${Xe}${e}`, Ze = {
	"tab.overview": "Übersicht",
	"tab.plan": "Plan",
	"tab.history": "Historie",
	"tab.learn": "Lernen",
	"tab.devices": "Geräte",
	"tab.settings": "Einstellungen",
	"nav.label": "Bereiche",
	"mode.simulation": "Simulation",
	"mode.simulation.sub": "Joe schaut nur zu und lernt",
	"mode.simulation.desc": "Ich plane und lerne, schalte aber nichts.",
	"mode.live": "Live",
	"mode.live.sub": "Joe steuert selbst",
	"mode.live.desc": "Ich steuere selbst – und stelle am Ende jeder Nacht alles zurück.",
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
	"onb.welcome.more.text": "Jede Nacht rechne ich aus, wie viel deine Speicher aus dem günstigen Netz brauchen, damit sie bis zur Sonne reichen – nicht mehr und nicht weniger. Tagsüber schaue ich, wie gut ich lag, und lerne daraus.",
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
	"plan.title": "Hier |rechne ich",
	"history.title": "Jeder Tag |unter der Lupe",
	"learn.title": "Was ich |lerne",
	"learn.text": "Wie gut die Solarprognose bei dir trifft, wie viel ihr bei Kälte verbraucht, wie groß deine Speicher wirklich sind – hier sammle ich es.",
	"devices.title": "Deine |Geräte",
	"devices.text": "Speicher, Wallbox und Warmwasser – mit Zustand, Testlauf und dem, was ich mit ihnen vorhabe.",
	"settings.operation": "Betrieb",
	"settings.mode": "Betriebsart",
	"settings.mode.hint": "Simulation plant und lernt, ohne etwas zu schalten.",
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
	"tip.mode.text": "**Simulation** – Ich plane und lerne wie im Ernstfall, schalte aber nichts. Du siehst, was ich getan hätte und was es gebracht hätte.\n**Live** – Ich steuere Speicher und Geräte selbst und stelle am Ende jeder Nacht alles zurück. Kommt, sobald ich steuern kann.\n**Aus** – Ich mache Pause: kein Planen, kein Lernen, kein Schalten. Was ich schon weiß, bleibt.",
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
	"tariff.kind.dynamic": "Börsenpreis, stündlich anders",
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
	"review.later": "später",
	"review.ask_later": "frag ich dich gleich",
	"review.capacity_unknown": "Größe unbekannt",
	"review.battery": "Speicher",
	"review.battery.none": "Keinen Speicher gefunden. Hast du einen, such ihn dir aus.",
	"review.battery.more": "Weiterer Speicher",
	"review.battery.more_detail": "Fehlt einer? Such ihn dir aus.",
	"review.tariff.ask": "Den Tarif frag ich dich gleich – oder trag ihn jetzt ein.",
	"review.forecast.none": "Ohne Solarprognose plane ich vorsichtig. Richte in Home Assistant zum Beispiel Forecast.Solar ein, dann such ich nochmal.",
	"review.grid.none": "Ohne Netzzähler sehe ich nicht, was wirklich passiert. Such dir den Sensor aus, der die Leistung am Hausanschluss misst.",
	"review.home.none": "Kennst du keinen? Kein Problem – dann rechne ich den Hausverbrauch aus Netz, PV und Speicher selbst aus.",
	"review.home.without": "Hab ich nicht",
	"review.home.computed": "rechne ich aus Netz, PV und Speicher aus",
	"review.solar.none": "Hab keine PV",
	"review.solar.without": "keine PV-Anlage",
	"review.wallbox.later": "für die Nacht-Aktionen",
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
	"ask.count": "Frage {n} von {total}",
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
	"tip.review_home.text": "Daraus lerne ich, wie viel ihr wann braucht – das Herzstück meiner Planung.\n**Ändern** – einen anderen Sensor wählen.\n**Hab ich nicht** – dann rechne ich ihn aus Netz, PV und Speicher aus.",
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
	"tip.f_consumer_kind.title": "Was bedeutet die Art?",
	"tip.f_consumer_kind.text": "Heizungen, Klimageräte und Warmwasser lerne ich zusammen mit der Außentemperatur, das E-Auto getrennt. **Zähler für andere Geräte** heißt: Er misst Geräte mit, die hier selbst stehen – die zähle ich nicht doppelt.",
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
	"plan.why.dynamic": "Börsenpreise plane ich ab einem späteren Update. Bis dahin schaue ich zu und lerne.",
	"plan.why.no_battery": "Ohne Speicher, dessen Größe ich kenne, gibt es nachts nichts zu planen.",
	"plan.why.failed": "Beim Planen ist etwas schiefgegangen. Ich versuche es zur nächsten vollen Stunde wieder.",
	"plan.note.capacity_unknown": "Ein Speicher fehlt in der Rechnung, weil ich seine Größe nicht kenne.",
	"plan.note.soc_unknown": "Ein Speicher fehlt in der Rechnung, weil sein Ladezustand gerade nichts liefert.",
	"plan.note.not_controllable": "Einen Speicher kann ich nur beobachten – in der Simulation rechne ich so, als könnte ich ihn steuern.",
	"plan.note.no_forecast": "Ohne Prognose rechne ich, als käme morgen keine Sonne – also vorsichtig.",
	"plan.note.default_profile": "Deinen Verbrauch kenne ich noch nicht gut und rechne mit einem typischen Haushalt.",
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
	"plan.math": "So habe ich gerechnet",
	"plan.math.battery_now": "Speicher jetzt",
	"plan.math.battery_now.sub": "{stored} von {capacity} kWh",
	"plan.math.battery_start": "Zu Beginn der günstigen Zeit",
	"plan.math.solar": "Sonne morgen",
	"plan.math.solar.hours": "stündliche Prognose deiner Solaranlage",
	"plan.math.solar.sum": "Tagesprognose, über den Tag verteilt",
	"plan.math.solar.none": "keine Prognose – ich rechne ohne Sonne",
	"plan.math.solar.factor": "× {value}, so trifft die Prognose bei dir",
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
	"tip.chart_plan_soc.title": "Was sehe ich hier?",
	"tip.chart_plan_soc.text": "Wie voll die Speicher **mit Plan** wären und wie voll **ohne Plan**. Der Unterschied ist das, was ich dir spare.",
	"error.title": "Joe antwortet |nicht",
	"error.text": "Ich erreiche die Integration nicht. Lade die Seite neu – hilft das nicht, schau unter Einstellungen → System → Protokolle nach.",
	"error.action": "Fehler beim Speichern",
	loading: "Joe sattelt auf …"
}, Qe = {
	"tab.overview": "Overview",
	"tab.plan": "Plan",
	"tab.history": "History",
	"tab.learn": "Learning",
	"tab.devices": "Devices",
	"tab.settings": "Settings",
	"nav.label": "Sections",
	"mode.simulation": "Simulation",
	"mode.simulation.sub": "Joe only watches and learns",
	"mode.simulation.desc": "I plan and learn, but don't switch anything.",
	"mode.live": "Live",
	"mode.live.sub": "Joe is in control",
	"mode.live.desc": "I'm in control – and put everything back at the end of every night.",
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
	"onb.welcome.more.text": "Every night I work out how much your batteries need from the cheap grid to last until the sun takes over – no more, no less. During the day I check how well I did and learn from it.",
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
	"plan.title": "Where I |do the math",
	"history.title": "Every day |up close",
	"learn.title": "What I |learn",
	"learn.text": "How well the solar forecast fits your home, how much you use when it's cold, how big your batteries really are – I collect it here.",
	"devices.title": "Your |devices",
	"devices.text": "Batteries, wallbox and hot water – with status, a test run and what I'm planning with them.",
	"settings.operation": "Operation",
	"settings.mode": "Operating mode",
	"settings.mode.hint": "Simulation plans and learns without switching anything.",
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
	"tip.mode.text": "**Simulation** – I plan and learn as if for real, but don't switch anything. You see what I would have done and what it would have saved.\n**Live** – I control batteries and devices myself and put everything back at the end of every night. Coming once I can control devices.\n**Off** – I take a break: no planning, no learning, no switching. What I already know stays.",
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
	"tariff.kind.dynamic": "Market price, changes hourly",
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
	"review.later": "later",
	"review.ask_later": "I'll ask you in a moment",
	"review.capacity_unknown": "size unknown",
	"review.battery": "Battery",
	"review.battery.none": "No battery found. If you have one, pick it.",
	"review.battery.more": "Another battery",
	"review.battery.more_detail": "Missing one? Pick it.",
	"review.tariff.ask": "I'll ask you about the tariff in a moment – or enter it now.",
	"review.forecast.none": "Without a solar forecast I plan cautiously. Set up Forecast.Solar, for example, in Home Assistant and I'll look again.",
	"review.grid.none": "Without a grid meter I can't see what really happens. Pick the sensor that measures the power at your grid connection.",
	"review.home.none": "Don't know one? No problem – I'll work out home consumption from grid, solar and battery myself.",
	"review.home.without": "I don't have one",
	"review.home.computed": "worked out from grid, solar and battery",
	"review.solar.none": "No solar",
	"review.solar.without": "no solar system",
	"review.wallbox.later": "for the night actions",
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
	"ask.count": "Question {n} of {total}",
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
	"tip.review_home.text": "From it I learn how much you use and when – the heart of my planning.\n**Change** – choose another sensor.\n**I don't have one** – then I work it out from grid, solar and battery.",
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
	"tip.f_consumer_kind.title": "What does the kind mean?",
	"tip.f_consumer_kind.text": "Heating, air conditioning and hot water I learn together with the outdoor temperature, the car separately. **Meter for other devices** means it also measures devices listed here themselves – I don't count them twice.",
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
	"plan.why.dynamic": "I'll plan with market prices in a later update. Until then I watch and learn.",
	"plan.why.no_battery": "Without a battery whose size I know, there's nothing to plan at night.",
	"plan.why.failed": "Something went wrong while planning. I'll try again at the next full hour.",
	"plan.note.capacity_unknown": "One battery is missing from the calculation because I don't know its size.",
	"plan.note.soc_unknown": "One battery is missing from the calculation because its charge level isn't reporting.",
	"plan.note.not_controllable": "I can only watch one battery – in the simulation I calculate as if I could control it.",
	"plan.note.no_forecast": "Without a forecast I calculate as if no sun came tomorrow – so, cautiously.",
	"plan.note.default_profile": "I don't know your consumption well yet and use a typical household.",
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
	"plan.math": "How I calculated",
	"plan.math.battery_now": "Batteries now",
	"plan.math.battery_now.sub": "{stored} of {capacity} kWh",
	"plan.math.battery_start": "When the cheap hours begin",
	"plan.math.solar": "Sun tomorrow",
	"plan.math.solar.hours": "hourly forecast of your solar system",
	"plan.math.solar.sum": "daily forecast, spread over the day",
	"plan.math.solar.none": "no forecast – I calculate without sun",
	"plan.math.solar.factor": "× {value}, how well the forecast fits your home",
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
	"tip.chart_plan_soc.title": "What am I looking at?",
	"tip.chart_plan_soc.text": "How full the batteries would be **with the plan** and **without it**. The difference is what I save you.",
	"error.title": "Joe isn't |answering",
	"error.text": "I can't reach the integration. Reload the page – if that doesn't help, check Settings → System → Logs.",
	"error.action": "Saving failed",
	loading: "Joe is saddling up …"
}, $e = /* @__PURE__ */ new Map();
function et(e, t) {
	return e.replace(/\{(\w+)\}/g, (e, n) => String(t?.[n] ?? ""));
}
function tt(e) {
	let t = e || "en", n = $e.get(t);
	if (n) return n;
	let r = t.startsWith("de") ? Ze : Qe, i = ((e, t) => et(r[e], t));
	return i.optional = (e, t) => e in r ? et(r[e], t) : void 0, Object.defineProperty(i, "lang", { value: t }), $e.set(t, i), i;
}
function nt(e) {
	return e.split("|");
}
//#endregion
//#region src/components/bits.ts
var T = _`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;
function E(e, t = "h2", n) {
	let r = nt(e), i = r.length - 1, a = r.map((e, t) => t === i && r.length > 1 ? _`<span class="hl">${e}</span>` : e.endsWith("!") ? _`${e}<br />` : _`${e}`), o = n ? _`<span class="title-tip">${n}</span>` : "";
	return t === "h1" ? _`<h1 class="display">${a}${o}</h1>` : _`<h2 class="display">${a}${o}</h2>`;
}
function D(e, t) {
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
var rt = {
	read: "mdi:eye-outline",
	learned: "mdi:auto-fix",
	user: "mdi:account-edit-outline",
	default: "mdi:tune-variant"
};
function O(e, t) {
	let n = t?.source ?? "default";
	return _`<span class="chip ${n}"
    ><ha-icon icon=${rt[n]}></ha-icon>${e(`source.${n}`)}</span
  >`;
}
function it(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) (typeof r == "string" || typeof r == "number") && (n[e] = r);
	return e.optional(`reason.${t.code}`, n) ?? t.code;
}
//#endregion
//#region src/define.ts
function k(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
//#endregion
//#region src/styles/shared.ts
var A = o`
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

  .sheet-title {
    padding-right: 40px;
  }
  .sheet-title .display {
    font-size: clamp(28px, 6vw, 36px);
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
function j(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/components/pose.ts
var at = /* @__PURE__ */ new Set(["welcome"]), ot = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), st = "thumbs", ct = class extends x {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = o`
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
		let e = ot.has(this.name) ? "scene" : "";
		if (this.name === st) return _`<img class="light" src=${w("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${w("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = w(`poses/${this.name}.webp`);
		return at.has(this.name) ? _`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${w(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : _`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
j([S()], ct.prototype, "name", void 0), j([S()], ct.prototype, "alt", void 0), k("joe-pose", ct);
//#endregion
//#region src/components/empty-state.ts
var lt = class extends x {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [A, o`
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
        ${E(this.heading)} ${T}
        <p class="lead">${this.text}</p>
        ${this.note ? _`<div class="note"><span class="chip soon">${this.note}</span></div>` : y}
        <slot></slot>
      </div>
    </div>`;
	}
};
j([S()], lt.prototype, "pose", void 0), j([S()], lt.prototype, "heading", void 0), j([S()], lt.prototype, "text", void 0), j([S()], lt.prototype, "note", void 0), k("joe-empty-state", lt);
//#endregion
//#region src/entities.ts
var ut = [
	"W",
	"kW",
	"MW"
], dt = [
	"Wh",
	"kWh",
	"MWh"
], ft = {
	power: (e) => M(e) === "sensor" && ut.includes(N(e)),
	soc: (e) => M(e) === "sensor" && N(e) === "%",
	energy: (e) => M(e) === "sensor" && dt.includes(N(e)),
	price: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(M(e)) && (e.attributes.device_class === "monetary" || /\/\s*kwh/i.test(N(e))),
	weather: (e) => M(e) === "weather",
	workday: (e) => M(e) === "binary_sensor",
	calendar: (e) => M(e) === "calendar",
	person: (e) => M(e) === "person",
	any: () => !0
};
function M(e) {
	return e.entity_id.split(".", 1)[0];
}
function N(e) {
	return String(e.attributes.unit_of_measurement ?? "");
}
function pt(e, t) {
	return ft[t](e);
}
function P(e, t) {
	let n = e.states[t]?.attributes.friendly_name;
	return typeof n == "string" && n ? n : t.split(".", 2)[1]?.replace(/_/g, " ") ?? t;
}
function mt(e, t) {
	let n = e.entities?.[t], r = n?.device_id ? e.devices?.[n.device_id] : void 0, i = n?.area_id ?? r?.area_id, a = i ? e.areas?.[i]?.name : void 0, o = r?.name_by_user || r?.name || void 0;
	return [o && P(e, t).toLowerCase().startsWith(o.toLowerCase()) ? void 0 : o, a].filter(Boolean).join(" · ");
}
function ht(e, t) {
	if (!t) return null;
	let n = Number.parseFloat(e.states[t]?.state ?? "");
	return Number.isFinite(n) ? n : null;
}
function F(e, t, n) {
	return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
}
function gt(e, t, n) {
	let r = e.states[t];
	if (!r) return "–";
	if (e.formatEntityState) return e.formatEntityState(r);
	let i = ht(e, t);
	return i === null ? r.state : `${F(n, i, Math.abs(i) >= 100 ? 0 : Math.abs(i) >= 10 ? 1 : 2)} ${N(r)}`.trim();
}
function _t(e, t) {
	return t === "W" ? e / 1e3 : t === "MW" ? e * 1e3 : e;
}
function vt(e, t) {
	if (!t) return null;
	let n = ht(e, t.entity_id);
	if (n === null) return null;
	let r = _t(n, N(e.states[t.entity_id]));
	if (t.invert && (r = -r), t.minus_entity_id) {
		let n = ht(e, t.minus_entity_id);
		if (n === null) return null;
		r -= _t(n, N(e.states[t.minus_entity_id]));
	}
	return r;
}
function yt(e, t) {
	let n = ht(e, t);
	if (n === null || !t) return null;
	let r = N(e.states[t]);
	return r === "Wh" ? n / 1e3 : r === "MWh" ? n * 1e3 : n;
}
function bt(e, t) {
	let n = t.map((t) => vt(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
//#endregion
//#region src/components/tip.ts
var xt = 120, St = 220, Ct = 8, wt = 10, Tt, Et = class extends x {
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
		return e ? _`<button
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
        ${Dt(e.text)}
        ${e.facts?.length ? _`<dl>${e.facts.map(([e, t]) => _`<dt>${e}</dt><dd>${t}</dd>`)}</dl>` : y}
        <span class="arrow"></span>
      </div>` : y;
	}
	show(e = !1) {
		this.cancelTimer(), this.pinned = this.pinned || e, !this.open && (Tt && Tt !== this && Tt.close(), Tt = this, this.open = !0, window.addEventListener("pointerdown", this.onOutside, !0), window.addEventListener("keydown", this.onKey, !0), this.updateComplete.then(() => {
			let e = this.bubble;
			this.open && e && (typeof e.showPopover == "function" && !e.matches(":popover-open") && e.showPopover(), this.follow());
		}));
	}
	close() {
		this.cancelTimer(), this.pinned = !1, this.frame !== void 0 && (cancelAnimationFrame(this.frame), this.frame = void 0), window.removeEventListener("pointerdown", this.onOutside, !0), window.removeEventListener("keydown", this.onKey, !0);
		let e = this.bubble;
		e && typeof e.hidePopover == "function" && e.matches(":popover-open") && e.hidePopover(), Tt === this && (Tt = void 0), this.open = !1;
	}
	onClick() {
		this.open && this.pinned ? this.close() : this.show(!0);
	}
	onEnter(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open || (this.timer = window.setTimeout(() => this.show(), xt)));
	}
	onLeave(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open && !this.pinned && (this.timer = window.setTimeout(() => this.close(), St)));
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
		let r = t.getBoundingClientRect(), i = document.documentElement.clientWidth, a = n.top - r.height - wt, o = "top";
		a < Ct && (a = n.bottom + wt, o = "bottom");
		let s = n.left + n.width / 2, c = Math.max(Ct, Math.min(s - r.width / 2, i - r.width - Ct)), l = Math.max(14, Math.min(s - c, r.width - 14));
		t.style.left = `${Math.round(c)}px`, t.style.top = `${Math.round(a)}px`, t.style.setProperty("--arrow", `${Math.round(l)}px`), t.dataset.place = o;
	}
};
j([S({ attribute: !1 })], Et.prototype, "tip", void 0), j([S()], Et.prototype, "label", void 0), j([C()], Et.prototype, "open", void 0), j([Ye("button")], Et.prototype, "button", void 0), j([Ye(".bubble")], Et.prototype, "bubble", void 0);
function Dt(e) {
	return e.split("\n").map((e) => _`<p>
        ${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? _`<strong>${e}</strong>` : e)}
      </p>`);
}
function Ot(e, t, n, r = []) {
	let i = e.optional(`tip.${t}.hint`, n);
	return {
		heading: e(`tip.${t}.title`, n),
		text: e(`tip.${t}.text`, n),
		facts: i ? [...r, [e("tip.hint"), i]] : r
	};
}
function I(e, t, n, r) {
	return _`<joe-tip .tip=${Ot(e, t, n, r)} label=${e("tip.label")}></joe-tip>`;
}
k("joe-tip", Et);
//#endregion
//#region src/components/entity-picker.ts
var kt = 60, L = class extends x {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = kt;
	}
	static {
		this.styles = [A, o`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = kt);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return y;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), a = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return _`<div data-tipped>
      <div class="sheet-title">${E(n.heading, "h2", I(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = kt;
		}}
      />
      ${a.length ? _`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${a.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : y}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? _`<ul>
            ${i.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : _`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > i.length ? _`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += kt}>
            ${t("pick.more", { count: r.length - i.length })}
          </button>` : y}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = kt;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${I(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : y}
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
			if (r.has(a) || !this.showAll && (!pt(o, t.filter) || e.entities?.[a]?.hidden)) continue;
			let s = P(e, a);
			if (n.length) {
				let t = `${s} ${a} ${mt(e, a)}`.toLowerCase();
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
		let a = this.selected.includes(r), o = mt(e, r), s = i?.reasons?.[0];
		return _`<li>
      <button type="button" class="row" aria-pressed=${String(a)} @click=${() => this.toggle(r)}>
        <span class="mark ${n.multiple ? "box" : ""}" aria-hidden="true">
          ${a ? _`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : y}
        </span>
        <span class="txt">
          <b>${P(e, r)}</b>
          <small>${o ? `${o} · ` : ""}${r}</small>
          ${s ? _`<small class="why">${it(t, s)}</small>` : y}
        </span>
        <span class="end">
          <span class="val">${gt(e, r, t.lang)}</span>
          ${i?.confidence == null ? y : D(t, i.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let r = n.measurement?.role ?? "grid", i = this.selected[0], a = i ? vt(e, {
			entity_id: i,
			invert: this.invert,
			minus_entity_id: null
		}) : null, o = "";
		if (a !== null) {
			let e = F(t.lang, Math.abs(a), 2);
			o = r === "grid" ? t(a >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : r === "battery" ? t(a >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(a >= -.05 ? `pick.preview.${r}` : "pick.preview.negative", { value: F(t.lang, a, 2) });
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
        ${I(t, r === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${o ? _`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${o}</span></div>` : y}`;
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
j([S({ attribute: !1 })], L.prototype, "hass", void 0), j([S({ attribute: !1 })], L.prototype, "t", void 0), j([S({ attribute: !1 })], L.prototype, "request", void 0), j([C()], L.prototype, "selected", void 0), j([C()], L.prototype, "invert", void 0), j([C()], L.prototype, "query", void 0), j([C()], L.prototype, "showAll", void 0), j([C()], L.prototype, "limit", void 0), k("joe-entity-picker", L);
//#endregion
//#region src/components/sheet.ts
var At = class extends x {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = o`
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
j([S()], At.prototype, "label", void 0), j([S()], At.prototype, "closeLabel", void 0), j([S({
	type: Boolean,
	reflect: !0
})], At.prototype, "wide", void 0), j([Ye(".panel")], At.prototype, "panel", void 0), k("joe-sheet", At);
//#endregion
//#region src/components/sim-switch.ts
var jt = {
	simulation: "mdi:pause",
	live: "mdi:play",
	off: "mdi:power"
}, Mt = class extends x {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1;
	}
	static {
		this.styles = o`
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
      class=${this.mode}
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${jt[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? y : _`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : y;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
j([S()], Mt.prototype, "mode", void 0), j([S({ type: Boolean })], Mt.prototype, "compact", void 0), j([S({ attribute: !1 })], Mt.prototype, "t", void 0), k("joe-sim-switch", Mt);
//#endregion
//#region src/config.ts
var Nt = /\[[^\]]*\]|[^.[]+/g;
function Pt(e) {
	let t = [], n = "";
	for (let r of e.match(Nt) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function R(e, t) {
	for (let n of Pt(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function z(e, t) {
	return e.answers.ignored.includes(t);
}
function B(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function V(e, t, n = "user") {
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
function H(e, t) {
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
function Ft(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function It(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/editors/battery-editor.ts
var Lt = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"priority",
	"adapter"
], U = class extends x {
	constructor(...e) {
		super(...e), this.batteryId = "", this.capacityUnknown = !1, this.saving = !1;
	}
	static {
		this.styles = [A, o`
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
		(e.has("config") || e.has("batteryId")) && t && !this.draft && (this.draft = Object.fromEntries(Lt.map((e) => [e, structuredClone(t[e])])), this.capacityUnknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, draft: r } = this, i = this.battery;
		if (!e || !t || !n || !r || !i) return y;
		let a = this.discovery?.batteries.find((e) => e.id === i.id), o = !!Object.keys(i.controls).length && (a?.controllable ?? i.adapter !== "none"), s = yt(t, i.capacity_entity);
		return _`<div class="sheet-title">${E(e("edit.battery.title", { name: i.name }))}</div>
      ${this.field(e("f.battery.name"), "f_battery_name", _`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${r.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || i.name })}
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
                placeholder=${s == null ? e("f.unknown") : F(e.lang, s, 2)}
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
          ${s == null ? y : _`<p class="field-hint">${e("f.battery.capacity.read", { value: F(e.lang, s, 2) })}</p>`}`, O(e, R(n, `batteries[${i.id}].capacity_kwh`)))}
      ${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, r.soc_entity, `${gt(t, r.soc_entity, e.lang)}`, () => this.pickSoc()), O(e, R(n, `batteries[${i.id}].soc_entity`)))}
      ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, r.power?.entity_id ?? null, this.powerText(e, r.power), () => this.pickPower()), O(e, R(n, `batteries[${i.id}].power`)))}
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
            </span>`) : y}
      ${this.field(e("f.battery.control"), "f_battery_control", o ? _`<div class="toggle">
              <button
                type="button"
                id="control"
                class="switch"
                role="switch"
                aria-checked=${String(r.adapter !== "none")}
                aria-labelledby="control-label"
                @click=${() => this.set({ adapter: r.adapter === "none" ? a?.adapter ?? i.adapter ?? "none" : "none" })}
              ></button>
              <label id="control-label" for="control">${e("f.battery.control.allow")}</label>
            </div>
            <p class="field-hint">${e("f.battery.control.found", { count: Object.keys(i.controls).length })}</p>` : _`<p class="field-hint">${e("f.battery.control.none")}</p>`)}
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
      </div>`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return _`<div class="field" data-tipped>
      <div class="field-label">${e} ${I(i, t)} ${r ?? y}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return _`<div class="entity">
      <span>
        ${t ? _`<b>${P(i, t)}</b><small>${n}</small>` : _`<small>${e("find.none")}</small>`}
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
		let n = this.hass, r = vt(n, t);
		if (!t || r === null) return t ? gt(n, t.entity_id, e.lang) : "";
		let i = F(e.lang, Math.abs(r), 2);
		return e(r >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: i });
	}
	async pickSoc() {
		let { t: e, draft: t } = this;
		if (!e || !t) return;
		let n = await H(this, {
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
		let n = await H(this, {
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
		for (let r of Lt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
		let r = `capacity:${e.id}`, i = this.config.answers[r] === "unknown", a = {};
		if (Object.keys(n).length && (a.batteries = { [e.id]: n }), i !== this.capacityUnknown && (a.answers = { [r]: this.capacityUnknown ? "unknown" : null }), Object.keys(a).length) {
			this.saving = !0;
			let e = await V(this, a);
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
j([S({ attribute: !1 })], U.prototype, "hass", void 0), j([S({ attribute: !1 })], U.prototype, "t", void 0), j([S({ attribute: !1 })], U.prototype, "config", void 0), j([S({ attribute: !1 })], U.prototype, "discovery", void 0), j([S()], U.prototype, "batteryId", void 0), j([C()], U.prototype, "draft", void 0), j([C()], U.prototype, "capacityUnknown", void 0), j([C()], U.prototype, "saving", void 0), k("joe-battery-editor", U);
//#endregion
//#region src/types.ts
var Rt = [
	"welcome",
	"scan",
	"questions",
	"done"
], zt = [
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water",
	"ev",
	"comfort",
	"household",
	"submeter",
	"other"
], Bt = [
	"overview",
	"plan",
	"history",
	"learn",
	"devices",
	"settings"
], Vt = class extends x {
	static {
		this.styles = [A, o`
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
      @media (max-width: 480px) {
        li {
          grid-template-columns: 1fr;
        }
      }
    `];
	}
	render() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return y;
		let r = [...n.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return _`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${I(e, "f_consumer_kind")}</div>
      ${r.length ? _`<ul>
            ${r.map((r) => this.renderConsumer(e, t, n, r))}
          </ul>` : _`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
	renderConsumer(e, t, n, r) {
		let i = r.power_entity ? gt(t, r.power_entity, e.lang) : "";
		return _`<li>
      <div>
        <b>${r.name}</b>
        <small>${O(e, R(n, `consumers[${r.id}].kind`))}${i}</small>
      </div>
      <select
        class="input"
        aria-label=${e("consumers.kind_of", { name: r.name })}
        .value=${r.kind}
        @change=${(e) => this.setKind(r, e.target.value)}
      >
        ${zt.map((t) => _`<option value=${t} ?selected=${t === r.kind}>${e(`kind.${t}`)}</option>`)}
      </select>
    </li>`;
	}
	setKind(e, t) {
		t !== e.kind && V(this, { consumers: { [e.id]: { kind: t } } });
	}
};
j([S({ attribute: !1 })], Vt.prototype, "hass", void 0), j([S({ attribute: !1 })], Vt.prototype, "t", void 0), j([S({ attribute: !1 })], Vt.prototype, "config", void 0), k("joe-consumers", Vt);
//#endregion
//#region src/editors/household.ts
var Ht = class extends x {
	static {
		this.styles = [A, o`
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
		if (!e || !t || !n) return y;
		let r = (this.discovery?.persons ?? []).filter((e) => z(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return _`<div data-tipped>
      ${n.persons.length ? _`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : _`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add">
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${I(e, "f_person_add")}
      </div>
      ${r.length ? _`<div class="others">
            <span>${e("household.left_out")}</span>
            ${r.map((e) => _`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
          </div>` : y}
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
            ${P(t, r)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: P(t, r) })}
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
        ${I(e, "f_calendars")}
      </div>
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await H(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		V(this, {
			persons: { [n]: {
				name: P(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: B(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		V(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: B(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		V(this, {
			persons: { [e.id]: null },
			answers: { ignored: B(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await H(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		V(this, { persons: { [e.id]: { calendars: t } } });
	}
};
j([S({ attribute: !1 })], Ht.prototype, "hass", void 0), j([S({ attribute: !1 })], Ht.prototype, "t", void 0), j([S({ attribute: !1 })], Ht.prototype, "config", void 0), j([S({ attribute: !1 })], Ht.prototype, "discovery", void 0), k("joe-household", Ht);
//#endregion
//#region src/components/choice.ts
var Ut = "unknown", W = class extends x {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = o`
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
			value: Ut,
			label: this.idk
		}, "idk") : y}
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
      ${e.icon ? _`<ha-icon icon=${e.icon}></ha-icon>` : y}
      <span>${e.label}</span>
      ${n && this.multiple ? _`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : y}
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
j([S({ attribute: !1 })], W.prototype, "options", void 0), j([S({ attribute: !1 })], W.prototype, "value", void 0), j([S({ type: Boolean })], W.prototype, "multiple", void 0), j([S({ attribute: !1 })], W.prototype, "exclusive", void 0), j([S()], W.prototype, "idk", void 0), j([S()], W.prototype, "label", void 0), j([S({
	type: Boolean,
	reflect: !0
})], W.prototype, "compact", void 0), k("joe-choice", W);
//#endregion
//#region src/editors/tariff-form.ts
var G = class extends x {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [A, o`
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
		if (!e || !t) return y;
		let n = _`<joe-choice
      .options=${[
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
		]}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return _`${this.asQuestion ? n : _`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${I(e, "q_tariff")}</div>
            ${n}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : y}
      ${t.kind === "flat" ? this.renderFlat(e, t) : y}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : y}
      ${this.feedIn ? this.renderFeedIn(e, t) : y}`;
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
        <div class="field-label">${e("f.window")} ${I(e, "f_window")}</div>
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
        <div class="field-label">${e("f.prices")} ${I(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return _`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${I(e, "f_prices")}</div>
      ${this.centInput(e, t.day_price, "day_price")}
    </div>`;
	}
	renderDynamic(e, t) {
		let n = this.hass, r = t.price_entity;
		return _`<div class="field" data-tipped>
      <div class="field-label">${e("f.price_entity")} ${I(e, "f_price_entity")}</div>
      <div class="entity">
        ${r && n ? _`<span><b>${P(n, r)}</b> <small>${gt(n, r, e.lang)}</small></span>` : _`<small>${e("f.price_entity.none")}</small>`}
        <button type="button" class="mini-btn" @click=${this.pickPrice}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e(r ? "review.change" : "review.choose")}
        </button>
      </div>
    </div>`;
	}
	renderFeedIn(e, t) {
		let n = this.hass;
		return _`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${I(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? _`<p class="field-hint">
            ${e("f.feed_in.entity", { name: P(n, t.feed_in_entity) })}
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
		let n = this.discovery?.tariff, r = (await H(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: Ft(n?.price_entity ? [{
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
j([S({ attribute: !1 })], G.prototype, "hass", void 0), j([S({ attribute: !1 })], G.prototype, "t", void 0), j([S({ attribute: !1 })], G.prototype, "tariff", void 0), j([S({ attribute: !1 })], G.prototype, "discovery", void 0), j([S({ type: Boolean })], G.prototype, "feedIn", void 0), j([S({ type: Boolean })], G.prototype, "asQuestion", void 0), k("joe-tariff-form", G);
//#endregion
//#region src/editors/tariff-editor.ts
var Wt = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity"
];
function Gt(e, t) {
	let n = {};
	for (let r of Wt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
	return n;
}
var K = class extends x {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [A, o`
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
		return !e || !t ? y : _`<div class="sheet-title">${E(e("edit.tariff.title"))}</div>
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
		let n = Gt(e.tariff, t);
		if (Object.keys(n).length) {
			this.saving = !0;
			let e = { tariff: n };
			"kind" in n && (e.answers = { tariff: t.kind });
			let r = await V(this, e);
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
j([S({ attribute: !1 })], K.prototype, "hass", void 0), j([S({ attribute: !1 })], K.prototype, "t", void 0), j([S({ attribute: !1 })], K.prototype, "config", void 0), j([S({ attribute: !1 })], K.prototype, "discovery", void 0), j([C()], K.prototype, "draft", void 0), j([C()], K.prototype, "saving", void 0), k("joe-tariff-editor", K);
//#endregion
//#region src/fonts.ts
var Kt = [
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
function qt() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = Kt.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${w(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region src/components/chart.ts
var Jt = 40, Yt = 10, q = 16, Xt = 24;
function Zt(e) {
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
function Qt(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var J = class extends x {
	constructor(...e) {
		super(...e), this.labels = [], this.ticks = /* @__PURE__ */ new Map(), this.series = [], this.bands = [], this.markers = [], this.unit = "kWh", this.max = 0, this.height = 220, this.label = "", this.lang = "de", this.centerTicks = !1, this.width = 640, this.hover = null;
	}
	static {
		this.styles = o`
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
		if (!e) return y;
		let t = Math.max(260, this.width), n = this.height, r = t - Jt - Yt, i = n - q - Xt, a = r / e, o = this.series.flatMap((e) => e.values.filter((e) => e != null)), s = this.max || Zt(Math.max(.1, ...o)), c = (e) => q + i - Math.max(0, Math.min(e, s)) / s * i, l = (e) => Jt + e * a, u = (e) => Jt + (e + .5) * a, d = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), f = [];
		for (let e of this.bands) f.push(v`<rect class="band" x=${l(e.from)} y=${q} width=${Math.max(0, l(e.to) - l(e.from))} height=${i}></rect>
        <text class="note" x=${(l(e.from) + l(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of [
			0,
			s / 2,
			s
		]) f.push(v`<line class="grid" x1=${Jt} x2=${t - Yt} y1=${c(e)} y2=${c(e)}></line>
        <text class="tick" x=${34} y=${c(e) + 4} text-anchor="end">${d(e, 2)}</text>`);
		f.push(v`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) f.push(v`<text class="tick" x=${this.centerTicks ? u(e) : l(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let p = this.series.filter((e) => e.kind === "bar"), m = a * .68 / Math.max(1, p.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + p.indexOf(e) * m;
				e.values.forEach((n, r) => {
					n != null && n > 0 && f.push(v`<rect x=${l(r) + t} y=${c(n)} width=${Math.max(1, m - 1)}
              height=${Math.max(0, c(0) - c(n))} rx="2" fill=${e.color}></rect>`);
				});
				continue;
			}
			for (let t of Qt(e.values)) {
				let n = t.map(([e, t]) => `${u(e).toFixed(1)},${c(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = c(0).toFixed(1);
					f.push(v`<polygon points=${`${u(t[0][0]).toFixed(1)},${r} ${n} ${u(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? f.push(v`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : f.push(v`<circle cx=${u(t[0][0])} cy=${c(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = Jt + e.at * a, o = n < Jt + r * .75;
			f.push(v`<line class="marker" x1=${n} x2=${n} y1=${q} y2=${q + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && f.push(v`<line class="guide" x1=${u(this.hover)} x2=${u(this.hover)} y1=${q} y2=${q + i}></line>`);
		for (let t = 0; t < e; t++) f.push(v`<rect class="slot" x=${l(t)} y=${q} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return _`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${f}
      </svg>
      ${this.hover == null ? y : this.renderBox(this.hover, u(this.hover), t, d)}`;
	}
	renderBox(e, t, n, r) {
		return _`<div class="box" style="left:${t + 182 > n ? Math.max(0, t - 182) : t + 12}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? y : _`<div>
              <i style="background:${t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
j([S({ attribute: !1 })], J.prototype, "labels", void 0), j([S({ attribute: !1 })], J.prototype, "ticks", void 0), j([S({ attribute: !1 })], J.prototype, "series", void 0), j([S({ attribute: !1 })], J.prototype, "bands", void 0), j([S({ attribute: !1 })], J.prototype, "markers", void 0), j([S()], J.prototype, "unit", void 0), j([S({ type: Number })], J.prototype, "max", void 0), j([S({ type: Number })], J.prototype, "height", void 0), j([S()], J.prototype, "label", void 0), j([S()], J.prototype, "lang", void 0), j([S({ type: Boolean })], J.prototype, "centerTicks", void 0), j([C()], J.prototype, "width", void 0), j([C()], J.prototype, "hover", void 0), k("joe-chart", J);
//#endregion
//#region src/pages/history.ts
var $t = 14, en = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function tn(e, t, n) {
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
var Y = class extends x {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [A, o`
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
				days: $t
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
      ${E(e("history.title"))} ${T}
      <p class="status">${this.statusText(e)}</p>
      ${this.renderStrip(e, this.days.days)} ${this.detail ? this.renderDay(e, this.detail) : y}
    </div>` : this.renderEmpty(e) : y;
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
        ${E(e("history.title"))} ${T}
        <p class="lead">${e(n)}</p>
        ${this.failed ? _`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : y}
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
          aria-label=${tn(e.lang, t, "long")}
          @click=${() => this.select(t)}
        >
          <small>${tn(e.lang, t, "short")}</small>
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
		let n = t.summary, r = Math.max(0, n.expected - t.hours.filter((e) => e.cov >= .9).length), i = n.sources.live ?? 0, a = (n.sources.stats ?? 0) + (n.sources.history ?? 0);
		return _`<div class="day-head">
        <h3>${tn(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? _`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? _`<span class="chip">${e("history.day_off")}</span>` : y}
        ${i ? _`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : y}
        ${a ? _`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : y}
      </div>
      ${this.renderTiles(e, n)} ${this.renderEnergyChart(e, t)} ${this.renderSocChart(e, t)}
      ${r && n.date !== this.days?.days[0]?.date ? _`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : y}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : F(e.lang, t, 1), r = [], i = (e, t, n, r) => _`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? _`<div class="sub">${r}</div>` : y}
      </div>`;
		if (t.home != null && r.push(i(e("history.tile.home"), n(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: F(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && r.push(i(e("history.tile.solar"), n(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: n(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : F(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let a = [];
			t.grid_in_cheap != null && a.push(e("history.tile.grid.cheap", { value: n(t.grid_in_cheap) })), t.grid_out != null && a.push(e("history.tile.grid.out", { value: n(t.grid_out) })), r.push(i(e("history.tile.grid"), n(t.grid_in), "kWh", a.join(" · ")));
		}
		if (t.bat_in != null && r.push(i(e("history.tile.battery"), n(t.bat_in), "kWh", e("history.tile.battery.out", { value: n(t.bat_out) }))), t.temp && r.push(i(e("history.tile.temp"), F(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: F(e.lang, t.temp.min, 0),
			max: F(e.lang, t.temp.max, 0)
		}))), t.present) {
			let n = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), a = Object.entries(t.present), o = Math.max(...a.map(([, e]) => e));
			r.push(i(e("history.tile.present"), F(e.lang, o, 0), "h", a.map(([t, r]) => `${n.get(t) ?? t} ${F(e.lang, r, 0)} h`).join(" · ")));
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
      <div class="chart-head">${e("history.chart.energy")} ${I(e, "chart_energy")}</div>
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
				color: en[n % en.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return y;
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
      <div class="chart-head">${e("history.chart.soc")} ${I(e, "chart_soc")}</div>
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
	time(e) {
		return e.slice(11, 16);
	}
};
j([S({ attribute: !1 })], Y.prototype, "hass", void 0), j([S({ attribute: !1 })], Y.prototype, "t", void 0), j([S({ attribute: !1 })], Y.prototype, "state", void 0), j([C()], Y.prototype, "days", void 0), j([C()], Y.prototype, "selected", void 0), j([C()], Y.prototype, "detail", void 0), j([C()], Y.prototype, "failed", void 0), k("joe-history", Y);
//#endregion
//#region src/components/texts.ts
function nn(e, t) {
	return t == null ? "–" : F(e.lang, t * 100, 2);
}
function rn(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: nn(e, t.night_price),
		day: nn(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: nn(e, t.night_price),
		day: nn(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: nn(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: nn(e, t.feed_in_price) })}`), r;
}
function an(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = F(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = F(e.lang, Math.abs(t.expected), 1), n.actual = F(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/components/review.ts
var on = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), sn = class extends x {
	constructor(...e) {
		super(...e), this.checks = [], this.context = "setup";
	}
	static {
		this.styles = [A, o`
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
		return !e || !t || !n ? y : _`<ul class="found">
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
			chips: [O(t, { source: "read" })]
		}), i.push(...this.batteryRows(e, t, n)), i.push(this.tariffRow(t, n)), i.push(this.forecastRow(t, n)), i.push(this.powerRow(e, t, n, "grid_power")), i.push(this.powerRow(e, t, n, "home_power")), i.push(this.solarRow(e, t, n));
		for (let e of r?.wallboxes.filter((e) => e.is_car) ?? []) i.push({
			key: `wallbox:${e.name}`,
			icon: "mdi:ev-station",
			title: t("find.wallbox"),
			detail: `${e.name} · ${t("review.wallbox.later")}`,
			chips: [_`<span class="chip soon">${t("review.later")}</span>`]
		});
		i.push(this.contextRow(e, t, n, "weather")), i.push(this.contextRow(e, t, n, "holiday"));
		let o = this.context === "settings", s = [_`<span class="chip soon">${t("review.ask_later")}</span>`];
		if (o || n.persons.length || r?.calendars.length) {
			let e = o ? n.persons.reduce((e, t) => e + t.calendars.length, 0) : r?.calendars.length ?? 0;
			i.push({
				key: "people",
				icon: "mdi:account-group-outline",
				title: t("find.people"),
				detail: t("find.people.detail", {
					persons: this.count(t, n.persons.length, "word.person"),
					calendars: this.count(t, e, "word.calendar")
				}),
				chips: o ? [] : s,
				tip: o ? "q_household" : void 0,
				actions: o ? [this.button(t("review.change"), "mdi:account-edit-outline", () => this.edit("household"))] : void 0
			});
		}
		let c = n.consumers.filter((e) => e.kind !== "submeter");
		return c.length && i.push({
			key: "devices",
			icon: "mdi:devices",
			title: t("find.devices"),
			detail: t("find.devices.detail", {
				count: this.count(t, c.length, "word.device"),
				heating: c.filter((e) => on.has(e.kind)).length
			}),
			chips: o ? [] : s,
			tip: o ? "f_consumer_kind" : void 0,
			actions: o ? [this.button(t("review.assign"), "mdi:devices", () => this.edit("consumers"))] : void 0
		}), i;
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let i of n.batteries) {
			let a = this.discovery?.batteries.find((e) => e.id === i.id), o = ht(e, i.soc_entity), s = i.capacity_kwh ?? yt(e, i.capacity_entity), c = [
				s ? `${F(t.lang, s, 2)} kWh` : t("review.capacity_unknown"),
				o === null ? null : `${F(t.lang, o, 0)} %`,
				i.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], l = this.checks.filter((e) => e.battery_id === i.id).map((e) => this.note(t, e));
			r.push({
				key: `battery:${i.id}`,
				icon: "mdi:home-battery-outline",
				title: i.name,
				detail: c.filter(Boolean).join(" · "),
				chips: [O(t, R(n, `batteries[${i.id}].soc_entity`)), ...a ? [D(t, a.confidence)] : []],
				reasons: a?.reasons,
				notes: l,
				state: this.checks.some((e) => e.battery_id === i.id && e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [this.button(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", i.id)), this.button(t("review.ignore"), "", () => this.ignoreBattery(i.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) z(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
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
		V(this, {
			batteries: { [e]: null },
			answers: { ignored: B(this.config, `battery:${e}`, !0) }
		});
	}
	useBattery(e) {
		let t = this.config;
		V(this, {
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
			answers: { ignored: B(t, `battery:${e.id}`, !1) }
		}, "read");
	}
	async addBattery() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return;
		let r = (await H(this, {
			heading: e("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [],
			exclude: n.batteries.map((e) => e.soc_entity)
		}))?.selected[0];
		if (!r) return;
		let i = t.entities?.[r]?.device_id, a = i && !n.batteries.some((e) => e.id === i) ? i : r;
		V(this, { batteries: { [a]: {
			name: i && (t.devices?.[i]?.name_by_user || t.devices?.[i]?.name) || P(t, r),
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
			detail: rn(e, n),
			chips: r ? [] : [O(e, R(t, "tariff.kind")), ...this.discovery && this.discovery.tariff.kind !== "unknown" ? [D(e, this.discovery.tariff.confidence)] : []],
			reasons: this.discovery?.tariff.reasons,
			notes: r ? [this.info(e("review.tariff.ask"))] : [],
			state: r ? "missing" : void 0,
			tip: "review_tariff",
			actions: [this.button(e(r ? "review.enter" : "review.change"), "mdi:pencil-outline", () => this.edit("tariff"))]
		};
	}
	forecastRow(e, t) {
		let n = this.discovery?.forecast, r = z(t, "forecast"), i = {
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
				today: n.today_kwh == null ? "–" : F(e.lang, n.today_kwh, 1),
				tomorrow: n.tomorrow_kwh == null ? "–" : F(e.lang, n.tomorrow_kwh, 1)
			}) : t.forecast.provider,
			chips: [O(e, R(t, "forecast.provider")), ...n ? [D(e, n.confidence)] : []],
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
		V(this, {
			forecast: {
				provider: null,
				config_entries: [],
				today: [],
				tomorrow: [],
				remaining_today: []
			},
			answers: { ignored: B(this.config, "forecast", !0) }
		});
	}
	useForecast() {
		let e = this.discovery?.forecast;
		e && V(this, {
			forecast: {
				provider: e.provider,
				config_entries: e.config_entries ?? [],
				today: e.today ?? [],
				tomorrow: e.tomorrow ?? [],
				remaining_today: e.remaining_today ?? []
			},
			answers: { ignored: B(this.config, "forecast", !1) }
		}, "read");
	}
	powerRow(e, t, n, r) {
		let i = n.measurements[r], a = this.discovery?.measurements[r] ?? null, o = r === "grid_power", s = z(n, r), c = {
			key: r,
			icon: o ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
			title: t(o ? "find.grid" : "find.home"),
			tip: o ? "review_grid" : "review_home"
		}, l = this.button(t(i ? "review.change" : "review.choose"), "mdi:magnify", () => this.pickPower(r));
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
		let u = vt(e, i), d = gt(e, i.entity_id, t.lang);
		if (u !== null) {
			let e = F(t.lang, Math.abs(u), 2);
			d = o ? t(u >= 0 ? "live.import" : "live.export", { value: e }) : t("live.kw", { value: F(t.lang, u, 2) });
		}
		let f = this.checks.filter((e) => e.code !== "missing" && (e.role === r || o && e.code === "grid_sign" || !o && e.code === "home_negative")), p = f.map((e) => e.code === "grid_sign" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		})), this.button(t("review.keep"), "mdi:check", () => this.confirm(`grid_sign:${i.entity_id}`), !0)]) : e.code === "home_negative" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		}))]) : this.note(t, e)), m = a?.entity.entity_id === i.entity_id;
		return {
			...c,
			detail: `${P(e, i.entity_id)} · ${d}`,
			chips: [O(t, R(n, `measurements.${r}`)), ...a && m ? [D(t, a.confidence)] : []],
			reasons: m ? a?.reasons : void 0,
			notes: p,
			state: f.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l]
		};
	}
	async pickPower(e) {
		let { t, config: n } = this;
		if (!t || !n) return;
		let r = n.measurements[e], i = this.discovery?.measurements[e], a = e === "grid_power", o = await H(this, {
			heading: t(a ? "pick.grid.title" : "pick.home.title"),
			tip: a ? "pick_grid" : "pick_home",
			filter: "power",
			selected: r ? [r.entity_id] : [],
			suggestions: Ft(i ? [It(i)] : [], i?.alternatives),
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
		z(n, e) && (c.answers = { ignored: B(n, e, !1) }), V(this, c);
	}
	setPower(e, t) {
		V(this, { measurements: { [e]: t } });
	}
	solarRow(e, t, n) {
		let r = n.measurements.solar_power, i = this.discovery?.measurements.solar_power ?? null, a = {
			key: "solar_power",
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			tip: "review_solar"
		};
		if (!r.length) return z(n, "solar_power") ? {
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
		let o = bt(e, r), s = this.checks.filter((e) => e.role === "solar_power" && e.code !== "missing").map((e) => this.note(t, e));
		return {
			...a,
			detail: t("find.solar.detail", {
				count: this.count(t, r.length, "word.sensor"),
				total: o === null ? "–" : F(t.lang, o, 2)
			}),
			chips: [O(t, R(n, "measurements.solar_power")), ...i ? [D(t, i.confidence)] : []],
			reasons: i?.reasons,
			notes: s,
			state: s.length && this.checks.some((e) => e.role === "solar_power" && e.level === "warn") ? "flag" : void 0,
			actions: [this.button(t("review.change"), "mdi:magnify", () => this.pickSolar())]
		};
	}
	async pickSolar() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = t.measurements.solar_power, r = this.discovery?.measurements.solar_power, i = await H(this, {
			heading: e("pick.solar.title"),
			tip: "pick_solar",
			filter: "power",
			multiple: !0,
			selected: n.map((e) => e.entity_id),
			suggestions: Ft((r?.entities ?? []).map((e) => ({
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
		z(t, "solar_power") && (a.answers = { ignored: B(t, "solar_power", !1) }), V(this, a);
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
				detail: P(e, a),
				chips: [O(t, R(n, `context.${i}`)), ...o && l ? [D(t, o.confidence)] : []],
				reasons: l ? o?.reasons : void 0,
				actions: [this.button(t("review.change"), "mdi:magnify", c), this.button(t("review.ignore"), "", () => this.ignore(r, { context: { [i]: null } }), !0)]
			};
		}
		return z(n, r) ? {
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
		let r = e === "weather" ? "weather_entity" : "holiday_entity", i = this.discovery?.[e], a = n.context[r], o = (await H(this, {
			heading: t(e === "weather" ? "pick.weather.title" : "pick.holiday.title"),
			tip: e === "weather" ? "pick_weather" : "pick_holiday",
			filter: e === "weather" ? "weather" : "workday",
			selected: a ? [a] : i ? [i.entity.entity_id] : [],
			suggestions: Ft(i ? [It(i)] : [], i?.alternatives)
		}))?.selected[0];
		o && V(this, {
			context: { [r]: o },
			answers: { ignored: B(n, e, !1) }
		});
	}
	ignore(e, t) {
		V(this, {
			...t,
			answers: { ignored: B(this.config, e, !0) }
		});
	}
	confirm(e) {
		let t = this.config.answers.confirmed.filter((t) => t !== e);
		V(this, { answers: { confirmed: [...t, e] } });
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
      ${t ? _`<ha-icon icon=${t}></ha-icon>` : y}${e}
    </button>`;
	}
	info(e) {
		return _`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
	}
	note(e, t, n = []) {
		return _`<div class="note ${t.level}">
      <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <div>
        <span>${an(e, t)}</span>
        ${n.length ? _`<div class="note-actions">${n}</div>` : y}
      </div>
    </div>`;
	}
	count(e, t, n) {
		let [r, i] = e(n).split("|");
		return `${F(e.lang, t, 0)} ${t === 1 ? r : i}`;
	}
	renderRow(e, t) {
		return _`<li class="item ${t.state ?? ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
      <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
      <div class="text">
        <div class="head">
          <span class="t">${t.title}</span>
          ${t.chips?.length ? _`<span class="chips">${t.chips}</span>` : y}
        </div>
        <div class="d">${t.detail}</div>
        ${t.reasons?.length ? _`<details data-notip>
              <summary>${e("scan.why")}</summary>
              <ul>
                ${t.reasons.map((t) => _`<li>${it(e, t)}</li>`)}
              </ul>
            </details>` : y}
        ${t.notes ?? y}
        ${t.actions?.length ? _`<div class="row-actions">${t.actions}${t.tip ? I(e, t.tip) : y}</div>` : y}
      </div>
    </li>`;
	}
};
j([S({ attribute: !1 })], sn.prototype, "hass", void 0), j([S({ attribute: !1 })], sn.prototype, "t", void 0), j([S({ attribute: !1 })], sn.prototype, "config", void 0), j([S({ attribute: !1 })], sn.prototype, "discovery", void 0), j([S({ attribute: !1 })], sn.prototype, "checks", void 0), j([S()], sn.prototype, "context", void 0), k("joe-review", sn);
//#endregion
//#region src/pages/questions.ts
var cn = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, ln = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function un(e) {
	let t = [], n = (t) => R(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var dn = class extends x {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [A, o`
      :host {
        display: block;
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
		if (!e || !t) return y;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = un(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1;
		return _`<div class="wrap">
      <joe-pose name=${cn[i.split(":")[0]] ?? "ask"}></joe-pose>
      <div>
        <div class="eyebrow">${e("ask.count", {
			n: r + 1,
			total: n.length
		})}</div>
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
			case "hot_water": return this.question(e("q.hot_water.title"), "q_hot_water", this.choice(e, "hot_water", [
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
			]));
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
      <div class="title-row">${E(e, "h2", I(r, t))}</div>
      ${T}
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
      @joe-choice=${(e) => V(this, { answers: { [t]: r ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => ln.includes(e));
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
        ${a && t.consumers.length ? _`<div class="follow">
              <p class="hint">${i.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${i.length ? _`<div class="chips">
                    ${i.map((e) => _`<span class="chip learned">${e.name}</span>`)}
                  </div>` : y}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${I(e, "f_consumer_kind")}
              </div>
            </div>` : y}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === Ut;
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
			V(this, {
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
          @click=${() => V(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => V(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: Ut }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return _``;
		let i = `capacity:${n}`, a = t.answers[i] === Ut;
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
			V(this, {
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
          @click=${() => V(this, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: Ut }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), V(this, t);
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
j([S({ attribute: !1 })], dn.prototype, "hass", void 0), j([S({ attribute: !1 })], dn.prototype, "t", void 0), j([S({ attribute: !1 })], dn.prototype, "config", void 0), j([S({ attribute: !1 })], dn.prototype, "discovery", void 0), j([S()], dn.prototype, "single", void 0), j([C()], dn.prototype, "index", void 0), k("joe-questions", dn);
//#endregion
//#region src/pages/onboarding.ts
function fn(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${F(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
var pn = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, X = class extends x {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [A, o`
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
		if (!e) return y;
		switch (this.step) {
			case "welcome": return this.layout("welcome", _`${E(e("onb.welcome.title"), "h1")} ${T}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              <p>${e("onb.welcome.more.text")}</p>
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${I(e, "scan_start")}
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
		return this.discovering || !this.discovery && !this.discoveryFailed ? this.layout("scout", _`${E(e("onb.scan.title"))} ${T}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`) : _`<div class="wrap wide">
      <joe-pose name="scout"></joe-pose>
      <div>
        ${E(e("scan.title"))} ${T}
        <p class="lead">${e("scan.lead")}</p>
        ${this.discoveryFailed ? _`<p class="failed">${e("scan.failed")}</p>` : y}
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
            ${I(e, "rescan")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
            ${e("onb.back")}
          </button>
        </div>
      </div>
    </div>`;
	}
	renderDone(e) {
		return this.layout("thumbs", _`${E(e("onb.done.title"))} ${T}
        ${this.config ? this.renderSummary(e, this.config) : y}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${e("onb.done.go")}</button>
            ${I(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`);
	}
	renderSummary(e, t) {
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? yt(n, t.capacity_entity) : null) ?? 0), 0), i = (n, r) => {
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, a = this.discovery?.forecast;
		return _`<div class="lines">
      ${[
			[e("sum.batteries"), t.batteries.length ? e("sum.batteries.value", {
				count: t.batteries.length,
				kwh: r ? F(e.lang, r, 1) : "?"
			}) : e("sum.none")],
			[e("sum.tariff"), t.tariff.kind === "unknown" ? e("sum.unknown") : rn(e, t.tariff, !1)],
			[e("sum.feed_in"), t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : e("sum.unknown") : `${nn(e, t.tariff.feed_in_price)} ct`],
			[e("sum.forecast"), t.forecast.provider ? a ? e("sum.forecast.value", {
				provider: a.provider_name,
				planes: fn(e, a.planes, "word.plane")
			}) : t.forecast.provider : e("sum.none")],
			[e("sum.heating"), i("heating", pn)],
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
				persons: fn(e, t.persons.length, "word.person"),
				calendars: fn(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
			})]
		].map(([e, t]) => _`<div><span>${e}</span><span>${t}</span></div>`)}
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
j([S()], X.prototype, "step", void 0), j([S({ attribute: !1 })], X.prototype, "t", void 0), j([S({ attribute: !1 })], X.prototype, "info", void 0), j([S({ attribute: !1 })], X.prototype, "hass", void 0), j([S({ attribute: !1 })], X.prototype, "config", void 0), j([S({ attribute: !1 })], X.prototype, "discovery", void 0), j([S({ attribute: !1 })], X.prototype, "checks", void 0), j([S({ type: Boolean })], X.prototype, "discovering", void 0), j([S({ type: Boolean })], X.prototype, "discoveryFailed", void 0), k("joe-onboarding", X);
//#endregion
//#region src/components/plan-text.ts
function Z(e) {
	return e ? e.slice(11, 16) : "";
}
function mn(e) {
	return e.slice(0, 10);
}
function hn(e) {
	switch (e?.kind) {
		case "charge": return "plug";
		case "hold": return "switch";
		case "none": return "relax";
		default: return "sleep";
	}
}
function gn(e, t) {
	if (!t.window) return "";
	let n = [`${Z(t.window.start)}–${Z(t.window.end)}`];
	return t.prices && n.push(`${F(e.lang, t.prices.night * 100, 1)} ct/kWh`), n.join(" · ");
}
function _n(e, t) {
	if (t.kind === "unavailable") {
		let n = t.reasons.find((t) => e.optional(`plan.why.${t}`)) ?? "failed";
		return e.optional(`plan.why.${n}`) ?? "";
	}
	let n = [], r = F(e.lang, t.target ?? 0, 0), i = t.sun_takes_over;
	return t.kind === "charge" ? n.push(e("plan.say.charge", {
		from: Z(t.charge_from),
		target: r
	})) : t.kind === "hold" ? (n.push(e("plan.say.hold", { target: r })), t.empty_without && n.push(e("plan.say.empty", { time: Z(t.empty_without) }))) : n.push(i ? e("plan.say.none", { time: Z(i) }) : e("plan.say.none_nosun")), t.kind !== "none" && (i && t.full_at && mn(t.full_at) === mn(i) ? n.push(e("plan.say.sun_full", {
		sun: Z(i),
		full: Z(t.full_at)
	})) : i ? n.push(e("plan.say.sun", { sun: Z(i) })) : n.push(e("plan.say.nosun"))), n.join(" ");
}
function vn(e, t) {
	return (t.batteries ?? []).map((n) => {
		let r = [n.name];
		return t.kind === "charge" ? r.push(`${F(e.lang, n.soc_start, 0)} → ${F(e.lang, n.target, 0)} %`, `${F(e.lang, n.charge_kwh, 1)} kWh`, `${F(e.lang, n.power_kw, 1)} kW`) : t.kind === "hold" ? r.push(e("plan.line.hold", { target: F(e.lang, n.target, 0) })) : r.push(e("plan.line.now", { soc: F(e.lang, n.soc, 0) })), n.controllable || r.push(e("plan.line.watch_only")), r.join(" · ");
	});
}
function yn(e, t, n = "EUR") {
	if (!t.cost) return "";
	let r = (t) => new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n
	}).format(t), i = [];
	return t.kind === "charge" && i.push(e("plan.cost.night", { value: r(t.cost.night_charge) })), t.cost.saving > .005 && i.push(e("plan.cost.saving", { value: r(t.cost.saving) })), i.join(" · ");
}
//#endregion
//#region src/pages/overview.ts
var bn = class extends x {
	constructor(...e) {
		super(...e), this.prefix = "/energy-joe";
	}
	static {
		this.styles = [A, o`
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
        right: -6px;
        top: 10px;
        width: 170px;
        pointer-events: none;
      }
      .night .head .eyebrow {
        flex: none;
        max-width: calc(100% - 210px);
      }
      .night .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(44px, 6vw, 64px);
        line-height: 1;
        margin-top: 12px;
        max-width: 62%;
        font-variant-numeric: tabular-nums;
      }
      .night .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .night .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 60ch;
      }
      .night .lines {
        display: grid;
        gap: 2px;
        margin-top: 10px;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .night .cost {
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
          width: 120px;
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
		if (!e) return y;
		let t = !!this.state?.observe?.active, n = !!(this.state?.plan && this.state.plan.kind !== "unavailable");
		return _`<div class="grid">
      ${this.renderNow(e)} ${this.renderWeek(e)}
      ${this.renderNight(e)}
      <section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")}</div>
        ${E(e("overview.sim.empty.title"))} ${T}
        <p class="lead">${e("overview.sim.empty.text")}</p>
      </section>
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
          <li>
            <b>${e("overview.next.4.title")}</b><span>${e("overview.next.4.text")}</span>
            <span class="chip soon">${e("soon")}</span>
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
        ${E(e("overview.night.empty.title"))} ${T}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let n = vn(e, t), r = yn(e, t, this.hass?.config?.currency), i = t.kind === "charge" || t.kind === "hold" ? _`${F(e.lang, t.target ?? 0, 0)}<small>%</small>` : _`${e(t.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return _`<section class="card night" data-tipped>
      <joe-pose name=${hn(t)}></joe-pose>
      <div class="head">
        <div class="eyebrow">
          <ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}${t.window ? ` · ${gn(e, t)}` : ""}
        </div>
        ${I(e, "plan_target")}
      </div>
      <div class="big">${i}</div>
      ${T}
      <p class="say">${_n(e, t)}</p>
      ${n.length ? _`<div class="lines">${n.map((e) => _`<div>${e}</div>`)}</div>` : y}
      ${r ? _`<p class="cost">${r}</p>` : y}
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
	renderNow(e) {
		let t = this.hass, n = this.state?.config;
		if (!t || !n) return _``;
		let r = n.measurements, i = r.solar_power.length ? bt(t, r.solar_power) : null, a = vt(t, r.grid_power), o = n.batteries.map((e) => ({
			power: vt(t, e.power),
			soc: ht(t, e.soc_entity)
		})), s = o.filter((e) => e.power != null), c = s.length ? s.reduce((e, t) => e + (t.power ?? 0), 0) : null, l = vt(t, r.home_power), u = l == null && a != null;
		u && (l = (a ?? 0) + (i ?? 0) - (c ?? 0));
		let d = o.map((e) => e.soc).filter((e) => e != null), f = (t) => t == null ? "–" : F(e.lang, Math.abs(t), 2), p = (e, t, n, r, i) => _`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${f(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, m = (e) => e == null || Math.abs(e) < .05;
		return _`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("overview.now")}</div>
        ${I(e, "now")}
      </div>
      <div class="now">
        ${p("sun", "mdi:solar-power", e("overview.now.solar"), i, e(i == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${p("home", "mdi:home-lightning-bolt-outline", e("overview.now.home"), l, e(l == null ? "overview.now.none" : u ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${p("battery", "mdi:home-battery-outline", m(c) ? e("overview.now.battery") : e(c > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), c, d.length ? d.length === 1 ? e("overview.now.soc", { value: F(e.lang, d[0], 0) }) : e("overview.now.soc_avg", {
			value: F(e.lang, d.reduce((e, t) => e + t, 0) / d.length, 0),
			count: d.length
		}) : n.batteries.length ? e("overview.now.none") : e("overview.now.no_battery"))}
        ${p("net", "mdi:transmission-tower", m(a) ? e("overview.now.grid") : e(a > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), a, a == null ? e("overview.now.none") : m(a) ? e("overview.now.grid.idle") : e(a > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
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
		return _`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${I(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? _`<joe-chart
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
                ${i.map((e) => _`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
              </div>
              <a class="btn btn-secondary" data-notip href=${this.historyHref()} @click=${this.openHistory}
                >${e("overview.week.more")}</a
              >
            </div>` : y}
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
j([S({ attribute: !1 })], bn.prototype, "t", void 0), j([S({ attribute: !1 })], bn.prototype, "hass", void 0), j([S({ attribute: !1 })], bn.prototype, "state", void 0), j([S()], bn.prototype, "prefix", void 0), j([C()], bn.prototype, "week", void 0), k("joe-overview", bn);
//#endregion
//#region src/pages/plan.ts
var xn = 36e5, Sn = class extends x {
	constructor(...e) {
		super(...e), this.refreshing = !1;
	}
	static {
		this.styles = [A, o`
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
        right: 0;
        top: 8px;
        width: 180px;
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
          width: 120px;
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
		if (!e) return y;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let n = vn(e, t), r = yn(e, t, this.hass?.config?.currency);
		return _`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${gn(e, t)}</div>
      ${E(e("plan.page.title"))} ${T}
      <div class="top" data-tipped>
        <span class="pill-sim">${e("mode.simulation")}</span>
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${I(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${hn(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : _`${F(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${_n(e, t)} ${I(e, "plan_target")}</p>
        ${n.length ? _`<div class="lines">${n.map((e) => _`<div>${e}</div>`)}</div>` : y}
        ${r ? _`<p class="cost">${r}</p>` : y}
      </section>
      ${this.renderEnergy(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)} ${this.renderMath(e, t)}
    </div>`;
	}
	renderEmpty(e, t) {
		let n = t ? _n(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return _`<div class="empty">
      <joe-pose name=${t ? hn(t) : "plan"}></joe-pose>
      <div>
        ${E(e("plan.title"))} ${T}
        <p class="lead">${n}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${Z(e.start)}–${Z(n[t + 1]?.start) || r(Z(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = Z(t.start);
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
					if (t >= r && t < r + xn) return e + (t - r) / xn;
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
			let n = Z(t.sun_takes_over);
			a.push({
				at: o,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return _`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${I(e, "chart_plan_energy")}</div>
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
				label: e("plan.chart.reserve", { value: F(e.lang, i, 0) }),
				kind: "line",
				values: n.map(() => i),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], o = [], s = r.at(t.window?.end);
		s != null && t.kind !== "none" && o.push({
			at: s,
			label: e("plan.chart.target", { value: F(e.lang, t.target ?? 0, 0) })
		});
		let c = r.at(t.full_at);
		return c != null && o.push({
			at: c,
			label: e("plan.chart.full", { time: Z(t.full_at) }),
			short: `${Z(t.full_at)}`
		}), _`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${I(e, "chart_plan_soc")}</div>
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
		let n = (t, n = 1) => t == null ? "–" : `${F(e.lang, t, n)} kWh`, r = (t) => t == null ? "–" : `${F(e.lang, t * 100, 1)} ct`, i = t.window?.start.slice(0, 10) ?? "", a = t.meta?.solar.sources[i] ?? "none", o = t.meta?.solar_factor ?? 1, s = t.meta?.consumption, c = [
			[e("plan.math.battery_now"), _`${F(e.lang, t.soc_now ?? 0, 0)} %<small
            >${e("plan.math.battery_now.sub", {
				stored: F(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
				capacity: F(e.lang, t.capacity_kwh ?? 0, 1)
			})}</small
          >`],
			[e("plan.math.battery_start"), `${F(e.lang, t.soc_start ?? 0, 0)} %`],
			[e("plan.math.solar"), _`${n(t.solar_kwh)}<small
            >${e(`plan.math.solar.${a}`)}${o === 1 ? "" : ` · ${e("plan.math.solar.factor", { value: F(e.lang, o, 2) })}`}</small
          >`],
			[e("plan.math.home"), _`${n(t.home_kwh)}<small
            >${s?.source === "history" ? e("plan.math.home.history", {
				days: s.days,
				kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
			}) : e("plan.math.home.default")}</small
          >`],
			[e("plan.math.target"), _`${F(e.lang, t.target ?? 0, 0)} %<small
            >${e("plan.math.target.sub", {
				optimum: F(e.lang, t.optimum ?? 0, 0),
				buffer: F(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
			})}</small
          >`],
			[e("plan.math.prices"), _`${e("plan.math.prices.value", {
				night: r(t.prices?.night),
				day: r(t.prices?.day),
				feed: r(t.prices?.feed_in)
			})}${t.prices?.assumed ? _`<small>${e("plan.math.prices.assumed")}</small>` : y}`],
			[e("plan.math.rules"), e("plan.math.rules.value", {
				reserve: F(e.lang, t.rules?.reserve ?? 0, 0),
				max: F(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			})]
		], l = [...new Set(t.notes ?? [])].map((t) => e.optional(`plan.note.${t}`)).filter(Boolean);
		return _`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${I(e, "plan_math")}</div>
      <dl>${c.map(([e, t]) => _`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      ${l.map((e) => _`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`)}
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
j([S({ attribute: !1 })], Sn.prototype, "hass", void 0), j([S({ attribute: !1 })], Sn.prototype, "t", void 0), j([S({ attribute: !1 })], Sn.prototype, "state", void 0), j([C()], Sn.prototype, "refreshing", void 0), k("joe-plan-page", Sn);
//#endregion
//#region src/pages/settings.ts
var Cn = [
	"simulation",
	"off",
	"live"
], wn = [
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
		step: 1
	},
	{
		key: "reset_lead_min",
		unit: "min",
		min: 0,
		max: 60,
		step: 1
	}
], Tn = [
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
], En = {
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
}, Q = class extends x {
	constructor(...e) {
		super(...e), this.checks = [], this.pro = !1, this.question = "";
	}
	static {
		this.styles = [A, o`
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
		if (!e || !t) return y;
		let n = t.config;
		return _`<div class="list">
        <section class="group">
          <h2>${e("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.mode")}</b>${I(e, "mode")}</div>
              <small>${e("settings.mode.hint")} ${e("settings.live.unavailable")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("settings.mode")}>
              ${Cn.map((n) => _`<button
                    type="button"
                    aria-pressed=${String(t.mode === n)}
                    ?disabled=${n === "live"}
                    @click=${() => this.emit("joe-set-mode", { mode: n })}
                  >
                    ${e(`mode.${n}`)}
                  </button>`)}
            </div>
          </div>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.setup")}</b>${I(e, "restart")}</div>
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
          ${Tn.map((t) => this.answerRow(e, t.key, t.tip))}
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
                ${wn.slice(0, 5).map((t) => this.numberRow(e, n.rules, t))}
                ${this.priorityRow(e, n.rules)} ${this.dischargeRow(e, n.rules)}
                ${wn.slice(5).map((t) => this.numberRow(e, n.rules, t))}` : y}
        </section>

        <section class="group">
          <h2>${e("settings.about")}</h2>
          <div class="row"><b>${e("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.energy")}</b><span class="value">${this.energyText(e)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(e) : y}`;
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
          <div class="name"><b>${e("settings.observe.recording")}</b>${I(e, "observe")}</div>
          <small>${o}</small>
        </div>
        <span class="chip ${r ? "ok" : ""}">
          ${e(r ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${I(e, "rebuild")}</div>
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
		let r = this.state.config, i = r.answers[t], a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [], o = i === "unknown" ? e("sum.unknown") : a.length ? a.map((n) => En[t][n] ? e(En[t][n]) : n).join(", ") : e("sum.open");
		return _`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`settings.answer.${t}`)}</b>${I(e, n)}</div>
        <small>${o}</small>
      </div>
      <div class="control">
        ${i == null ? y : O(e, R(r, `answers.${t}`))}
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
		let r = this.state.config, i = t[n.key], a = n.scale ?? 1, o = i == null ? "" : String(Math.round(i * a * 100) / 100), s = this.info?.defaults?.rules[n.key], c = R(r, `rules.${n.key}`), l = c?.source === "user";
		return _`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`rule.${n.key}`)}</b>${I(e, `r_${n.key}`)}</div>
        <small>${e(`rule.${n.key}.hint`)}</small>
      </div>
      <div class="control">
        ${O(e, c)}
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
            .value=${o}
            @change=${(e) => this.setNumber(n, e.target)}
          />
          <span class="unit">${n.unit}</span>
        </span>
        ${l && s !== void 0 ? _`<button
              type="button"
              class="mini-btn quiet"
              @click=${() => V(this, { rules: { [n.key]: s } }, "default")}
            >
              <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
            </button>` : y}
      </div>
    </div>`;
	}
	setNumber(e, t) {
		let n = t.value.trim(), r = e.scale ?? 1;
		if (n === "") {
			e.optional && V(this, { rules: { [e.key]: null } });
			return;
		}
		let i = Number.parseFloat(n);
		if (!Number.isFinite(i) || i < e.min || i > e.max) {
			t.reportValidity();
			return;
		}
		let a = e.unit === "min" ? Math.round(i) : Math.round(i / r * 1e4) / 1e4;
		V(this, { rules: { [e.key]: a } });
	}
	priorityRow(e, t) {
		let n = this.state.config, r = t.priority, i = (e, t) => {
			let n = [...r];
			[n[e], n[e + t]] = [n[e + t], n[e]], V(this, { rules: { priority: n } });
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
        <div class="name"><b>${e("rule.priority")}</b>${I(e, "r_priority")}</div>
        <small>${e("rule.priority.hint")}</small>
      </div>
      <div class="control">
        ${O(e, R(n, "rules.priority"))}
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
          <b>${e("rule.discharge_in_window")}</b>${I(e, "r_discharge_in_window")}
          ${O(e, R(n, "rules.discharge_in_window"))}
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
			e.detail.value[0] && V(this, { rules: { discharge_in_window: e.detail.value[0] } });
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
j([S({ attribute: !1 })], Q.prototype, "t", void 0), j([S({ attribute: !1 })], Q.prototype, "hass", void 0), j([S({ attribute: !1 })], Q.prototype, "state", void 0), j([S({ attribute: !1 })], Q.prototype, "info", void 0), j([S({ attribute: !1 })], Q.prototype, "discovery", void 0), j([S({ attribute: !1 })], Q.prototype, "checks", void 0), j([C()], Q.prototype, "pro", void 0), j([C()], Q.prototype, "question", void 0), k("joe-settings", Q);
//#endregion
//#region src/styles/tokens.ts
var Dn = o`
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
`, On = [
	"simulation",
	"live",
	"off"
], kn = {
	simulation: "mdi:pause",
	live: "mdi:play",
	off: "mdi:power"
}, An = ["simulation", "off"], jn = {
	learn: {
		pose: "learn",
		title: "learn.title",
		text: "learn.text"
	},
	devices: {
		pose: "switch",
		title: "devices.title",
		text: "devices.text"
	}
}, $ = class extends x {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
			this.picker = e.detail;
		}), this.addEventListener("joe-edit", (e) => {
			this.editor = e.detail;
		});
	}
	get t() {
		return tt(this.hass?.language);
	}
	get page() {
		let e = (this.route?.path ?? "").split("/")[1] ?? "";
		return Bt.includes(e) ? e : "overview";
	}
	connectedCallback() {
		super.connectedCallback(), qt(), this.subscribe();
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
		!e || this.discovering || this.discoveryFailed || (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? this.page === "settings" : e.onboarding.step !== "welcome") && this.look());
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
        ${this.joe.mode === "simulation" ? _`<div class="simband" aria-hidden="true"></div>` : y}
        <div class="bar">
          ${this.narrow ? _`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : y}
          <div class="brand">
            <img class="light" src=${w("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${w("joe-head-dark.webp")} alt="" width="36" height="36" />
            <span class="wordmark">ENERGY <b>JOE</b></span>
          </div>
          ${t ? this.renderSteps(e) : this.renderTabs(e)}
          <joe-sim-switch
            data-notip
            .mode=${this.joe.mode}
            .t=${e}
            ?compact=${this.narrow}
            @joe-mode-switch=${this.onModeSwitch}
          ></joe-sim-switch>
        </div>
      </header>
      ${this.notice ? _`<div class="notice" role="alert">${this.notice}</div>` : y}
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
      ${this.modeDialog ? this.renderModeDialog(e) : y} ${this.editor ? this.renderEditor(e) : y}
      ${this.picker ? this.renderPicker(e) : y}
    `;
	}
	renderTabs(e) {
		return _`<nav class="tabs" aria-label=${e("nav.label")}>
      ${Bt.map((t) => _`<a
            href=${this.href(t)}
            class=${t === this.page ? "on" : ""}
            aria-current=${t === this.page ? "page" : "false"}
            @click=${(e) => this.navigate(e, t)}
            >${e(`tab.${t}`)}</a
          >`)}
    </nav>`;
	}
	renderSteps(e) {
		let t = Rt.indexOf(this.joe?.onboarding.step ?? "welcome");
		return _`<ol class="steps" aria-label=${e("steps.label")}>
      ${Rt.map((n, r) => _`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.page;
		if (t === "overview") return _`<joe-overview
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        prefix=${this.route?.prefix ?? "/energy-joe"}
      ></joe-overview>`;
		if (t === "history") return _`<joe-history .t=${e} .hass=${this.hass} .state=${this.joe}></joe-history>`;
		if (t === "plan") return _`<joe-plan-page .t=${e} .hass=${this.hass} .state=${this.joe}></joe-plan-page>`;
		if (t === "settings") return _`<joe-settings
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        .info=${this.info}
        .discovery=${this.discovery}
        .checks=${this.checks}
      ></joe-settings>`;
		let n = jn[t];
		return n ? _`<joe-empty-state
          pose=${n.pose}
          heading=${e(n.title)}
          text=${e(n.text)}
          note=${e("soon")}
        ></joe-empty-state>` : _``;
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
          <div id="mode-title">${E(e("mode.dialog.title"), "h2", I(e, "mode"))}</div>
          ${T}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${On.map((n) => {
			let r = An.includes(n);
			return _`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${kn[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? _`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? y : _`<span class="chip soon">${e("mode.soon")}</span>`}
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
				a = e("edit.household.label"), i = _`<div class="sheet-title">${E(e("edit.household.title"), "h2", I(e, "q_household"))}</div>
          <joe-household .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
				break;
			case "consumers": a = e("edit.consumers.label"), o = !0, i = _`<div class="sheet-title">${E(e("edit.consumers.title"))}</div>
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
			Dn,
			A,
			o`
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
j([S({ attribute: !1 })], $.prototype, "hass", void 0), j([S({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), j([S({ attribute: !1 })], $.prototype, "route", void 0), j([C()], $.prototype, "joe", void 0), j([C()], $.prototype, "info", void 0), j([C()], $.prototype, "failed", void 0), j([C()], $.prototype, "modeDialog", void 0), j([C()], $.prototype, "notice", void 0), j([C()], $.prototype, "discovery", void 0), j([C()], $.prototype, "discovering", void 0), j([C()], $.prototype, "discoveryFailed", void 0), j([C()], $.prototype, "checks", void 0), j([C()], $.prototype, "picker", void 0), j([C()], $.prototype, "editor", void 0), k("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
