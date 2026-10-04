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
var le = globalThis, ue = (e) => e, de = le.trustedTypes, fe = de ? de.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pe = "$lit$", me = `lit$${Math.random().toFixed(9).slice(2)}$`, he = "?" + me, ge = `<${he}>`, _e = document, ve = () => _e.createComment(""), ye = (e) => e === null || typeof e != "object" && typeof e != "function", be = Array.isArray, xe = (e) => be(e) || typeof e?.[Symbol.iterator] == "function", Se = "[ 	\n\f\r]", Ce = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, we = /-->/g, Te = />/g, Ee = RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), De = /'/g, Oe = /"/g, ke = /^(?:script|style|textarea|title)$/i, Ae = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), h = Ae(1), g = Ae(2), je = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Me = /* @__PURE__ */ new WeakMap(), Ne = _e.createTreeWalker(_e, 129);
function Pe(e, t) {
	if (!be(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return fe === void 0 ? t : fe.createHTML(t);
}
var Fe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Ce;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Ce ? c[1] === "!--" ? o = we : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = Ee) : (ke.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = Ee) : o = Te : o === Ee ? c[0] === ">" ? (o = i ?? Ce, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? Ee : c[3] === "\"" ? Oe : De) : o === Oe || o === De ? o = Ee : o === we || o === Te ? o = Ce : (o = Ee, i = void 0);
		let d = o === Ee && e[t + 1].startsWith("/>") ? " " : "";
		a += o === Ce ? n + ge : l >= 0 ? (r.push(s), n.slice(0, l) + pe + n.slice(l) + me + d) : n + me + (l === -2 ? t : d);
	}
	return [Pe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ie = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Fe(t, n);
		if (this.el = e.createElement(l, r), Ne.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = Ne.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(pe)) {
					let t = u[o++], n = i.getAttribute(e).split(me), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ve : r[1] === "?" ? He : r[1] === "@" ? Ue : Be
					}), i.removeAttribute(e);
				} else e.startsWith(me) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ke.test(i.tagName)) {
					let e = i.textContent.split(me), t = e.length - 1;
					if (t > 0) {
						i.textContent = de ? de.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ve()), Ne.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], ve());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === he) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(me, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += me.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = _e.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Le(e, t, n = e, r) {
	if (t === je) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = ye(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Le(e, i._$AS(e, t.values), i, r)), t;
}
var Re = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? _e).importNode(t, !0);
		Ne.currentNode = r;
		let i = Ne.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new ze(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new We(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = Ne.nextNode(), a++);
		}
		return Ne.currentNode = _e, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, ze = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = Le(this, e, t), ye(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== je && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? xe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== _ && ye(this._$AH) ? this._$AA.nextSibling.data = e : this.T(_e.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ie.createElement(Pe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Re(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Me.get(e.strings);
		return t === void 0 && Me.set(e.strings, t = new Ie(e)), t;
	}
	k(t) {
		be(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(ve()), this.O(ve()), this, this.options)) : r = n[i], r._$AI(a), i++;
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
}, Be = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = _;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Le(this, e, t, 0), a = !ye(e) || e !== this._$AH && e !== je, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Le(this, r[n + o], t, o), s === je && (s = this._$AH[o]), a ||= !ye(s) || s !== this._$AH[o], s === _ ? e = _ : e !== _ && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ve = class extends Be {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === _ ? void 0 : e;
	}
}, He = class extends Be {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== _);
	}
}, Ue = class extends Be {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Le(this, e, t, 0) ?? _) === je) return;
		let n = this._$AH, r = e === _ && n !== _ || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== _ && (n === _ || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, We = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Le(this, e);
	}
}, Ge = le.litHtmlPolyfillSupport;
Ge?.(Ie, ze), (le.litHtmlVersions ??= []).push("3.3.3");
var Ke = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new ze(t.insertBefore(ve(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, qe = globalThis, v = class extends ce {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ke(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return je;
	}
};
v._$litElement$ = !0, v.finalized = !0, qe.litElementHydrateSupport?.({ LitElement: v });
var Je = qe.litElementPolyfillSupport;
Je?.({ LitElement: v }), (qe.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var Ye = {
	attribute: !0,
	type: String,
	converter: ae,
	reflect: !1,
	hasChanged: oe
}, Xe = (e = Ye, t, n) => {
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
function y(e) {
	return (t, n) => typeof n == "object" ? Xe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function b(e) {
	return y({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Ze = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Qe(e, t) {
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
			return Ze(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Ze(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region src/assets.ts
var $e = import.meta.url.replace(/[^/]*$/, ""), et = (e) => `${$e}${e}`, tt = {
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
	"review.car.later": "für Laden nach Bedarf",
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
	"action.need.round_trip": "Hin und zurück",
	"action.need.no_routing": "Wie weit die Termine weg sind, kann ich erst ausrechnen, wenn du unter Einstellungen → Entfernungen einen Dienst wählst. Bis dahin zählen nur Termine an einer Zone und deine übliche Strecke.",
	"action.need.pick.soc": "Welcher Sensor zeigt den Ladestand des Autos?",
	"action.need.pick.range": "Welcher Sensor zeigt die Reichweite?",
	"action.need.pick.capacity": "Welcher Sensor zeigt die Akkugröße?",
	"action.need.pick.odometer": "Welcher Sensor zeigt den Kilometerstand?",
	"action.need.pick.consumption": "Welcher Sensor zeigt den Durchschnittsverbrauch?",
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
	"tip.a_need_round_trip.title": "Hin und zurück?",
	"tip.a_need_round_trip.text": "Meist fährt man zum Termin und wieder heim – dann zähle ich die Strecke doppelt.",
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
	"devices.boost.label": "Einfach laden bis",
	"devices.boost.unit": "Einheit",
	"devices.boost.go": "Jetzt laden",
	"devices.boost.stop": "Abbrechen",
	"devices.boost.running": "Lädt jetzt bis {target} % – gerade {now} %.",
	"devices.boost.running_km": "Lädt jetzt bis {target} km Reichweite plus {reserve} km Reserve – gerade {now} km.",
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
	"tip.boost.title": "Was macht „Einfach laden“?",
	"tip.boost.text": "Ich schalte die Wallbox sofort ein – ohne auf die günstige Zeit oder die Sonne zu warten und auch in der Simulation, weil du es ausdrücklich willst. Sobald der Ladestand erreicht ist (oder die Reichweite plus deine Reserve), stelle ich die Wallbox zurück, wie sie vorher war.",
	"tip.boost.hint": "Nach spätestens 24 Stunden höre ich von selbst auf. Mit „Abbrechen“ sofort.",
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
}, nt = {
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
	"review.car.later": "for charging by need",
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
	"action.need.round_trip": "There and back",
	"action.need.no_routing": "I can only work out how far appointments are once you pick a service under Settings → Distances. Until then only appointments at a zone and your usual distance count.",
	"action.need.pick.soc": "Which sensor shows the car's charge level?",
	"action.need.pick.range": "Which sensor shows the range?",
	"action.need.pick.capacity": "Which sensor shows the battery size?",
	"action.need.pick.odometer": "Which sensor shows the odometer?",
	"action.need.pick.consumption": "Which sensor shows the average consumption?",
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
	"tip.a_need_round_trip.title": "There and back?",
	"tip.a_need_round_trip.text": "Usually you drive to the appointment and back home – then I count the distance twice.",
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
	"devices.boost.label": "Just charge to",
	"devices.boost.unit": "Unit",
	"devices.boost.go": "Charge now",
	"devices.boost.stop": "Cancel",
	"devices.boost.running": "Charging now to {target} % – {now} % so far.",
	"devices.boost.running_km": "Charging now to {target} km of range plus {reserve} km reserve – {now} km so far.",
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
	"tip.boost.title": "What does “Just charge” do?",
	"tip.boost.text": "I switch the wallbox on right away – without waiting for the cheap hours or the sun, and also in simulation, because you asked for it. Once the level is reached (or the range plus your reserve), I put the wallbox back the way it was.",
	"tip.boost.hint": "I stop by myself after 24 hours at the latest. “Cancel” stops right away.",
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
}, rt = /* @__PURE__ */ new Map();
function it(e, t) {
	return e.replace(/\{(\w+)\}/g, (e, n) => String(t?.[n] ?? ""));
}
function at(e) {
	let t = e || "en", n = rt.get(t);
	if (n) return n;
	let r = t.startsWith("de") ? tt : nt, i = ((e, t) => it(r[e], t));
	return i.optional = (e, t) => e in r ? it(r[e], t) : void 0, Object.defineProperty(i, "lang", { value: t }), rt.set(t, i), i;
}
function ot(e) {
	return e.split("|");
}
//#endregion
//#region src/components/bits.ts
var x = h`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;
function S(e, t = "h2", n) {
	let r = ot(e), i = r.length - 1, a = r.map((e, t) => t === i && r.length > 1 ? h`<span class="hl">${e}</span>` : e.endsWith("!") ? h`${e}<br />` : h`${e}`), o = n ? h`<span class="title-tip">${n}</span>` : "";
	return t === "h1" ? h`<h1 class="display">${a}${o}</h1>` : h`<h2 class="display">${a}${o}</h2>`;
}
function C(e, t) {
	let n = t >= .85 ? 4 : t >= .65 ? 3 : t >= .45 ? 2 : 1, r = e(`conf.${n}`);
	return h`<span class="conf" role="img" aria-label=${r} title=${r}>
    ${[
		1,
		2,
		3,
		4
	].map((e) => h`<i class=${e <= n ? "on" : ""}></i>`)}
  </span>`;
}
var st = {
	read: "mdi:eye-outline",
	learned: "mdi:auto-fix",
	user: "mdi:account-edit-outline",
	default: "mdi:tune-variant"
};
function w(e, t) {
	let n = t?.source ?? "default";
	return h`<span class="chip ${n}"
    ><ha-icon icon=${st[n]}></ha-icon>${e(`source.${n}`)}</span
  >`;
}
function ct(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) (typeof r == "string" || typeof r == "number") && (n[e] = r);
	return e.optional(`reason.${t.code}`, n) ?? t.code;
}
//#endregion
//#region src/define.ts
function T(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
//#endregion
//#region src/styles/shared.ts
var E = o`
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
function D(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/components/pose.ts
var lt = /* @__PURE__ */ new Set(["welcome"]), ut = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), dt = "thumbs", ft = class extends v {
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
		let e = ut.has(this.name) ? "scene" : "";
		if (this.name === dt) return h`<img class="light" src=${et("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${et("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = et(`poses/${this.name}.webp`);
		return lt.has(this.name) ? h`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${et(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : h`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
D([y()], ft.prototype, "name", void 0), D([y()], ft.prototype, "alt", void 0), T("joe-pose", ft);
//#endregion
//#region src/components/empty-state.ts
var pt = class extends v {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [E, o`
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
		return h`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${S(this.heading)} ${x}
        <p class="lead">${this.text}</p>
        ${this.note ? h`<div class="note"><span class="chip soon">${this.note}</span></div>` : _}
        <slot></slot>
      </div>
    </div>`;
	}
};
D([y()], pt.prototype, "pose", void 0), D([y()], pt.prototype, "heading", void 0), D([y()], pt.prototype, "text", void 0), D([y()], pt.prototype, "note", void 0), T("joe-empty-state", pt);
//#endregion
//#region src/entities.ts
var mt = [
	"W",
	"kW",
	"MW"
], ht = [
	"Wh",
	"kWh",
	"MWh"
], gt = {
	power: (e) => O(e) === "sensor" && mt.includes(k(e)),
	soc: (e) => O(e) === "sensor" && k(e) === "%",
	energy: (e) => O(e) === "sensor" && ht.includes(k(e)),
	price: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(O(e)) && (e.attributes.device_class === "monetary" || /\/\s*kwh/i.test(k(e))),
	weather: (e) => O(e) === "weather",
	workday: (e) => O(e) === "binary_sensor",
	calendar: (e) => O(e) === "calendar",
	person: (e) => O(e) === "person",
	level: (e) => ["number", "input_number"].includes(O(e)) && k(e) === "%",
	temperature: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(O(e)) && ["°C", "°F"].includes(k(e)),
	setpoint: (e) => ["number", "input_number"].includes(O(e)),
	toggle: (e) => ["switch", "input_boolean"].includes(O(e)),
	option: (e) => ["select", "input_select"].includes(O(e)),
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
	].includes(O(e)),
	distance: (e) => O(e) === "sensor" && [
		"km",
		"mi",
		"m"
	].includes(k(e)),
	consumption: (e) => O(e) === "sensor" && /kwh\/100|wh\/km|km\/kwh|mi\/kwh/i.test(k(e).replace(/\s/g, "")),
	car_energy: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(O(e)) && [
		...ht,
		"kJ",
		"MJ"
	].includes(k(e)),
	any: () => !0
};
function O(e) {
	return e.entity_id.split(".", 1)[0];
}
function k(e) {
	return String(e.attributes.unit_of_measurement ?? "");
}
function _t(e, t) {
	return gt[t](e);
}
function A(e, t) {
	let n = e.states[t]?.attributes.friendly_name;
	return typeof n == "string" && n ? n : t.split(".", 2)[1]?.replace(/_/g, " ") ?? t;
}
function vt(e, t) {
	let n = e.entities?.[t], r = n?.device_id ? e.devices?.[n.device_id] : void 0, i = n?.area_id ?? r?.area_id, a = i ? e.areas?.[i]?.name : void 0, o = r?.name_by_user || r?.name || void 0;
	return [o && A(e, t).toLowerCase().startsWith(o.toLowerCase()) ? void 0 : o, a].filter(Boolean).join(" · ");
}
function j(e, t) {
	if (!t) return null;
	let n = Number.parseFloat(e.states[t]?.state ?? "");
	return Number.isFinite(n) ? n : null;
}
function M(e, t, n) {
	return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
}
function N(e, t, n) {
	let r = e.states[t];
	if (!r) return "–";
	if (e.formatEntityState) return e.formatEntityState(r);
	let i = j(e, t);
	return i === null ? r.state : `${M(n, i, Math.abs(i) >= 100 ? 0 : Math.abs(i) >= 10 ? 1 : 2)} ${k(r)}`.trim();
}
function yt(e, t) {
	return t === "W" ? e / 1e3 : t === "MW" ? e * 1e3 : e;
}
function bt(e, t) {
	if (!t) return null;
	let n = j(e, t.entity_id);
	if (n === null) return null;
	let r = yt(n, k(e.states[t.entity_id]));
	if (t.invert && (r = -r), t.minus_entity_id) {
		let n = j(e, t.minus_entity_id);
		if (n === null) return null;
		r -= yt(n, k(e.states[t.minus_entity_id]));
	}
	return r;
}
function xt(e, t) {
	let n = j(e, t);
	if (n === null || !t) return null;
	let r = k(e.states[t]);
	return r === "Wh" ? n / 1e3 : r === "MWh" ? n * 1e3 : n;
}
function St(e, t) {
	let n = t.map((t) => bt(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
//#endregion
//#region src/components/tip.ts
var Ct = 120, wt = 220, Tt = 8, Et = 10, Dt, Ot = class extends v {
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
		return e ? h`<button
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
        ${kt(e.text)}
        ${e.facts?.length ? h`<dl>${e.facts.map(([e, t]) => h`<dt>${e}</dt><dd>${t}</dd>`)}</dl>` : _}
        <span class="arrow"></span>
      </div>` : _;
	}
	show(e = !1) {
		this.cancelTimer(), this.pinned = this.pinned || e, !this.open && (Dt && Dt !== this && Dt.close(), Dt = this, this.open = !0, window.addEventListener("pointerdown", this.onOutside, !0), window.addEventListener("keydown", this.onKey, !0), this.updateComplete.then(() => {
			let e = this.bubble;
			this.open && e && (typeof e.showPopover == "function" && !e.matches(":popover-open") && e.showPopover(), this.follow());
		}));
	}
	close() {
		this.cancelTimer(), this.pinned = !1, this.frame !== void 0 && (cancelAnimationFrame(this.frame), this.frame = void 0), window.removeEventListener("pointerdown", this.onOutside, !0), window.removeEventListener("keydown", this.onKey, !0);
		let e = this.bubble;
		e && typeof e.hidePopover == "function" && e.matches(":popover-open") && e.hidePopover(), Dt === this && (Dt = void 0), this.open = !1;
	}
	onClick() {
		this.open && this.pinned ? this.close() : this.show(!0);
	}
	onEnter(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open || (this.timer = window.setTimeout(() => this.show(), Ct)));
	}
	onLeave(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open && !this.pinned && (this.timer = window.setTimeout(() => this.close(), wt)));
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
		let r = t.getBoundingClientRect(), i = document.documentElement.clientWidth, a = n.top - r.height - Et, o = "top";
		a < Tt && (a = n.bottom + Et, o = "bottom");
		let s = n.left + n.width / 2, c = Math.max(Tt, Math.min(s - r.width / 2, i - r.width - Tt)), l = Math.max(14, Math.min(s - c, r.width - 14));
		t.style.left = `${Math.round(c)}px`, t.style.top = `${Math.round(a)}px`, t.style.setProperty("--arrow", `${Math.round(l)}px`), t.dataset.place = o;
	}
};
D([y({ attribute: !1 })], Ot.prototype, "tip", void 0), D([y()], Ot.prototype, "label", void 0), D([b()], Ot.prototype, "open", void 0), D([Qe("button")], Ot.prototype, "button", void 0), D([Qe(".bubble")], Ot.prototype, "bubble", void 0);
function kt(e) {
	return e.split("\n").map((e) => h`<p>
        ${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? h`<strong>${e}</strong>` : e)}
      </p>`);
}
function At(e, t, n, r = []) {
	let i = e.optional(`tip.${t}.hint`, n);
	return {
		heading: e(`tip.${t}.title`, n),
		text: e(`tip.${t}.text`, n),
		facts: i ? [...r, [e("tip.hint"), i]] : r
	};
}
function P(e, t, n, r) {
	return h`<joe-tip .tip=${At(e, t, n, r)} label=${e("tip.label")}></joe-tip>`;
}
T("joe-tip", Ot);
//#endregion
//#region src/components/entity-picker.ts
var jt = 60, F = class extends v {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = jt;
	}
	static {
		this.styles = [E, o`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = jt);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return _;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), a = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return h`<div data-tipped>
      <div class="sheet-title">${S(n.heading, "h2", P(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = jt;
		}}
      />
      ${a.length ? h`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${a.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : _}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? h`<ul>
            ${i.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : h`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > i.length ? h`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += jt}>
            ${t("pick.more", { count: r.length - i.length })}
          </button>` : _}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = jt;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${P(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : _}
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
			if (r.has(a) || !this.showAll && (!_t(o, t.filter) || e.entities?.[a]?.hidden)) continue;
			let s = A(e, a);
			if (n.length) {
				let t = `${s} ${a} ${vt(e, a)}`.toLowerCase();
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
		let a = this.selected.includes(r), o = vt(e, r), s = i?.reasons?.[0];
		return h`<li>
      <button type="button" class="row" aria-pressed=${String(a)} @click=${() => this.toggle(r)}>
        <span class="mark ${n.multiple ? "box" : ""}" aria-hidden="true">
          ${a ? h`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : _}
        </span>
        <span class="txt">
          <b>${A(e, r)}</b>
          <small>${o ? `${o} · ` : ""}${r}</small>
          ${s ? h`<small class="why">${ct(t, s)}</small>` : _}
        </span>
        <span class="end">
          <span class="val">${N(e, r, t.lang)}</span>
          ${i?.confidence == null ? _ : C(t, i.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let r = n.measurement?.role ?? "grid", i = this.selected[0], a = i ? bt(e, {
			entity_id: i,
			invert: this.invert,
			minus_entity_id: null
		}) : null, o = "";
		if (a !== null) {
			let e = M(t.lang, Math.abs(a), 2);
			o = r === "grid" ? t(a >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : r === "battery" ? t(a >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(a >= -.05 ? `pick.preview.${r}` : "pick.preview.negative", { value: M(t.lang, a, 2) });
		}
		return h`<div class="line">
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
        ${P(t, r === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${o ? h`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${o}</span></div>` : _}`;
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
D([y({ attribute: !1 })], F.prototype, "hass", void 0), D([y({ attribute: !1 })], F.prototype, "t", void 0), D([y({ attribute: !1 })], F.prototype, "request", void 0), D([b()], F.prototype, "selected", void 0), D([b()], F.prototype, "invert", void 0), D([b()], F.prototype, "query", void 0), D([b()], F.prototype, "showAll", void 0), D([b()], F.prototype, "limit", void 0), T("joe-entity-picker", F);
//#endregion
//#region src/components/sheet.ts
var Mt = class extends v {
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
		return h`<div
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
D([y()], Mt.prototype, "label", void 0), D([y()], Mt.prototype, "closeLabel", void 0), D([y({
	type: Boolean,
	reflect: !0
})], Mt.prototype, "wide", void 0), D([Qe(".panel")], Mt.prototype, "panel", void 0), T("joe-sheet", Mt);
//#endregion
//#region src/components/sim-switch.ts
var Nt = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Pt = class extends v {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
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
		return e ? h`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Nt[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? _ : h`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : _;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
D([y()], Pt.prototype, "mode", void 0), D([y({ type: Boolean })], Pt.prototype, "compact", void 0), D([y({ type: Boolean })], Pt.prototype, "running", void 0), D([y({ attribute: !1 })], Pt.prototype, "t", void 0), T("joe-sim-switch", Pt);
//#endregion
//#region src/config.ts
var Ft = /\[[^\]]*\]|[^.[]+/g;
function It(e) {
	let t = [], n = "";
	for (let r of e.match(Ft) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function I(e, t) {
	for (let n of It(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function L(e, t) {
	return e.answers.ignored.includes(t);
}
function R(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function z(e, t, n = "user") {
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
function B(e, t) {
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
function Lt(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function Rt(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/hot-water.ts
var zt = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], Bt = [
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
], Vt = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function Ht(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Ut(e, t) {
	return [...zt, ...t].some((t) => e.includes(t));
}
function Wt(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Gt(e, t) {
	let n = Wt(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = Ht(e, t);
		if (!Ut(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (zt.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (Bt.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else Vt.includes(o) && i.push({
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
var Kt = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], qt = {
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
	round_trip: !0
}, Jt = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300]
}, Yt = {
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
function Xt(e, t) {
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
var V = class extends v {
	constructor(...e) {
		super(...e), this.actionId = "", this.saving = !1, this.problem = "";
	}
	static {
		this.styles = [E, o`
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
				let e = Xt(this.actionId.slice(4), this.t), t = this.discovery?.wallboxes.find((e) => e.is_car);
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
		if (!e || !t || !n) return _;
		let r = !this.existing;
		return h`<div class="sheet-title">${S(e(r ? "action.title.new" : "action.title"))}</div>
      ${this.field(e("action.f.name"), "a_name", h`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${n.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || n.name })}
        />`)}
      ${this.field(e("action.f.kind"), "a_kind", h`<div class="seg" role="group" aria-label=${e("action.f.kind")}>
          ${["switch", "target"].map((t) => h`<button type="button" aria-pressed=${String(n.kind === t)} @click=${() => this.set({ kind: t })}>
                ${e(`action.kind.${t}`)}
              </button>`)}
        </div>`)}
      ${this.field(e("action.f.entity"), "a_entity", this.entityBox(e, n.entity_id, () => this.pickTarget()))}
      ${n.entity_id ? this.field(e("action.f.on_value"), "a_on_value", this.valueInput(n.entity_id, n.on_value, (e) => this.set({ on_value: e }))) : _}
      ${this.field(e("action.f.reset"), "a_reset", h`<div class="row">
          <div class="seg" role="group" aria-label=${e("action.f.reset")}>
            ${["previous", "fixed"].map((t) => h`<button type="button" aria-pressed=${String(n.reset === t)} @click=${() => this.set({ reset: t })}>
                  ${e(`action.reset.${t}`)}
                </button>`)}
          </div>
          ${n.reset === "fixed" && n.entity_id ? this.valueInput(n.entity_id, n.reset_value ?? "", (e) => this.set({ reset_value: e })) : _}
        </div>`)}
      ${this.field(e("action.f.lead"), "a_lead", h`<span class="unit-input">
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
      ${n.kind === "target" ? this.renderTarget(e, n) : _}
      ${this.field(e("action.f.auto"), "a_auto", h`<div class="row">
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
      ${n.auto ? this.renderConditions(e, n) : _}
      ${n.kind === "switch" ? this.renderNeed(e, n) : _}
      ${this.field(e("action.f.power"), "a_power", h`<span class="unit-input">
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
      ${this.config?.consumers.length ?? 0 ? this.field(e("action.f.consumer"), "a_consumer", h`<select class="input" @change=${(e) => this.set({ consumer_id: e.target.value || null })}>
              <option value="" ?selected=${!n.consumer_id}>${e("action.f.consumer.none")}</option>
              ${this.config.consumers.map((e) => h`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
            </select>`) : _}
      ${this.field(e("action.f.priority"), "a_priority", h`<span class="unit-input">
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
      ${this.field(e("action.f.enabled"), "a_enabled", h`<button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.enabled)}
          aria-label=${e("action.f.enabled")}
          @click=${() => this.set({ enabled: !n.enabled })}
        ></button>`)}
      ${this.problem ? h`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : _}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${P(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${r ? _ : h`<div class="danger-zone" data-tipped>
            <button type="button" class="btn btn-danger" @click=${this.deleteAction}>${e("action.delete")}</button>
            ${P(e, "a_delete")}
          </div>`}`;
	}
	renderTarget(e, t) {
		let n = (n, r) => h`<label>
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
		return h`${this.field(e("action.f.sensor"), "a_sensor", this.entityBox(e, t.sensor_entity ?? "", () => this.pickSensor()))}
      ${this.field(e("action.f.temps"), "a_temps", h`<div class="temps">${n("comfort", "°C")} ${n("maximum", "°C")} ${n("buffer", "K")}</div>`)}`;
	}
	renderNeed(e, t) {
		let n = t.need ?? qt, r = (this.config?.persons ?? []).filter((e) => e.calendars.length), i = (e, t, r, i = "") => h`<span
      class="unit-input"
    >
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min=${Jt[e][0]}
        max=${Math.min(r, Jt[e][1])}
        step=${e === "consumption" || e === "capacity_kwh" ? "0.1" : "1"}
        placeholder=${i}
        .value=${n[e] == null ? "" : String(n[e])}
        @change=${(t) => {
			let n = t.target, r = Number.parseFloat(n.value.replace(",", ".")), [i, a] = Jt[e], o = Number.isFinite(r) && r >= i && r <= a, s = e === "reserve_km" ? 50 : null;
			o || (n.value = s == null ? "" : String(s)), this.setNeed({ [e]: o ? r : s });
		}}
      />
      <span class="unit">${t}</span>
    </span>`, a = (t) => this.entityBox(e, n[t] ?? "", () => this.pickNeed(t));
		return h`${this.field(e("action.need"), "a_need", h`<div class="row">
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
      ${n.enabled ? h`${this.field(e("action.need.soc"), "a_need_soc", a("soc_entity"))}
          ${this.field(e("action.need.range"), "a_need_range", a("range_entity"))}
          ${this.field(e("action.need.capacity"), "a_need_capacity", h`<div class="row">${i("capacity_kwh", "kWh", 300, e("action.need.from_sensor"))}</div>
              ${n.capacity_kwh == null ? a("capacity_entity") : _}`)}
          ${this.field(e("action.need.reserve"), "a_need_reserve", i("reserve_km", "km", 1e3))}
          ${this.field(e("action.need.consumption"), "a_need_consumption", h`${i("consumption", "kWh/100 km", 60, e("action.need.learned"))}
              ${n.consumption == null ? a("consumption_entity") : _}`)}
          ${this.field(e("action.need.daily"), "a_need_daily", i("daily_km", "km", 2e3, e("action.need.learned")))}
          ${this.field(e("action.need.odometer"), "a_need_odometer", a("odometer_entity"))}
          ${this.field(e("action.need.persons"), "a_need_persons", r.length ? h`<div class="row" role="group" aria-label=${e("action.need.persons")}>
                  ${r.map((e) => {
			let t = n.persons == null || n.persons.includes(e.id);
			return h`<button
                      type="button"
                      class="mini-btn ${t ? "go" : "quiet"}"
                      aria-pressed=${String(t)}
                      @click=${() => this.togglePerson(e.id, r.map((e) => e.id))}
                    >
                      ${e.name}
                    </button>`;
		})}
                </div>` : h`<p class="field-hint">${e("action.need.no_calendars")}</p>`)}
          ${this.field(e("action.need.round_trip"), "a_need_round_trip", h`<button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(n.round_trip)}
              aria-label=${e("action.need.round_trip")}
              @click=${() => this.setNeed({ round_trip: !n.round_trip })}
            ></button>`)}
          ${this.config?.routing.service ? _ : h`<div class="note"><ha-icon icon="mdi:map-marker-distance"></ha-icon><span>${e("action.need.no_routing")}</span></div>`}` : _}`;
	}
	setNeed(e) {
		this.set({ need: {
			...this.draft?.need ?? qt,
			...e
		} });
	}
	toggleNeed() {
		let e = this.draft?.need ?? qt;
		if (e.enabled) {
			this.setNeed({ enabled: !1 });
			return;
		}
		let t = this.discovery?.cars ?? [], n = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), r = t.length === 1 && n.length <= 1 ? t[0].entities : {}, i = { enabled: !0 };
		for (let [t, n] of Object.entries(Yt)) !e[t] && r[n.role] && (i[t] = r[n.role] ?? null);
		this.setNeed(i);
	}
	togglePerson(e, t) {
		let n = (this.draft?.need ?? qt).persons ?? t, r = n.includes(e) ? n.filter((t) => t !== e) : [...n, e];
		this.setNeed({ persons: t.every((e) => r.includes(e)) ? null : r });
	}
	async pickNeed(e) {
		let t = this.t, n = Yt[e], r = (this.discovery?.cars ?? []).map((e) => ({
			entity_id: e.entities[n.role] ?? "",
			confidence: e.confidence,
			reasons: e.reasons
		})).filter((e) => e.entity_id), i = await B(this, {
			heading: t(`action.need.pick.${n.role}`),
			tip: n.tip,
			filter: n.filter,
			selected: this.draft?.need?.[e] ? [this.draft.need[e]] : [],
			suggestions: Lt(r)
		});
		i && this.setNeed({ [e]: i.selected[0] ?? null });
	}
	renderConditions(e, t) {
		let n = this.hass;
		return this.field(e("action.f.conditions"), "a_conditions", h`${t.conditions.map((t, r) => h`<div class="condition">
            <span><b>${A(n, t.entity_id)}</b></span>
            <select
              class="input"
              aria-label=${e("action.f.op")}
              @change=${(e) => this.setCondition(r, { op: e.target.value })}
            >
              ${Kt.map((n) => h`<option value=${n} ?selected=${t.op === n}>${e(`action.op.${n}`)}</option>`)}
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
		return h`<div class="field" data-tipped>
      <div class="field-label">${e} ${P(this.t, t)}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n) {
		let r = this.hass;
		return h`<div class="entity">
      <span>
        ${t ? h`<b>${A(r, t)}</b><small>${N(r, t, e.lang)}</small>` : h`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${n}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	valueInput(e, t, n) {
		let r = this.t, i = e.split(".", 1)[0], a = this.hass?.states[e]?.attributes.options ?? [];
		if (["select", "input_select"].includes(i) && a.length) return h`<select class="input" aria-label=${r("action.f.value")} @change=${(e) => n(e.target.value)}>
        ${a.map((e) => h`<option value=${e} ?selected=${t === e}>${e}</option>`)}
      </select>`;
		if ([
			"switch",
			"input_boolean",
			"light",
			"fan"
		].includes(i)) {
			let e = t === !0 || t === "on";
			return h`<div class="seg" role="group" aria-label=${r("action.f.value")}>
        <button type="button" aria-pressed=${String(e)} @click=${() => n("on")}>${r("action.value.on")}</button>
        <button type="button" aria-pressed=${String(!e)} @click=${() => n("off")}>${r("action.value.off")}</button>
      </div>`;
		}
		return h`<input
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
		return Gt(this.hass, e?.name);
	}
	async pickTarget() {
		let e = this.t, t = (await B(this, {
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
		let e = this.t, t = await B(this, {
			heading: e("action.pick.sensor"),
			tip: "a_sensor",
			filter: "temperature",
			selected: this.draft?.sensor_entity ? [this.draft.sensor_entity] : [],
			suggestions: this.hotWater()?.sensors
		});
		t?.selected[0] && this.set({ sensor_entity: t.selected[0] });
	}
	async addCondition() {
		let e = this.t, t = (await B(this, {
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
		let i = await z(this, { actions: { [n]: r } });
		this.saving = !1, i && this.close();
	}
	async deleteAction() {
		this.existing && await z(this, { actions: { [this.existing.id]: null } }) && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
D([y({ attribute: !1 })], V.prototype, "hass", void 0), D([y({ attribute: !1 })], V.prototype, "t", void 0), D([y({ attribute: !1 })], V.prototype, "config", void 0), D([y({ attribute: !1 })], V.prototype, "discovery", void 0), D([y()], V.prototype, "actionId", void 0), D([b()], V.prototype, "draft", void 0), D([b()], V.prototype, "saving", void 0), D([b()], V.prototype, "problem", void 0), T("joe-action-editor", V);
//#endregion
//#region src/types.ts
var Zt = [
	"welcome",
	"scan",
	"questions",
	"done"
], Qt = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"discharge_limit",
	"discharge_limit_enabled"
], $t = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], en = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], tn = [
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
function nn(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var rn = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], an = [
	"overview",
	"plan",
	"history",
	"learn",
	"devices",
	"settings"
], on = {
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
}, sn = [
	"charge",
	"hold",
	"release"
];
function cn(e) {
	let t = (...t) => t.every((t) => !!e.controls[t]), n = (t) => !!e.mode_options[t], r = [];
	t("mode") && n("force_charge") && r.push("mode"), t("grid_charge", "charge_target") && r.push("target"), t("grid_charge", "min_soc") && r.push("min_soc");
	let i = [];
	return t("min_soc") && i.push("min_soc"), t("mode") && n("hold") && i.push("mode_hold"), t("mode", "charge_power") && n("force_charge") && i.push("standby"), t("discharge_limit") && i.push("limit"), {
		charge: r,
		hold: i
	};
}
var ln = class extends v {
	static {
		this.styles = [E, o`
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
		if (!e || !t) return _;
		let n = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			"generic",
			"steps"
		], r = this.found?.suggested;
		return h`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${n.map((t) => h`<button type="button" aria-pressed=${String(this.choice === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${this.choice === "watch" && r?.complete ? h`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${P(e, "control_roles")}
              </div></span
            >
          </div>` : _}
      ${this.choice === "profile" && Object.keys(t.steps).length && !Object.keys(t.controls).length ? this.renderServiceSteps(e, t) : this.choice === "profile" || this.choice === "generic" ? this.renderRoles(e, t) : _}
      ${this.choice === "steps" ? this.renderSteps(e, t) : _}
      ${this.choice === "watch" ? _ : h`<p class="field-hint">${e("f.battery.control.retest")}</p>`}`;
	}
	renderRoles(e, t) {
		let n = this.hass, r = cn(t), i = r.charge.length && r.hold.length, a = t.controls.mode, o = a ? n.states[a]?.attributes.options ?? [] : [];
		return h`<div data-tipped>
      <div class="sub">${e("f.battery.control.levers")} ${P(e, "control_roles")}</div>
      <div class="rows">
        ${Qt.map((r) => {
			let i = t.controls[r];
			return h`<div class="row">
            <span class="label">${e(`role.${r}`)}</span>
            <span class="entity">
              ${i ? h`<b>${A(n, i)}</b><small>${N(n, i, e.lang)}</small>` : h`<small>${e("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(r)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(i ? "review.change" : "review.choose")}
              </button>
              ${i ? h`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(r, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : _}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${a ? h`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${P(e, "mode_options")}</div>
            <div class="rows">
              ${$t.map((n) => h`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${o.map((e) => h`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : _}
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
		return h`<div data-tipped>
      <div class="sub">${e("f.battery.control.services")} ${P(e, "control_steps")}</div>
      <div class="rows">
        ${sn.flatMap((r) => (t.steps[r] ?? []).map((t) => h`<div class="row">
              <span class="label">${e(`f.battery.steps.${r}`)}</span>
              <span class="entity">
                ${t.service ? h`<b>${t.service}</b>` : h`<b>${A(n, t.entity_id ?? "")}</b><small>${String(t.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`))}
      </div>
    </div>`;
	}
	renderSteps(e, t) {
		let n = this.hass;
		return h`<div class="sub" data-tipped>${e("f.battery.control.steps")} ${P(e, "control_steps")}</div>
      <p class="field-hint">${e("f.battery.steps.hint")}</p>
      ${sn.map((r) => {
			let i = t.steps[r] ?? [];
			return h`<div class="sub">${e(`f.battery.steps.${r}`)}</div>
          <div class="rows" data-tipped>
            ${i.map((t, i) => h`<div class="row">
                <span class="entity"
                  ><b>${t.service ?? A(n, t.entity_id ?? "")}</b><small>${t.entity_id ?? ""}</small></span
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
                  ${this.valueHints(t.entity_id ?? "", r).map((e) => h`<option value=${e}></option>`)}
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
              ${P(e, "control_steps")}
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
		let t = this.t, n = this.value.controls[e], r = await B(this, {
			heading: t("pick.role.title", { role: t(`role.${e}`) }),
			tip: "control_roles",
			filter: on[e],
			selected: n ? [n] : [],
			suggestions: this.nearby(on[e]).map((e) => ({ entity_id: e }))
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
		let t = this.t, n = (await B(this, {
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
D([y({ attribute: !1 })], ln.prototype, "hass", void 0), D([y({ attribute: !1 })], ln.prototype, "t", void 0), D([y({ attribute: !1 })], ln.prototype, "battery", void 0), D([y({ attribute: !1 })], ln.prototype, "found", void 0), D([y({ attribute: !1 })], ln.prototype, "value", void 0), D([y({ attribute: !1 })], ln.prototype, "profiles", void 0), T("joe-battery-control", ln);
//#endregion
//#region src/editors/battery-editor.ts
var un = [
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
], H = class extends v {
	constructor(...e) {
		super(...e), this.batteryId = "", this.capacityUnknown = !1, this.saving = !1;
	}
	static {
		this.styles = [E, o`
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
		(e.has("config") || e.has("batteryId")) && t && !this.draft && (this.draft = Object.fromEntries(un.map((e) => [e, structuredClone(t[e])])), this.capacityUnknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, draft: r } = this, i = this.battery;
		if (!e || !t || !n || !r || !i) return _;
		let a = this.discovery?.batteries.find((e) => e.id === i.id), o = xt(t, i.capacity_entity);
		return h`<div class="sheet-title">${S(e("edit.battery.title", { name: i.name }))}</div>
      ${this.field(e("f.battery.name"), "f_battery_name", h`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${r.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || i.name })}
        />`)}
      ${this.field(e("f.battery.capacity"), "q_capacity", h`<div class="field-row">
            <span class="unit-input">
              <input
                class="input"
                type="number"
                inputmode="decimal"
                min="0.1"
                max="1000"
                step="0.01"
                .value=${r.capacity_kwh == null ? "" : String(r.capacity_kwh)}
                placeholder=${o == null ? e("f.unknown") : M(e.lang, o, 2)}
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
          ${o == null ? _ : h`<p class="field-hint">${e("f.battery.capacity.read", { value: M(e.lang, o, 2) })}</p>`}`, w(e, I(n, `batteries[${i.id}].capacity_kwh`)))}
      ${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, r.soc_entity, `${N(t, r.soc_entity, e.lang)}`, () => this.pickSoc()), w(e, I(n, `batteries[${i.id}].soc_entity`)))}
      ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, r.power?.entity_id ?? null, this.powerText(e, r.power), () => this.pickPower()), w(e, I(n, `batteries[${i.id}].power`)))}
      ${this.field(e("f.battery.limits"), "f_battery_limits", h`<div class="limits">
          <label>${e("f.battery.max_charge")} ${this.kwInput(e, r.max_charge_w, "max_charge_w")}</label>
          <label>${e("f.battery.max_discharge")} ${this.kwInput(e, r.max_discharge_w, "max_discharge_w")}</label>
        </div>`)}
      ${n.batteries.length > 1 ? this.field(e("f.battery.priority"), "f_battery_priority", h`<span class="unit-input">
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
            </span>`) : _}
      <div class="field" data-tipped>
        <div class="field-label">${e("f.battery.control")} ${P(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${i}
          .found=${a}
          .profiles=${this.info?.profiles}
          .value=${{
			adapter: r.adapter,
			controls: r.controls,
			mode_options: r.mode_options,
			steps: r.steps
		}}
          @joe-control-change=${(e) => this.set(this.withPrepare(e.detail, a))}
        ></joe-battery-control>
      </div>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
      </div>`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return h`<div class="field" data-tipped>
      <div class="field-label">${e} ${P(i, t)} ${r ?? _}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return h`<div class="entity">
      <span>
        ${t ? h`<b>${A(i, t)}</b><small>${n}</small>` : h`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return h`<span class="unit-input">
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
		let n = this.hass, r = bt(n, t);
		if (!t || r === null) return t ? N(n, t.entity_id, e.lang) : "";
		let i = M(e.lang, Math.abs(r), 2);
		return e(r >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: i });
	}
	async pickSoc() {
		let { t: e, draft: t } = this;
		if (!e || !t) return;
		let n = await B(this, {
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
		let n = await B(this, {
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
		for (let r of un) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
		let r = `capacity:${e.id}`, i = this.config.answers[r] === "unknown", a = {};
		if (Object.keys(n).length && (a.batteries = { [e.id]: n }), i !== this.capacityUnknown && (a.answers = { [r]: this.capacityUnknown ? "unknown" : null }), Object.keys(a).length) {
			this.saving = !0;
			let e = await z(this, a);
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
D([y({ attribute: !1 })], H.prototype, "hass", void 0), D([y({ attribute: !1 })], H.prototype, "t", void 0), D([y({ attribute: !1 })], H.prototype, "config", void 0), D([y({ attribute: !1 })], H.prototype, "discovery", void 0), D([y({ attribute: !1 })], H.prototype, "info", void 0), D([y()], H.prototype, "batteryId", void 0), D([b()], H.prototype, "draft", void 0), D([b()], H.prototype, "capacityUnknown", void 0), D([b()], H.prototype, "saving", void 0), T("joe-battery-editor", H);
//#endregion
//#region src/editors/consumers.ts
var dn = ["auto", "always"], fn = [
	"auto",
	"surplus",
	"cheap"
], pn = class extends v {
	static {
		this.styles = [E, o`
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
		if (!e || !t || !n) return _;
		let r = [...n.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return h`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${P(e, "f_consumer_kind")}</div>
      <div class="head sub">${e("consumers.runs")} ${P(e, "f_consumer_runs")}</div>
      ${r.length ? h`<ul>
            ${r.map((r) => this.renderConsumer(e, t, n, r))}
          </ul>` : h`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
	renderConsumer(e, t, n, r) {
		let i = r.power_entity ? N(t, r.power_entity, e.lang) : "";
		return h`<li>
      <div>
        <b>${r.name}</b>
        <small>${w(e, I(n, `consumers[${r.id}].kind`))}${i}</small>
      </div>
      <div class="selects">
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: r.name })}
          .value=${r.kind}
          @change=${(e) => this.setKind(r, e.target.value)}
        >
          ${tn.map((t) => h`<option value=${t} ?selected=${t === r.kind}>${e(`kind.${t}`)}</option>`)}
        </select>
        ${r.kind === "submeter" ? _ : h`<select
              class="input"
              aria-label=${e("consumers.runs_of", { name: r.name })}
              .value=${r.runs ?? "auto"}
              @change=${(e) => this.setRuns(r, e.target.value)}
            >
              ${r.kind === "ev" ? dn.map((t) => h`<option value=${t} ?selected=${t === (r.runs ?? "auto")}>${e(`runs.ev.${t}`)}</option>`) : fn.map((t) => h`<option value=${t} ?selected=${t === (r.runs ?? "auto")}>${e(`runs.${t}`)}</option>`)}
            </select>`}
      </div>
    </li>`;
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && z(this, { consumers: { [e.id]: { runs: t } } });
	}
	setKind(e, t) {
		t !== e.kind && z(this, { consumers: { [e.id]: { kind: t } } });
	}
};
D([y({ attribute: !1 })], pn.prototype, "hass", void 0), D([y({ attribute: !1 })], pn.prototype, "t", void 0), D([y({ attribute: !1 })], pn.prototype, "config", void 0), T("joe-consumers", pn);
//#endregion
//#region src/editors/household.ts
var mn = class extends v {
	static {
		this.styles = [E, o`
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
		if (!e || !t || !n) return _;
		let r = (this.discovery?.persons ?? []).filter((e) => L(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return h`<div data-tipped>
      ${n.persons.length ? h`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : h`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add">
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${P(e, "f_person_add")}
      </div>
      ${r.length ? h`<div class="others">
            <span>${e("household.left_out")}</span>
            ${r.map((e) => h`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
          </div>` : _}
    </div>`;
	}
	renderPerson(e, t, n) {
		let r = n.person_entity ? t.states[n.person_entity]?.state : void 0, i = r === "home" ? h`<small class="home">${e("household.home")}</small>` : r === "not_home" ? h`<small>${e("household.away")}</small>` : r ? h`<small>${e("household.zone", { zone: r })}</small>` : h`<small>${e("household.no_presence")}</small>`;
		return h`<li class="person">
      <div class="top">
        <span class="avatar" aria-hidden="true">${n.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${n.name}</b>${i}</div>
        <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(n)}>
          ${e("household.remove")}
        </button>
      </div>
      <div class="cals">
        <span class="cals-label">${e("household.calendars")}</span>
        ${n.calendars.map((r) => h`<span class="cal">
            ${A(t, r)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: A(t, r) })}
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
        ${P(e, "f_calendars")}
      </div>
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await B(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		z(this, {
			persons: { [n]: {
				name: A(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: R(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		z(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: R(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		z(this, {
			persons: { [e.id]: null },
			answers: { ignored: R(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await B(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		z(this, { persons: { [e.id]: { calendars: t } } });
	}
};
D([y({ attribute: !1 })], mn.prototype, "hass", void 0), D([y({ attribute: !1 })], mn.prototype, "t", void 0), D([y({ attribute: !1 })], mn.prototype, "config", void 0), D([y({ attribute: !1 })], mn.prototype, "discovery", void 0), T("joe-household", mn);
//#endregion
//#region src/components/choice.ts
var hn = "unknown", U = class extends v {
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
		return h`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: hn,
			label: this.idk
		}, "idk") : _}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return h`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? h`<ha-icon icon=${e.icon}></ha-icon>` : _}
      <span>${e.label}</span>
      ${n && this.multiple ? h`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : _}
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
D([y({ attribute: !1 })], U.prototype, "options", void 0), D([y({ attribute: !1 })], U.prototype, "value", void 0), D([y({ type: Boolean })], U.prototype, "multiple", void 0), D([y({ attribute: !1 })], U.prototype, "exclusive", void 0), D([y()], U.prototype, "idk", void 0), D([y()], U.prototype, "label", void 0), D([y({
	type: Boolean,
	reflect: !0
})], U.prototype, "compact", void 0), T("joe-choice", U);
//#endregion
//#region src/editors/tariff-form.ts
var gn = class extends v {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [E, o`
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
		if (!e || !t) return _;
		let n = h`<joe-choice
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
		return h`${this.asQuestion ? n : h`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${P(e, "q_tariff")}</div>
            ${n}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : _}
      ${t.kind === "flat" ? this.renderFlat(e, t) : _}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : _}
      ${this.feedIn ? this.renderFeedIn(e, t) : _}`;
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
		return h`<div class="field" data-tipped>
        <div class="field-label">${e("f.window")} ${P(e, "f_window")}</div>
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
        <div class="field-label">${e("f.prices")} ${P(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return h`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${P(e, "f_prices")}</div>
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
		return h`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${P(e, "f_price_entity")}</div>
        <div class="entity">
          ${r && n ? h`<span><b>${A(n, r)}</b> <small>${N(n, r, e.lang)}</small></span>` : h`<small>${e("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${e(r ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.search")} ${P(e, "f_search")}</div>
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
        <div class="field-label">${e("f.surcharge")} ${P(e, "f_surcharge")}</div>
        ${this.centInput(e, t.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(e, t) {
		let n = this.hass;
		return h`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${P(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? h`<p class="field-hint">
            ${e("f.feed_in.entity", { name: A(n, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return h`<span class="unit-input">
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
		let n = this.discovery?.tariff, r = (await B(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: Lt(n?.price_entity ? [{
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
D([y({ attribute: !1 })], gn.prototype, "hass", void 0), D([y({ attribute: !1 })], gn.prototype, "t", void 0), D([y({ attribute: !1 })], gn.prototype, "tariff", void 0), D([y({ attribute: !1 })], gn.prototype, "discovery", void 0), D([y({ type: Boolean })], gn.prototype, "feedIn", void 0), D([y({ type: Boolean })], gn.prototype, "asQuestion", void 0), T("joe-tariff-form", gn);
//#endregion
//#region src/editors/tariff-editor.ts
var _n = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity"
];
function vn(e, t) {
	let n = {};
	for (let r of _n) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
	return n;
}
var yn = class extends v {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [E, o`
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
		return !e || !t ? _ : h`<div class="sheet-title">${S(e("edit.tariff.title"))}</div>
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
		let n = vn(e.tariff, t);
		if (Object.keys(n).length) {
			this.saving = !0;
			let e = { tariff: n };
			"kind" in n && (e.answers = { tariff: t.kind });
			let r = await z(this, e);
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
D([y({ attribute: !1 })], yn.prototype, "hass", void 0), D([y({ attribute: !1 })], yn.prototype, "t", void 0), D([y({ attribute: !1 })], yn.prototype, "config", void 0), D([y({ attribute: !1 })], yn.prototype, "discovery", void 0), D([b()], yn.prototype, "draft", void 0), D([b()], yn.prototype, "saving", void 0), T("joe-tariff-editor", yn);
//#endregion
//#region src/fonts.ts
var bn = [
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
function xn() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = bn.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${et(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region src/components/look-back.ts
function W(e, t, n = "EUR", r = !1) {
	return new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n,
		signDisplay: r ? "exceptZero" : "auto"
	}).format(Math.abs(t) < .005 ? 0 : t);
}
function G(e, t, n = 1) {
	return new Intl.NumberFormat(e, {
		minimumFractionDigits: n,
		maximumFractionDigits: n
	}).format(t);
}
function Sn(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function Cn(e) {
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
function K(e, t, n = "long") {
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
function wn(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/components/plan-text.ts
function q(e) {
	return e ? e.slice(11, 16) : "";
}
function Tn(e) {
	return e.slice(0, 10);
}
function En(e) {
	switch (e?.kind) {
		case "charge": return "plug";
		case "hold": return "switch";
		case "none": return "relax";
		default: return "sleep";
	}
}
function Dn(e) {
	return (e.charge_slots ?? []).map((e) => `${q(e.start)}–${q(e.end)}`).join(", ");
}
function On(e, t) {
	if (!t.window) return "";
	let n = [`${q(t.window.start)}–${q(t.window.end)}`];
	return t.prices && n.push(`${M(e.lang, t.prices.night * 100, 1)} ct/kWh`), n.join(" · ");
}
function kn(e, t) {
	if (t.kind === "unavailable") {
		let n = t.reasons.find((t) => e.optional(`plan.why.${t}`)) ?? "failed";
		return e.optional(`plan.why.${n}`) ?? "";
	}
	let n = [], r = M(e.lang, t.target ?? 0, 0), i = t.sun_takes_over;
	return t.reasons.includes("balance") && n.push(e("plan.say.balance")), t.kind === "charge" && t.tariff === "dynamic" && t.charge_slots?.length ? n.push(e("plan.say.charge_slots", {
		slots: Dn(t),
		target: r
	})) : t.kind === "charge" ? n.push(e("plan.say.charge", {
		from: q(t.charge_from),
		target: r
	})) : t.kind === "hold" ? (n.push(e("plan.say.hold", { target: r })), t.empty_without && n.push(e("plan.say.empty", { time: q(t.empty_without) }))) : t.reasons.includes("small_saving") ? n.push(e("plan.say.small_saving")) : n.push(i ? e("plan.say.none", { time: q(i) }) : e("plan.say.none_nosun")), t.reasons.includes("max_price") && t.kind !== "charge" && n.push(e("plan.say.max_price")), t.kind !== "none" && (i && t.full_at && Tn(t.full_at) === Tn(i) ? n.push(e("plan.say.sun_full", {
		sun: q(i),
		full: q(t.full_at)
	})) : i ? n.push(e("plan.say.sun", { sun: q(i) })) : n.push(e("plan.say.nosun"))), n.join(" ");
}
function An(e, t) {
	return (t.batteries ?? []).map((n) => {
		let r = [n.name];
		return t.kind === "charge" ? r.push(`${M(e.lang, n.soc_start, 0)} → ${M(e.lang, n.target, 0)} %`, `${M(e.lang, n.charge_kwh, 1)} kWh`, `${M(e.lang, n.power_kw, 1)} kW`) : t.kind === "hold" ? r.push(e("plan.line.hold", { target: M(e.lang, n.target, 0) })) : r.push(e("plan.line.now", { soc: M(e.lang, n.soc, 0) })), n.controllable || r.push(e("plan.line.watch_only")), r.join(" · ");
	});
}
function jn(e, t, n = "EUR") {
	if (!t.cost) return "";
	let r = (t) => new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n
	}).format(t), i = [];
	return t.kind === "charge" && i.push(e("plan.cost.night", { value: r(t.cost.night_charge) })), t.cost.saving > .005 && i.push(e("plan.cost.saving", { value: r(t.cost.saving) })), i.join(" · ");
}
//#endregion
//#region src/components/car-need.ts
var Mn = class extends v {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [E, o`
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
		if (!e || !t || !n) return _;
		let r = (t, n = 0) => M(e.lang, t ?? 0, n);
		if (!n.known) return h`<p>${e(n.soc != null && !n.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let i = [];
		i.push(h`<p>
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
      </p>`), i.push(h`<p>
        ${e(`need.consumption.${n.consumption_source}`, {
			value: r(n.consumption, 1),
			temp: n.temp == null ? "–" : r(n.temp)
		})}${n.rain ? ` ${e("need.rain")}` : ""}
      </p>`), n.target_unit === "%" ? i.push(h`<p>${e("need.has_soc", {
			soc: r(n.soc),
			km: r(n.have_km),
			target: r(n.target)
		})}</p>`) : i.push(h`<p>${e("need.has_range", { km: r(n.have_km) })}</p>`);
		let a = n.missing_kwh ?? 0;
		return i.push(h`<p class="result">
        ${a >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: r(a, 1),
			start: q(t.start)
		}) : e("need.missing", { kwh: r(a, 1) }) : e("need.enough")}
      </p>`), n.fits === !1 && i.push(h`<p>${e("need.too_far")}</p>`), h`${i} ${n.trips.length ? this.renderTrips(e, n.trips) : _}`;
	}
	renderTrips(e, t) {
		return h`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${P(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => h`<li>
            <span>${t.start.includes("T") ? q(t.start) : e("need.all_day")}</span>
            <span class="where">${t.location}</span>
            ${this.editing === t.location ? this.renderEdit(e, t) : h`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: M(e.lang, t.km, 0) })}
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
      ${this.failed ? h`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : _}
    </div>`;
	}
	renderEdit(e, t) {
		return h`<form
      @submit=${(e) => {
			e.preventDefault();
			let n = e.target.querySelector("input"), r = Number.parseFloat(n.value.replace(",", "."));
			this.save(t.location, Number.isFinite(r) && r >= 0 ? r : null);
		}}
    >
      <span class="unit-input">
        <input class="input" type="number" min="0" max="3000" step="1" .value=${t.km == null ? "" : String(Math.round(t.km / (this.roundTrip ? 2 : 1)))} aria-label=${e("need.km_one_way")} />
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
D([y({ attribute: !1 })], Mn.prototype, "hass", void 0), D([y({ attribute: !1 })], Mn.prototype, "t", void 0), D([y({ attribute: !1 })], Mn.prototype, "action", void 0), D([y({ attribute: !1 })], Mn.prototype, "roundTrip", void 0), D([b()], Mn.prototype, "editing", void 0), D([b()], Mn.prototype, "failed", void 0), T("joe-car-need", Mn);
//#endregion
//#region src/pages/devices.ts
var Nn = [
	"hold",
	"charge",
	"release"
], J = class extends v {
	constructor(...e) {
		super(...e), this.notice = "", this.boostValue = {}, this.boostUnit = {};
	}
	static {
		this.styles = [E, o`
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
      .boost .unit-select {
        min-height: 34px;
        border: 0;
        background: transparent;
        font: inherit;
        color: var(--joe-ink-2);
        cursor: pointer;
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
		if (!e || !t) return _;
		let n = t.control;
		return h`<div class="wrap">
        <div class="intro">
          <div>
            ${S(e("devices.page.title"))} ${x}
            <p class="lead">${e("devices.lead")}</p>
          </div>
          <joe-pose name="switch"></joe-pose>
        </div>
        ${n ? this.renderStatus(e, t, n) : _}
        <div class="group-label">${e("devices.batteries")}</div>
        ${t.config.batteries.length ? h`<div class="grid">${t.config.batteries.map((t) => this.renderBattery(e, t, n))}</div>` : h`<p class="empty">${e("devices.batteries.none")}</p>`}
        <div class="group-label">${e("devices.actions")}</div>
        <div class="grid">
          ${t.config.actions.map((n) => this.renderAction(e, t, n))} ${this.renderAddAction(e)}
        </div>
        ${n ? this.renderLog(e, n) : _}
      </div>
      ${this.confirm ? this.renderConfirm(e, this.confirm) : _}`;
	}
	renderStatus(e, t, n) {
		let r = t.plan, i = n.reason, a = i === "waiting" && r?.window ? e("devices.status.waiting", { time: q(r.window.start) }) : e(`devices.status.${i}`), o = t.mode === "simulation" ? h`<span class="pill-sim">${e("mode.simulation")}</span>` : h`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`, s = n.steering || n.pending;
		return h`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${o} ${P(e, "plan_steer")}
      </div>
      <p class="status-text">${a}</p>
      ${n.pending ? h`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : _}
      ${s ? h`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${P(e, "devices_release")}
          </div>` : _}
      ${this.notice ? h`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : _}
    </section>`;
	}
	renderBattery(e, t, n) {
		let r = this.hass, i = j(r, t.soc_entity), a = bt(r, t.power), o = n?.ready[t.id] ?? "not_controllable", s = n?.batteries[t.id], c = n?.testing?.battery === t.id ? n.testing : null, l = n?.tests[t.id], u = t.adapter === "generic" ? e("devices.battery.generic") : t.adapter === "steps" ? e("devices.battery.steps") : t.adapter === "none" ? e("devices.battery.watch") : e("devices.battery.profile", { name: this.info?.profiles?.[t.adapter] ?? t.adapter }), d = s?.action ? e(`devices.action.${s.action}`, {
			target: M(e.lang, s.target, 0),
			floor: M(e.lang, s.floor ?? 0, 0)
		}) : e("devices.action.idle"), f = s?.problem ?? (o !== "ready" && o !== "not_controllable" ? o : null);
		return h`<section class="card battery" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${t.name}</div>
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${u}</span>
      </div>
      <div class="figures">
        <b>${i == null ? "–" : M(e.lang, i, 0)}<small>%</small></b>
        ${a == null ? _ : h`<span
              >${Math.abs(a) < .05 ? e("devices.power.idle") : e(a > 0 ? "devices.power.charge" : "devices.power.discharge", { value: M(e.lang, Math.abs(a), 2) })}</span
            >`}
      </div>
      <p class="now">${t.adapter === "none" ? e("devices.action.watch") : d}</p>
      ${f && t.adapter !== "none" ? h`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon
            ><span>${e.optional(`devices.problem.${f === "outdated" ? "not_tested" : f}`) ?? f}</span>
          </div>` : _}
      ${t.adapter === "none" && this.hasSuggestion(t) ? h`<div class="note"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>${e("devices.suggested")}</span></div>` : _}
      ${t.adapter === "none" ? _ : this.renderTest(e, t, o, l, c)}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.edit(t)}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </button>
        ${P(e, "devices_setup")}
      </div>
    </section>`;
	}
	renderAction(e, t, n) {
		let r = t.plan, i = r?.actions?.find((e) => e.id === n.id), a = t.control?.actions?.[n.id], o = r?.window?.start, s = !!o && t.control?.tonight?.[n.id] === o;
		return h`<section class="card action" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${n.kind === "target" ? "mdi:water-boiler" : /ev|car|auto|wallbox/i.test(n.id + n.name) ? "mdi:car-electric" : "mdi:flash-outline"}></ha-icon>${n.name}</div>
        ${n.enabled ? _ : h`<span class="chip">${e("devices.action.off")}</span>`}
      </div>
      <p class="now">${this.actionText(e, t, n, i, a)}</p>
      ${i?.need ? h`<joe-car-need .hass=${this.hass} .t=${e} .action=${i} .roundTrip=${n.need?.round_trip ?? !0}></joe-car-need>` : _}
      ${n.kind === "switch" && (n.need?.soc_entity || n.need?.range_entity) ? this.renderBoost(e, t, n) : _}
      <div class="test">
        <span class="toggle-label" id="tonight-${n.id}">${e("devices.action.tonight")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(s)}
          aria-labelledby="tonight-${n.id}"
          ?disabled=${!o || !n.enabled}
          @click=${() => this.toggleTonight(n.id, !s)}
        ></button>
        ${P(e, "action_tonight")}
      </div>
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.editAction(n.id)}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("devices.action.edit")}
        </button>
      </div>
    </section>`;
	}
	renderBoost(e, t, n) {
		let r = t.control?.boost?.[n.id], i = t.control?.actions?.[n.id], a = n.need;
		if (r) {
			let t = i?.value, a = r.unit;
			return h`<div class="boost on" data-tipped>
        <span>
          ${e(a === "km" ? "devices.boost.running_km" : "devices.boost.running", {
				target: M(e.lang, r.chosen, 0),
				reserve: M(e.lang, r.target - r.chosen, 0),
				now: t == null ? "–" : M(e.lang, t, 0)
			})}
        </span>
        <button type="button" class="mini-btn quiet" @click=${() => this.boost(n.id, null)}>${e("devices.boost.stop")}</button>
        ${P(e, "boost")}
      </div>`;
		}
		let o = [...a.soc_entity ? ["%"] : [], ...a.range_entity ? ["km"] : []], s = this.boostUnit[n.id] && o.includes(this.boostUnit[n.id]) ? this.boostUnit[n.id] : o[0], c = this.boostValue[`${n.id}:${s}`] ?? (s === "%" ? 80 : 200), l = s === "%" ? 100 : 1500;
		return h`<form
      class="boost"
      data-tipped
      novalidate
      @submit=${(e) => {
			e.preventDefault();
			let t = e.target.querySelector("input"), r = Number.parseFloat(t.value.replace(",", ".")), i = Number.isFinite(r) ? r : c;
			this.boost(n.id, Math.round(Math.min(l, Math.max(1, i))), s);
		}}
    >
      <label class="toggle-label" for="boost-${n.id}">${e("devices.boost.label")}</label>
      <span class="amount">
        <input
          id="boost-${n.id}"
          class="input"
          type="number"
          inputmode="numeric"
          min=${s === "%" ? 5 : 10}
          max=${l}
          step=${s === "%" ? 5 : 10}
          .value=${String(c)}
          @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			Number.isFinite(t) && t >= 1 && (this.boostValue = {
				...this.boostValue,
				[`${n.id}:${s}`]: Math.min(t, s === "%" ? 100 : 1500)
			});
		}}
        />
        ${o.length > 1 ? h`<select
              class="unit-select"
              aria-label=${e("devices.boost.unit")}
              @change=${(e) => {
			this.boostUnit = {
				...this.boostUnit,
				[n.id]: e.target.value
			};
		}}
            >
              ${o.map((e) => h`<option value=${e} ?selected=${e === s}>${e}</option>`)}
            </select>` : h`<span class="unit">${s}</span>`}
      </span>
      <button type="submit" class="mini-btn go" ?disabled=${t.mode === "off" || !n.enabled}>
        <ha-icon icon="mdi:ev-plug-type2"></ha-icon>${e("devices.boost.go")}
      </button>
      ${P(e, "boost")}
      ${s === "km" ? h`<small class="hint">${e("devices.boost.reserve", { reserve: M(e.lang, a.reserve_km ?? 50, 0) })}</small>` : _}
    </form>`;
	}
	async boost(e, t, n = "%") {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/boost",
				action_id: e,
				target: t,
				unit: n
			});
		} catch {
			this.notice = this.t("error.action");
		}
	}
	actionText(e, t, n, r, i) {
		let a = r?.target == null ? "" : M(e.lang, r.target, 0);
		if (!n.enabled) return e("devices.action.disabled");
		if (i?.reason === "boost") return e("devices.action.boost");
		if (i?.on) return n.kind === "target" ? e("devices.action.heating", {
			target: a,
			end: q(i.end)
		}) : e("devices.action.running", { end: q(i.end) });
		if (i?.reason === "reached") return r?.need ? e("devices.action.reached_need", {
			target: a,
			unit: r.need.target_unit === "km" ? "km" : "%"
		}) : e("devices.action.reached", { target: a });
		if (!r) return e("devices.action.no_plan");
		let o = t.mode === "simulation" ? e("devices.action.would") : "";
		if (r.run) return `${o}${n.kind === "target" ? e("devices.action.plan_target", {
			start: q(r.start),
			target: a
		}) : e("devices.action.plan_run", {
			start: q(r.start),
			end: q(r.end)
		})}`;
		let s = r.reasons[r.reasons.length - 1] ?? "manual_only";
		return e.optional(`devices.action.why.${s}`, {
			kwh: M(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
			temperature: M(e.lang, r.temperature ?? 0, 0)
		}) ?? s;
	}
	renderAddAction(e) {
		return h`<section class="card add" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${e("devices.action.add")}</div>
        ${P(e, "devices_actions")}
      </div>
      <p class="now">${e("devices.action.add.text")}</p>
      <div class="actions">
        ${[
			"ev",
			"hot_water",
			"custom"
		].map((t) => h`<button type="button" class="mini-btn" @click=${() => this.editAction(`new:${t}`)}>
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
	renderTest(e, t, n, r, i) {
		let a = !!this.state?.control?.testing, o = !!this.state?.control?.steering, s = i ? h`<span class="chip">${e("devices.test.running")}</span>` : n === "outdated" ? h`<span class="chip warn">${e("devices.test.outdated")}</span>` : r ? h`<span class="chip ${r.ok ? "ok" : "warn"}"
              >${e(r.ok ? "devices.test.ok" : "devices.test.failed", { day: K(e.lang, r.at, "short") })}</span
            >` : h`<span class="chip">${e("devices.test.none")}</span>`, c = i?.steps ?? r?.steps ?? [];
		return h`<div class="test">
        ${s}
        <button
          type="button"
          class="btn btn-secondary"
          ?disabled=${a || o}
          @click=${() => this.confirm = t}
        >
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(r ? "devices.test.again" : "devices.test.start")}
        </button>
        ${P(e, "devices_test")}
      </div>
      ${i || r ? this.renderSteps(e, c, i?.step ?? null, r) : _}`;
	}
	renderSteps(e, t, n, r) {
		let i = new Map(t.map((e) => [e.step, e])), a = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return h`<ul class="steps">
      ${a ? h`<li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${a}</small></li>` : _}
      ${a ? _ : Nn.map((t) => {
			let r = i.get(t);
			return h`<li class=${r ? r.ok ? "ok" : "bad" : "wait"}>
              <ha-icon icon=${r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline"}></ha-icon>
              <b>${e(`devices.test.step.${t}`)}</b>
              <small>${r ? this.stepText(e, r) : ""}</small>
            </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let n = this.hass, r = [];
		return t.power != null && r.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: M(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && r.push(e("devices.test.wrong", { entities: t.wrong.map((e) => A(n, e)).join(", ") })), t.errors.length && r.push(e("devices.test.error", { entities: t.errors.map((e) => A(n, e.entity_id)).join(", ") })), r.join(" · ");
	}
	renderLog(e, t) {
		let n = [...t.log].reverse().slice(0, 30);
		return h`<section class="card">
      <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${e("devices.log")}</div>
      ${n.length ? h`<ul class="log">
            ${n.map((t) => h`<li>
                <time>${K(e.lang, t.at, "short")} ${t.at.slice(11, 16)}</time>
                <span>${this.logText(e, t)}</span>
              </li>`)}
          </ul>` : h`<p class="empty">${e("devices.log.empty")}</p>`}
    </section>`;
	}
	logText(e, t) {
		let n = this.hass, r = this.state?.config, i = {
			battery: r?.batteries.find((e) => e.id === t.battery)?.name ?? r?.actions.find((e) => `action:${e.id}` === t.battery)?.name ?? t.battery ?? "",
			entity: t.entity ? A(n, t.entity) : "",
			value: t.value == null ? "–" : String(t.value),
			target: String(t.target ?? ""),
			power: typeof t.power == "number" ? M(e.lang, t.power, 1) : "–",
			soc: typeof t.soc == "number" ? M(e.lang, t.soc, 0) : "–",
			unit: typeof t.unit == "string" ? t.unit : "%"
		};
		return t.kind === "boost_end" ? e.optional(`log.boost_end.${String(t.reason)}`, i) ?? e("log.boost_end.stopped", i) : t.kind === "answer" ? e(t.yes ? "log.answer.yes" : "log.answer.no") : t.kind === "test" ? e(t.ok ? "log.test.ok" : "log.test.failed", i) : e.optional(`log.${t.kind}`, i) ?? t.kind;
	}
	renderConfirm(e, t) {
		let n = () => {
			this.confirm = void 0;
		};
		return h`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">
          ${S(e("devices.test.confirm.title", { name: t.name }), "h2", P(e, "devices_test"))}
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
D([y({ attribute: !1 })], J.prototype, "hass", void 0), D([y({ attribute: !1 })], J.prototype, "t", void 0), D([y({ attribute: !1 })], J.prototype, "state", void 0), D([y({ attribute: !1 })], J.prototype, "discovery", void 0), D([y({ attribute: !1 })], J.prototype, "info", void 0), D([b()], J.prototype, "confirm", void 0), D([b()], J.prototype, "notice", void 0), D([b()], J.prototype, "boostValue", void 0), D([b()], J.prototype, "boostUnit", void 0), T("joe-devices-page", J);
//#endregion
//#region src/components/chart.ts
var Pn = 40, Fn = 10, In = 16, Ln = 24;
function Rn(e) {
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
function zn(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var Y = class extends v {
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
		if (!e) return _;
		let t = Math.max(260, this.width), n = this.height, r = t - Pn - Fn, i = n - In - Ln, a = r / e, o = this.series.flatMap((e) => e.values.filter((e) => e != null)), s = this.max || Rn(Math.max(.1, ...o)), c = Math.min(0, ...o), l = c < 0 ? -Math.max(Rn(-c), s / 4) : 0, u = (e) => In + i - (Math.max(l, Math.min(e, s)) - l) / (s - l) * i, d = (e) => Pn + e * a, f = (e) => Pn + (e + .5) * a, p = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), m = [];
		for (let e of this.bands) m.push(g`<rect class="band" x=${d(e.from)} y=${In} width=${Math.max(0, d(e.to) - d(e.from))} height=${i}></rect>
        <text class="note" x=${(d(e.from) + d(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of l < 0 ? [
			l,
			0,
			s
		] : [
			0,
			s / 2,
			s
		]) m.push(g`<line class="grid" x1=${Pn} x2=${t - Fn} y1=${u(e)} y2=${u(e)}></line>
        <text class="tick" x=${34} y=${u(e) + 4} text-anchor="end">${p(e, 2)}</text>`);
		m.push(g`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) m.push(g`<text class="tick" x=${this.centerTicks ? f(e) : d(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let ee = this.series.filter((e) => e.kind === "bar"), te = a * .68 / Math.max(1, ee.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + ee.indexOf(e) * te;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let i = Math.min(u(n), u(0));
						m.push(g`<rect x=${d(r) + t} y=${i} width=${Math.max(1, te - 1)}
              height=${Math.max(1, Math.abs(u(0) - u(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of zn(e.values)) {
				let n = t.map(([e, t]) => `${f(e).toFixed(1)},${u(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = u(0).toFixed(1);
					m.push(g`<polygon points=${`${f(t[0][0]).toFixed(1)},${r} ${n} ${f(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? m.push(g`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : m.push(g`<circle cx=${f(t[0][0])} cy=${u(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = Pn + e.at * a, o = n < Pn + r * .75;
			m.push(g`<line class="marker" x1=${n} x2=${n} y1=${In} y2=${In + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && m.push(g`<line class="guide" x1=${f(this.hover)} x2=${f(this.hover)} y1=${In} y2=${In + i}></line>`);
		for (let t = 0; t < e; t++) m.push(g`<rect class="slot" x=${d(t)} y=${In} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return h`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${m}
      </svg>
      ${this.hover == null ? _ : this.renderBox(this.hover, f(this.hover), t, p)}`;
	}
	renderBox(e, t, n, r) {
		return h`<div class="box" style="left:${t + 182 > n ? Math.max(0, t - 182) : t + 12}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? _ : h`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
D([y({ attribute: !1 })], Y.prototype, "labels", void 0), D([y({ attribute: !1 })], Y.prototype, "ticks", void 0), D([y({ attribute: !1 })], Y.prototype, "series", void 0), D([y({ attribute: !1 })], Y.prototype, "bands", void 0), D([y({ attribute: !1 })], Y.prototype, "markers", void 0), D([y()], Y.prototype, "unit", void 0), D([y({ type: Number })], Y.prototype, "max", void 0), D([y({ type: Number })], Y.prototype, "height", void 0), D([y()], Y.prototype, "label", void 0), D([y()], Y.prototype, "lang", void 0), D([y({ type: Boolean })], Y.prototype, "centerTicks", void 0), D([b()], Y.prototype, "width", void 0), D([b()], Y.prototype, "hover", void 0), T("joe-chart", Y);
//#endregion
//#region src/pages/history.ts
var Bn = 14, Vn = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function Hn(e, t, n) {
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
var Un = class extends v {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [E, o`
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
				days: Bn
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
		return e ? this.days?.days.length ? h`<div class="wrap">
      ${S(e("history.title"))} ${x}
      <p class="status">${this.statusText(e)}</p>
      ${this.renderStrip(e, this.days.days)} ${this.detail ? this.renderDay(e, this.detail) : _}
    </div>` : this.renderEmpty(e) : _;
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
		return h`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${S(e("history.title"))} ${x}
        <p class="lead">${e(n)}</p>
        ${this.failed ? h`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : _}
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
		return h`<div class="strip" role="group" aria-label=${e("history.days")} data-notip>
      ${i.map((t) => {
			let n = r.get(t);
			return h`<button
          type="button"
          aria-pressed=${String(t === this.selected)}
          ?disabled=${!n}
          aria-label=${Hn(e.lang, t, "long")}
          @click=${() => this.select(t)}
        >
          <small>${Hn(e.lang, t, "short")}</small>
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
		return h`<div class="day-head">
        <h3>${Hn(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? h`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? h`<span class="chip">${e("history.day_off")}</span>` : _}
        ${i ? h`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : _}
        ${a ? h`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : _}
      </div>
      ${this.renderTiles(e, n)} ${this.renderEnergyChart(e, t)} ${this.renderSocChart(e, t)}
      ${this.renderEvaluation(e, t)}
      ${r && n.date !== this.days?.days[0]?.date ? h`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : _}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : M(e.lang, t, 1), r = [], i = (e, t, n, r) => h`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? h`<div class="sub">${r}</div>` : _}
      </div>`;
		if (t.home != null && r.push(i(e("history.tile.home"), n(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: M(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && r.push(i(e("history.tile.solar"), n(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: n(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : M(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let a = [];
			t.grid_in_cheap != null && a.push(e("history.tile.grid.cheap", { value: n(t.grid_in_cheap) })), t.grid_out != null && a.push(e("history.tile.grid.out", { value: n(t.grid_out) })), r.push(i(e("history.tile.grid"), n(t.grid_in), "kWh", a.join(" · ")));
		}
		if (t.bat_in != null && r.push(i(e("history.tile.battery"), n(t.bat_in), "kWh", e("history.tile.battery.out", { value: n(t.bat_out) }))), t.temp && r.push(i(e("history.tile.temp"), M(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: M(e.lang, t.temp.min, 0),
			max: M(e.lang, t.temp.max, 0)
		}))), t.present) {
			let n = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), a = Object.entries(t.present), o = Math.max(...a.map(([, e]) => e));
			r.push(i(e("history.tile.present"), M(e.lang, o, 0), "h", a.map(([t, r]) => `${n.get(t) ?? t} ${M(e.lang, r, 0)} h`).join(" · ")));
		}
		return h`<div class="tiles">${r}</div>`;
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
		return h`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.energy")} ${P(e, "chart_energy")}</div>
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
        ${i.map((e) => h`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
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
				color: Vn[n % Vn.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return _;
		t.plan_soc_slots.some((e) => e != null) && n.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let r = this.chartFrame(t);
		return h`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.soc")} ${P(e, "chart_soc")}</div>
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
        ${n.map((e) => h`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderEvaluation(e, t) {
		let n = t.evaluation;
		if (!t.plan?.fixed) return _;
		if (!n) return h`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!n.complete) return h`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let r = this.hass?.config?.currency, i = n.saving ?? 0, a = i > .005 ? "good" : i < -.005 ? "bad" : "", o = (t) => G(e.lang, t ?? 0, 1), s = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), c = !n.final, l = [[e("history.eval.day"), e("history.eval.instead", {
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
		return h`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${P(e, "chart_replay")}
        ${c && n.until ? h`<span class="chip warn">${e("history.eval.provisional", { time: this.time(n.until) })}</span>` : _}
      </div>
      <div class="eval-top">
        <div class="eval-big ${a}">
          ${a === "bad" ? W(e, -i, r) : W(e, i, r)}
          <small>${e(a === "good" ? "history.eval.saved" : a === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${l.map(([e, t]) => h`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${c && n.until ? h`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(n.until) })}</span>
          </div>` : _}
      ${u.some((e) => e.values.some((e) => e != null)) ? h`<joe-chart
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
            <div class="legend">
              ${u.map((e) => h`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
            </div>` : _}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
D([y({ attribute: !1 })], Un.prototype, "hass", void 0), D([y({ attribute: !1 })], Un.prototype, "t", void 0), D([y({ attribute: !1 })], Un.prototype, "state", void 0), D([b()], Un.prototype, "days", void 0), D([b()], Un.prototype, "selected", void 0), D([b()], Un.prototype, "detail", void 0), D([b()], Un.prototype, "failed", void 0), T("joe-history", Un);
//#endregion
//#region src/components/day-questions.ts
var Wn = {
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
}, Gn = class extends v {
	constructor(...e) {
		super(...e), this.questions = [], this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [E, o`
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
		return !e || !t.length ? _ : h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${P(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => h`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: K(e.lang, t.date, "weekday"),
			actual: G(e.lang, t.actual, 1),
			expected: G(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${Wn[t.kind].map((n) => h`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? h`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : _}
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
D([y({ attribute: !1 })], Gn.prototype, "hass", void 0), D([y({ attribute: !1 })], Gn.prototype, "t", void 0), D([y({ attribute: !1 })], Gn.prototype, "questions", void 0), D([b()], Gn.prototype, "busy", void 0), D([b()], Gn.prototype, "failed", void 0), D([b()], Gn.prototype, "answered", void 0), T("joe-day-questions", Gn);
//#endregion
//#region src/pages/learn.ts
var Kn = [
	"clear",
	"mixed",
	"overcast"
], qn = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
], Jn = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
};
function Yn(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
function Xn(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, K(e, i, "short"));
	}), r;
}
var X = class extends v {
	constructor(...e) {
		super(...e), this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all", this.keyword = {};
	}
	static {
		this.styles = [E, o`
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
		if (!e) return _;
		let t = this.data;
		return h`<div class="wrap">
        <div class="intro">
          <div>
            ${S(e("learn.page.title"))} ${x}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? h`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : _}
        ${t ? h`${this.renderResults(e, t)}
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
              ${this.renderCalendar(e)} ${this.renderAccuracy(e, t)} ${this.renderReset(e)}` : _}
      </div>
      ${this.confirming ? this.renderConfirm(e) : _}`;
	}
	statusText(e) {
		let t = this.state?.observe, n = this.state?.config.learned;
		if (this.state?.mode === "off") return e("learn.paused");
		if (!t?.active) return e("learn.waiting");
		let r = [];
		return n?.since ? r.push(e("learn.since", { day: K(e.lang, n.since) })) : t.first_day && r.push(e("learn.since_start", { day: K(e.lang, t.first_day) })), n?.updated && r.push(e("learn.updated", {
			day: K(e.lang, n.updated, "short"),
			time: n.updated.slice(11, 16)
		})), r.join(" · ");
	}
	renderResults(e, t) {
		let n = t.results, r = h`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("learn.results")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${P(e, "sim_result")}
    </div>`;
		if (!n?.days) return h`<section class="card hero" data-tipped>${r}
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
		return h`<section class="card hero" data-tipped>
      ${r}
      <div class="figure">
        <div class="big ${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}">
          ${W(e, n.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: o ? K(e.lang, o) : "–",
			nights: wn(e, n.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
      </p>
      ${i.length > 1 ? h`<joe-chart
            .labels=${i.map((t) => K(e.lang, t.date, "weekday"))}
            .ticks=${Xn(e.lang, i.map((e) => e.date))}
            .series=${a}
            centerTicks
            unit=${Sn(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : _}
    </section>`;
	}
	renderSolar(e, t) {
		let n = t.learned, r = n.solar_factor, i;
		i = r == null ? e("learn.solar.learning", {
			need: t.needs.solar,
			have: n.solar_days
		}) : r < .95 ? e("learn.solar.less", {
			value: M(e.lang, (1 - r) * 100, 0),
			share: M(e.lang, r * 100, 0)
		}) : r > 1.05 ? e("learn.solar.more", {
			value: M(e.lang, (r - 1) * 100, 0),
			share: M(e.lang, r * 100, 0)
		}) : e("learn.solar.fits");
		let a = t.solar.slice(-28), o = [{
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
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("learn.solar")}</div>
        ${P(e, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">
          ${r == null ? e("learn.still") : `× ${M(e.lang, r, 2)}`}
        </div>
        ${r == null ? _ : h`${w(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.solar_days })}</span>`}
      </div>
      <p class="say">${i}</p>
      ${a.length > 1 ? this.chartWithLegend(e, a.map((e) => e.date), o, "kWh", e("learn.solar.chart")) : _}
    </section>`;
	}
	renderShift(e, t) {
		let n = t.learned, r = n.solar_shift;
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${e("learn.shift")}</div>
        ${P(e, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">${e(r == null ? "learn.still" : `learn.shift.big.${r}`)}</div>
        ${r == null ? _ : h`${w(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.shift_days })}</span>`}
      </div>
      <p class="say">
        ${r == null ? e("learn.shift.learning", {
			need: t.needs.shift,
			have: n.shift_days
		}) : e(`learn.shift.${r}`)}
      </p>
      ${t.solar_profile ? this.hourChart(e, this.profileSeries(e, t.solar_profile), e("learn.shift.chart")) : _}
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
		return h`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => h`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderBuffer(e, t) {
		let { value: n, source: r } = t.buffer, i = t.learned, a = (t) => M(e.lang, t * 100, 0), o;
		o = r === "user" ? i.buffer == null ? e("learn.buffer.user") : e("learn.buffer.user_learned", { value: a(i.buffer) }) : r === "learned" ? e("learn.buffer.learned") : e("learn.buffer.default", {
			need: t.needs.buffer,
			have: i.buffer_days
		});
		let s = t.accuracy.slice(-14), c = [{
			label: e("learn.buffer.chart.planned"),
			kind: "bar",
			values: s.map((e) => e.bridge.planned),
			color: "var(--joe-c-ist)",
			digits: 1
		}, {
			label: e("learn.buffer.chart.actual"),
			kind: "bar",
			values: s.map((e) => e.bridge.actual),
			color: "var(--joe-c-soc)",
			digits: 1
		}];
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${e("learn.buffer")}</div>
        ${P(e, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${a(n)}<small> %</small></div>
        ${w(e, { source: r })}
        ${r === "learned" ? h`<span class="chip">${e("learn.mornings", { count: i.buffer_days })}</span>` : _}
      </div>
      <p class="say">${o}</p>
      ${r === "user" ? h`<div class="own">
            <button
              type="button"
              class="mini-btn"
              @click=${() => z(this, { rules: { buffer_factor: t.buffer.default } }, "default")}
            >
              <ha-icon icon="mdi:auto-fix"></ha-icon>${e("learn.buffer.own")}
            </button>
            ${P(e, "learn_buffer_own")}
          </div>` : _}
      ${s.length > 1 ? this.chartWithLegend(e, s.map((e) => e.date), c, "kWh", e("learn.buffer.chart")) : _}
    </section>`;
	}
	renderHome(e, t) {
		let n = t.consumption, r = (t) => G(e.lang, t.reduce((e, t) => e + t, 0), 1), i = [{
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
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("learn.home")}</div>
        ${P(e, "learn_home")}
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
		return h`<joe-chart
        .labels=${t.map((t) => K(e.lang, t, "weekday"))}
        .ticks=${Xn(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => h`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	rows(e) {
		return h`<div class="rows">
      ${e.map((e) => h`<div class="row-item">
          <b>${e.name}</b>
          <span class="values">${e.values.map((e) => h`<span>${e}</span>`)}</span>
          ${e.note ? h`<small>${e.note}</small>` : _}
        </div>`)}
    </div>`;
	}
	renderWeather(e, t) {
		let n = e.lang, r = t.learned.consumption_model, i = t.days.filter((e) => e.temp != null), a = i.filter((e) => !e.excluded).length, o = this.state?.config.context.weather_entity, s;
		if (!o) s = e("learn.model.no_weather");
		else if (!r) s = e("learn.model.learning", {
			need: t.needs.models,
			have: a
		});
		else {
			let t = [e("learn.model.base", { value: G(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1) })];
			Math.abs(r.workday) >= .3 && t.push(e(r.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: G(n, Math.abs(r.workday), 1) })), r.heat >= .05 && t.push(e("learn.model.heat", { value: G(n, r.heat, 2) })), r.cool >= .05 && t.push(e("learn.model.cool", { value: G(n, r.cool, 2) })), r.presence != null && Math.abs(r.presence) >= .05 && t.push(e("learn.model.presence", { value: G(n, r.presence, 2) })), t.push(e("learn.model.fit", { share: M(n, r.r2 * 100, 0) })), s = t.join(" ");
		}
		let c = r != null && r.heat >= .05;
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${e("learn.model")}</div>
        ${P(e, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${r ? "" : "small"}">
          ${r ? c ? h`+${G(n, r.heat, 2)}<small> kWh/°C</small>` : h`${G(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1)}<small> kWh</small>` : e("learn.still")}
        </div>
        ${r ? h`${w(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.days })}</span>` : _}
      </div>
      <p class="say">${s}</p>
      ${i.length > 2 ? this.temperatureChart(e, t, r) : _}
    </section>`;
	}
	temperatureChart(e, t, n) {
		let r = t.days.filter((e) => e.temp != null && !e.excluded), i = r.map((e) => e.temp), a = Math.floor(Math.min(...i) / 2) * 2, o = Math.floor(Math.max(...i) / 2) * 2 + 2, s = [];
		for (let e = a; e < o; e += 2) s.push(e);
		let c = (t) => M(e.lang, t, 0), l = [{
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
			values: s.map((e) => Yn(n, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: s.map((e) => Yn(n, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let u = Math.max(1, Math.ceil(s.length / 8)), d = /* @__PURE__ */ new Map();
		return s.forEach((e, t) => {
			t % u === 0 && d.set(t, `${c(e)}°`);
		}), h`<joe-chart
        .labels=${s.map((e) => `${c(e)} … ${c(e + 2)} °C`)}
        .ticks=${d}
        .series=${l}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${l.map((e) => h`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.solar_classes ?? {}, a = i.classes ?? {}, o = r.forecast, s = t.learned.sources ?? {}, c = Kn.filter((e) => a[e]), l = (e) => M(n, e * 100, 0), u = [["main", o.provider ? Jn[o.provider] ?? o.provider : e("learn.sources.main")], ...o.alternatives.map((e) => [e.id, e.name])], d = Object.fromEntries(u.map(([e]) => [e, s[e] ? 1 / Math.max(s[e].error, .05) ** 2 : 0])), f = Object.values(d).reduce((e, t) => e + t, 0);
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${P(e, "learn_weather")}
      </div>
      <p class="say">
        ${c.length ? e("learn.weather.say", { top: G(n, i.top ?? 0, 1) }) : e("learn.weather.learning", { have: i.days ?? 0 })}
      </p>
      ${c.length ? this.rows(Kn.map((t) => {
			let r = a[t];
			return {
				name: e(`learn.weather.${t}`),
				values: r ? [`× ${M(n, r.factor, 2)}`, e("learn.days", { days: r.days })] : [e("learn.still")]
			};
		})) : _}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${o.alternatives.length ? h`${this.rows(u.map(([r, i]) => {
			let a = s[r];
			return {
				name: i,
				values: a ? [
					`× ${M(n, a.factor, 2)}`,
					e("learn.sources.error", { value: l(a.error) }),
					o.combine && f ? e("learn.sources.weight", { value: l(d[r] / f) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            <div class="toggle-row">
              <span class="with-tip"><span id="combine-label">${e("learn.sources.combine")}</span>${P(e, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(o.combine)}
                aria-labelledby="combine-label"
                @click=${() => z(this, { forecast: { combine: !o.combine } })}
              ></button>
            </div>` : h`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	renderBatteries(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.battery_models ?? {};
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-heart-variant"></ha-icon>${e("learn.battery")}</div>
        ${P(e, "learn_battery")}
      </div>
      ${r.batteries.length ? this.rows(r.batteries.map((a) => {
			let o = i[a.id], s = a.capacity_kwh, c = r.provenance[`batteries[${a.id}].capacity_kwh`]?.source === "user", l;
			return l = o ? c && s ? e("learn.battery.user", { value: G(n, s, 1) }) : s && (o.capacity_kwh / s < .5 || o.capacity_kwh / s > 1.15) ? e("learn.battery.odd", { value: G(n, s, 1) }) : s ? e("learn.battery.uses_nominal", { value: G(n, s, 1) }) : e("learn.battery.uses") : a.power ? e("learn.battery.learning", { need: t.needs.models }) : e("learn.battery.no_power"), {
				name: a.name,
				values: o ? [e("learn.battery.capacity", { value: G(n, o.capacity_kwh, 1) }), e("learn.battery.efficiency", { value: M(n, o.efficiency * 100, 0) })] : [e("learn.still")],
				note: l
			};
		})) : h`<p class="say">${e("learn.battery.none")}</p>`}
    </section>`;
	}
	renderGroups(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.group_models ?? {}, a = r.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-donut"></ha-icon>${e("learn.groups")}</div>
        ${P(e, "learn_groups")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = i[t.id];
			return {
				name: t.name,
				values: r ? [e("learn.groups.average", { value: G(n, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: G(n, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
			};
		})) : h`<p class="say">${e("learn.groups.none")}</p>`}
    </section>`;
	}
	renderHotWater(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.action_models ?? {}, a = r.actions.filter((e) => e.kind === "target");
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:water-boiler"></ha-icon>${e("learn.hot_water")}</div>
        ${P(e, "learn_hot_water")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = i[t.id];
			return {
				name: t.name,
				values: r ? [
					e("learn.hot_water.rate", { value: G(n, r.rate_k_per_h, 1) }),
					e("learn.hot_water.loss", { value: G(n, r.loss_k_per_h, 1) }),
					e("learn.hot_water.demand", { value: G(n, r.demand_k, 0) })
				] : [e("learn.still")],
				note: r ? void 0 : e("learn.hot_water.learning")
			};
		})) : h`<p class="say">${e("learn.hot_water.none")}</p>`}
    </section>`;
	}
	renderCars(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.car_models ?? {}, a = r.actions.filter((e) => e.kind === "switch" && e.need?.enabled);
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${e("learn.car")}</div>
        ${P(e, "learn_car")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = i[t.id], a = [];
			return r?.consumption != null && (a.push(e("learn.car.consumption", { value: G(n, r.consumption, 1) })), r.cold && a.push(e("learn.car.cold", { value: G(n, r.cold, 2) }))), (r?.workday_km != null || r?.day_off_km != null) && a.push(e("learn.car.km", {
				workday: r.workday_km == null ? "–" : G(n, r.workday_km, 0),
				day_off: r.day_off_km == null ? "–" : G(n, r.day_off_km, 0)
			})), {
				name: t.name,
				values: a.length ? a : [e("learn.still")],
				note: a.length ? void 0 : e(t.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer")
			};
		})) : h`<p class="say">${e("learn.car.none")}</p>`}
    </section>`;
	}
	renderPresence(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.presence ?? {}, a = r.persons.filter((e) => e.calendars.length);
		return h`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:account-clock-outline"></ha-icon>${e("learn.presence")}</div>
        ${P(e, "learn_presence")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = en.filter((e) => i[t.id]?.[e]);
			return {
				name: t.name,
				values: r.length ? r.map((r) => e("learn.presence.value", {
					label: e(`label.${r}`),
					hours: G(n, i[t.id][r].hours, 0)
				})) : [e("learn.still")],
				note: t.person_entity ? void 0 : e("learn.presence.no_person")
			};
		})) : h`<p class="say">${e("learn.presence.none")}</p>`}
      <div class="own">
        <button type="button" class="mini-btn" @click=${() => this.edit("household")}>
          <ha-icon icon="mdi:calendar-account-outline"></ha-icon>${e("learn.presence.calendars")}
        </button>
      </div>
    </section>`;
	}
	renderCalendar(e) {
		let t = this.state.config.calendar, n = (e) => t.rules.filter((t) => t.label === e);
		return h`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${P(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      <div class="rules">
        ${qn.map((r) => h`<div class="rule">
            <b>${e(`label.${r}`)}</b>
            <div class="keywords">
              ${n(r).map((n) => h`<span class="keyword"
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
      <div class="sub-head with-tip"><b>${e("learn.calendar.defaults")}</b>${P(e, "cal_defaults")}</div>
      <div class="defaults">
        ${["default_workday", "default_day_off"].map((n) => h`<label class="field">
            <span class="field-label">${e(`learn.calendar.${n}`)}</span>
            <select
              class="input"
              @change=${(e) => z(this, { calendar: { [n]: e.target.value } })}
            >
              ${en.map((r) => h`<option value=${r} ?selected=${t[n] === r}>${e(`label.${r}`)}</option>`)}
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
		let t = qn.flatMap((t) => e.filter((e) => e.label === t));
		z(this, { calendar: { rules: t } });
	}
	edit(e) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: { editor: e },
			bubbles: !0,
			composed: !0
		}));
	}
	renderAccuracy(e, t) {
		let n = t.accuracy.slice(-14).reverse(), r = (t) => t == null ? "–" : G(e.lang, t, 1);
		return h`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${P(e, "learn_accuracy")}
      </div>
      ${n.length ? h`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
            <span class="th" role="columnheader">${e("learn.accuracy.night")}</span>
            <span class="th" role="columnheader">${e("learn.accuracy.solar")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.morning")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.result")}</span>
            ${n.map((t) => h`<span role="cell">${K(e.lang, t.date, "weekday")}</span>
                <span role="cell">${e("learn.accuracy.value", {
			expected: r(t.solar.forecast),
			actual: r(t.solar.actual)
		})}</span>
                <span role="cell">${e("learn.accuracy.value", {
			expected: r(t.bridge.planned),
			actual: r(t.bridge.actual)
		})}</span>
                <span role="cell" class=${t.saving > .005 ? "good" : t.saving < -.005 ? "bad" : ""}
                  >${W(e, t.saving, this.currency, !0)}</span
                >`)}
          </div>` : h`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
	renderReset(e) {
		let t = !!this.state?.observe?.active;
		return h`<section class="card danger wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${P(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${P(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${["all", ...rn].map((t) => h`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${!t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? _ : h`<p>${e("learn.reset.off")}</p>`}
      ${this.notice ? h`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : _}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, n = this.scope;
		return h`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${S(e("learn.reset.confirm.title"), "h2", P(e, "learn_reset"))}</div>
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
D([y({ attribute: !1 })], X.prototype, "hass", void 0), D([y({ attribute: !1 })], X.prototype, "t", void 0), D([y({ attribute: !1 })], X.prototype, "state", void 0), D([b()], X.prototype, "data", void 0), D([b()], X.prototype, "failed", void 0), D([b()], X.prototype, "confirming", void 0), D([b()], X.prototype, "resetting", void 0), D([b()], X.prototype, "scope", void 0), D([b()], X.prototype, "keyword", void 0), D([b()], X.prototype, "notice", void 0), T("joe-learn-page", X);
//#endregion
//#region src/components/texts.ts
function Zn(e, t) {
	return t == null ? "–" : M(e.lang, t * 100, 2);
}
function Qn(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: Zn(e, t.night_price),
		day: Zn(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: Zn(e, t.night_price),
		day: Zn(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: Zn(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: Zn(e, t.feed_in_price) })}`), r;
}
function $n(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = M(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = M(e.lang, Math.abs(t.expected), 1), n.actual = M(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/components/review.ts
var er = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), tr = class extends v {
	constructor(...e) {
		super(...e), this.checks = [], this.context = "setup";
	}
	static {
		this.styles = [E, o`
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
		return !e || !t || !n ? _ : h`<ul class="found">
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
			chips: [w(t, { source: "read" })]
		}), i.push(...this.batteryRows(e, t, n)), i.push(this.tariffRow(t, n)), i.push(this.forecastRow(t, n)), i.push(this.powerRow(e, t, n, "grid_power")), i.push(this.powerRow(e, t, n, "home_power")), i.push(this.solarRow(e, t, n));
		for (let e of r?.wallboxes.filter((e) => e.is_car) ?? []) i.push({
			key: `wallbox:${e.name}`,
			icon: "mdi:ev-station",
			title: t("find.wallbox"),
			detail: `${e.name} · ${t("review.wallbox.later")}`,
			chips: [h`<span class="chip soon">${t("review.later")}</span>`]
		});
		for (let n of r?.cars ?? []) {
			let r = n.entities.soc ? j(e, n.entities.soc) : null, a = [
				n.name,
				r === null ? null : `${M(t.lang, r, 0)} %`,
				n.range_km === null ? null : `${M(t.lang, n.range_km, 0)} km`,
				t("review.car.later")
			];
			i.push({
				key: `car:${n.device_id}`,
				icon: "mdi:car-electric",
				title: t("find.car"),
				detail: a.filter(Boolean).join(" · "),
				chips: [C(t, n.confidence), h`<span class="chip soon">${t("review.later")}</span>`]
			});
		}
		i.push(this.contextRow(e, t, n, "weather")), i.push(this.contextRow(e, t, n, "holiday"));
		let o = this.context === "settings", s = [h`<span class="chip soon">${t("review.ask_later")}</span>`];
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
				heating: c.filter((e) => er.has(e.kind)).length
			}),
			chips: o ? [] : s,
			tip: o ? "f_consumer_kind" : void 0,
			actions: o ? [this.button(t("review.assign"), "mdi:devices", () => this.edit("consumers"))] : void 0
		}), i;
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let i of n.batteries) {
			let a = this.discovery?.batteries.find((e) => e.id === i.id), o = j(e, i.soc_entity), s = i.capacity_kwh ?? xt(e, i.capacity_entity), c = [
				s ? `${M(t.lang, s, 2)} kWh` : t("review.capacity_unknown"),
				o === null ? null : `${M(t.lang, o, 0)} %`,
				i.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], l = this.checks.filter((e) => e.battery_id === i.id).map((e) => this.note(t, e));
			r.push({
				key: `battery:${i.id}`,
				icon: "mdi:home-battery-outline",
				title: i.name,
				detail: c.filter(Boolean).join(" · "),
				chips: [w(t, I(n, `batteries[${i.id}].soc_entity`)), ...a ? [C(t, a.confidence)] : []],
				reasons: a?.reasons,
				notes: l,
				state: this.checks.some((e) => e.battery_id === i.id && e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [this.button(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", i.id)), this.button(t("review.ignore"), "", () => this.ignoreBattery(i.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) L(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
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
		z(this, {
			batteries: { [e]: null },
			answers: { ignored: R(this.config, `battery:${e}`, !0) }
		});
	}
	useBattery(e) {
		let t = this.config;
		z(this, {
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
			answers: { ignored: R(t, `battery:${e.id}`, !1) }
		}, "read");
	}
	async addBattery() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return;
		let r = (await B(this, {
			heading: e("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [],
			exclude: n.batteries.map((e) => e.soc_entity)
		}))?.selected[0];
		if (!r) return;
		let i = t.entities?.[r]?.device_id, a = i && !n.batteries.some((e) => e.id === i) ? i : r;
		z(this, { batteries: { [a]: {
			name: i && (t.devices?.[i]?.name_by_user || t.devices?.[i]?.name) || A(t, r),
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
			detail: Qn(e, n),
			chips: r ? [] : [w(e, I(t, "tariff.kind")), ...this.discovery && this.discovery.tariff.kind !== "unknown" ? [C(e, this.discovery.tariff.confidence)] : []],
			reasons: this.discovery?.tariff.reasons,
			notes: r ? [this.info(e("review.tariff.ask"))] : [],
			state: r ? "missing" : void 0,
			tip: "review_tariff",
			actions: [this.button(e(r ? "review.enter" : "review.change"), "mdi:pencil-outline", () => this.edit("tariff"))]
		};
	}
	forecastRow(e, t) {
		let n = this.discovery?.forecast, r = L(t, "forecast"), i = {
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
				today: n.today_kwh == null ? "–" : M(e.lang, n.today_kwh, 1),
				tomorrow: n.tomorrow_kwh == null ? "–" : M(e.lang, n.tomorrow_kwh, 1)
			}) : t.forecast.provider,
			chips: [w(e, I(t, "forecast.provider")), ...n ? [C(e, n.confidence)] : []],
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
		z(this, {
			forecast: {
				provider: null,
				config_entries: [],
				today: [],
				tomorrow: [],
				remaining_today: [],
				alternatives: []
			},
			answers: { ignored: R(this.config, "forecast", !0) }
		});
	}
	useForecast() {
		let e = this.discovery?.forecast;
		e && z(this, {
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
			answers: { ignored: R(this.config, "forecast", !1) }
		}, "read");
	}
	powerRow(e, t, n, r) {
		let i = n.measurements[r], a = this.discovery?.measurements[r] ?? null, o = r === "grid_power", s = L(n, r), c = {
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
		let u = bt(e, i), d = N(e, i.entity_id, t.lang);
		if (u !== null) {
			let e = M(t.lang, Math.abs(u), 2);
			d = o ? t(u >= 0 ? "live.import" : "live.export", { value: e }) : t("live.kw", { value: M(t.lang, u, 2) });
		}
		let f = this.checks.filter((e) => e.code !== "missing" && (e.role === r || o && e.code === "grid_sign" || !o && e.code === "home_negative")), p = f.map((e) => e.code === "grid_sign" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		})), this.button(t("review.keep"), "mdi:check", () => this.confirm(`grid_sign:${i.entity_id}`), !0)]) : e.code === "home_negative" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		}))]) : this.note(t, e)), m = a?.entity.entity_id === i.entity_id;
		return !o && n.measurements.grid_power ? {
			...c,
			detail: `${t("review.home.balance")} · ${t("review.home.compare", {
				name: A(e, i.entity_id),
				live: d
			})}`,
			chips: [w(t, I(n, `measurements.${r}`))],
			notes: [...this.homeNotes(t, n), ...p],
			state: f.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))]
		} : {
			...c,
			detail: `${A(e, i.entity_id)} · ${d}`,
			chips: [w(t, I(n, `measurements.${r}`)), ...a && m ? [C(t, a.confidence)] : []],
			reasons: m ? a?.reasons : void 0,
			notes: p,
			state: f.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l]
		};
	}
	homeNotes(e, t) {
		let n = [], r = nn(t.consumers);
		if (r.length) {
			let t = r.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
			n.push(this.info(e(r.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
		} else t.consumers.some((e) => e.kind !== "submeter") && n.push(this.info(e("review.home.flexible_none")));
		let i = t.learned.home_check;
		if (i && i.calc_kwh > 0) {
			let t = (i.sensor_kwh - i.calc_kwh) / i.calc_kwh;
			Math.abs(t) >= .1 && n.push(this.info(e("review.home.off", {
				days: i.days,
				pct: M(e.lang, Math.abs(t) * 100, 0),
				direction: e(t < 0 ? "review.home.less" : "review.home.more")
			})));
		}
		return n;
	}
	async pickPower(e) {
		let { t, config: n } = this;
		if (!t || !n) return;
		let r = n.measurements[e], i = this.discovery?.measurements[e], a = e === "grid_power", o = await B(this, {
			heading: t(a ? "pick.grid.title" : "pick.home.title"),
			tip: a ? "pick_grid" : "pick_home",
			filter: "power",
			selected: r ? [r.entity_id] : [],
			suggestions: Lt(i ? [Rt(i)] : [], i?.alternatives),
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
		L(n, e) && (c.answers = { ignored: R(n, e, !1) }), z(this, c);
	}
	setPower(e, t) {
		z(this, { measurements: { [e]: t } });
	}
	solarRow(e, t, n) {
		let r = n.measurements.solar_power, i = this.discovery?.measurements.solar_power ?? null, a = {
			key: "solar_power",
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			tip: "review_solar"
		};
		if (!r.length) return L(n, "solar_power") ? {
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
		let o = St(e, r), s = this.checks.filter((e) => e.role === "solar_power" && e.code !== "missing").map((e) => this.note(t, e));
		return {
			...a,
			detail: t("find.solar.detail", {
				count: this.count(t, r.length, "word.sensor"),
				total: o === null ? "–" : M(t.lang, o, 2)
			}),
			chips: [w(t, I(n, "measurements.solar_power")), ...i ? [C(t, i.confidence)] : []],
			reasons: i?.reasons,
			notes: s,
			state: s.length && this.checks.some((e) => e.role === "solar_power" && e.level === "warn") ? "flag" : void 0,
			actions: [this.button(t("review.change"), "mdi:magnify", () => this.pickSolar())]
		};
	}
	async pickSolar() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = t.measurements.solar_power, r = this.discovery?.measurements.solar_power, i = await B(this, {
			heading: e("pick.solar.title"),
			tip: "pick_solar",
			filter: "power",
			multiple: !0,
			selected: n.map((e) => e.entity_id),
			suggestions: Lt((r?.entities ?? []).map((e) => ({
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
		L(t, "solar_power") && (a.answers = { ignored: R(t, "solar_power", !1) }), z(this, a);
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
				detail: A(e, a),
				chips: [w(t, I(n, `context.${i}`)), ...o && l ? [C(t, o.confidence)] : []],
				reasons: l ? o?.reasons : void 0,
				actions: [this.button(t("review.change"), "mdi:magnify", c), this.button(t("review.ignore"), "", () => this.ignore(r, { context: { [i]: null } }), !0)]
			};
		}
		return L(n, r) ? {
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
		let r = e === "weather" ? "weather_entity" : "holiday_entity", i = this.discovery?.[e], a = n.context[r], o = (await B(this, {
			heading: t(e === "weather" ? "pick.weather.title" : "pick.holiday.title"),
			tip: e === "weather" ? "pick_weather" : "pick_holiday",
			filter: e === "weather" ? "weather" : "workday",
			selected: a ? [a] : i ? [i.entity.entity_id] : [],
			suggestions: Lt(i ? [Rt(i)] : [], i?.alternatives)
		}))?.selected[0];
		o && z(this, {
			context: { [r]: o },
			answers: { ignored: R(n, e, !1) }
		});
	}
	ignore(e, t) {
		z(this, {
			...t,
			answers: { ignored: R(this.config, e, !0) }
		});
	}
	confirm(e) {
		let t = this.config.answers.confirmed.filter((t) => t !== e);
		z(this, { answers: { confirmed: [...t, e] } });
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
		return h`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
      ${t ? h`<ha-icon icon=${t}></ha-icon>` : _}${e}
    </button>`;
	}
	info(e) {
		return h`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
	}
	note(e, t, n = []) {
		return h`<div class="note ${t.level}">
      <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <div>
        <span>${$n(e, t)}</span>
        ${n.length ? h`<div class="note-actions">${n}</div>` : _}
      </div>
    </div>`;
	}
	count(e, t, n) {
		let [r, i] = e(n).split("|");
		return `${M(e.lang, t, 0)} ${t === 1 ? r : i}`;
	}
	renderRow(e, t) {
		return h`<li class="item ${t.state ?? ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
      <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
      <div class="text">
        <div class="head">
          <span class="t">${t.title}</span>
          ${t.chips?.length ? h`<span class="chips">${t.chips}</span>` : _}
        </div>
        <div class="d">${t.detail}</div>
        ${t.reasons?.length ? h`<details data-notip>
              <summary>${e("scan.why")}</summary>
              <ul>
                ${t.reasons.map((t) => h`<li>${ct(e, t)}</li>`)}
              </ul>
            </details>` : _}
        ${t.notes ?? _}
        ${t.actions?.length ? h`<div class="row-actions">${t.actions}${t.tip ? P(e, t.tip) : _}</div>` : _}
      </div>
    </li>`;
	}
};
D([y({ attribute: !1 })], tr.prototype, "hass", void 0), D([y({ attribute: !1 })], tr.prototype, "t", void 0), D([y({ attribute: !1 })], tr.prototype, "config", void 0), D([y({ attribute: !1 })], tr.prototype, "discovery", void 0), D([y({ attribute: !1 })], tr.prototype, "checks", void 0), D([y()], tr.prototype, "context", void 0), T("joe-review", tr);
//#endregion
//#region src/components/step-nav.ts
function nr(e, t, n = !1) {
	let r = h`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return h`<nav class="step-nav ${n ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? h`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : h`<span></span>`}
    ${t.nextTip ? h`<span class="with-tip" data-tipped>${r} ${P(e, t.nextTip)}</span>` : r}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var rr = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, ir = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function ar(e) {
	let t = [], n = (t) => I(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var or = class extends v {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [E, o`
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
		if (!e || !t) return _;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = ar(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1;
		return h`${nr(e, {
			back: () => this.move(-1, n.length),
			next: () => this.move(1, n.length),
			nextLabel: e(a ? "ask.finish" : "onb.next")
		})}
      <div class="wrap">
        <joe-pose name=${rr[i.split(":")[0]] ?? "ask"}></joe-pose>
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
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", h`<joe-tariff-form
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
			default: return this.question(e("q.household.title"), "q_household", h`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, t, n) {
		let r = this.t;
		return h`<div data-tipped>
      <div class="title-row">${S(e, "h2", P(r, t))}</div>
      ${x}
      <div class="content">${n}</div>
    </div>`;
	}
	choice(e, t, n, r = !1) {
		let i = this.config?.answers[t];
		return h`<joe-choice
      .options=${n}
      .value=${Array.isArray(i) ? i : typeof i == "string" ? [i] : []}
      ?multiple=${r}
      .exclusive=${["none"]}
      idk=${e("ask.idk")}
      @joe-choice=${(e) => z(this, { answers: { [t]: r ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHotWater(e, t) {
		let n = t.answers.hot_water, r = n === "hot_water_heat_pump" || n === "electric", i = t.consumers.filter((e) => e.kind === "hot_water"), a = t.actions.find((e) => e.kind === "target");
		return this.question(e("q.hot_water.title"), "q_hot_water", h`${this.choice(e, "hot_water", [
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
      ${r ? h`<div class="follow">
            <p class="hint">${i.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${i.length ? h`<div class="chips">${i.map((e) => h`<span class="chip learned">${e.name}</span>`)}</div>` : _}
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
              ${P(e, "q_hot_water_action")}
            </div>
          </div>` : _}`);
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => ir.includes(e));
		return this.question(e("q.heating.title"), "q_heating", h`${this.choice(e, "heating", [
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
        ${a && t.consumers.length ? h`<div class="follow">
              <p class="hint">${i.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${i.length ? h`<div class="chips">
                    ${i.map((e) => h`<span class="chip learned">${e.name}</span>`)}
                  </div>` : _}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${P(e, "f_consumer_kind")}
              </div>
            </div>` : _}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === hn;
		return this.question(e("q.feed_in.title"), "q_feed_in", h`<div class="inline">
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
			z(this, {
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
          @click=${() => z(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => z(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: hn }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return h``;
		let i = `capacity:${n}`, a = t.answers[i] === hn;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", h`<div class="inline">
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
			z(this, {
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
          @click=${() => z(this, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: hn }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), z(this, t);
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
D([y({ attribute: !1 })], or.prototype, "hass", void 0), D([y({ attribute: !1 })], or.prototype, "t", void 0), D([y({ attribute: !1 })], or.prototype, "config", void 0), D([y({ attribute: !1 })], or.prototype, "discovery", void 0), D([y()], or.prototype, "single", void 0), D([b()], or.prototype, "index", void 0), T("joe-questions", or);
//#endregion
//#region src/pages/onboarding.ts
function sr(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${M(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
var cr = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, Z = class extends v {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [E, o`
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
		if (!e) return _;
		switch (this.step) {
			case "welcome": return this.layout("welcome", h`${S(e("onb.welcome.title"), "h1")} ${x}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => h`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${P(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return h`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		return this.discovering || !this.discovery && !this.discoveryFailed ? this.layout("scout", h`${S(e("onb.scan.title"))} ${x}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`) : h`${nr(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0)}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${S(e("scan.title"))} ${x}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? h`<p class="failed">${e("scan.failed")}</p>` : _}
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
              ${P(e, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(e) {
		return h`${nr(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		})}
    ${this.layout("thumbs", h`${S(e("onb.done.title"))} ${x}
        ${this.config ? this.renderSummary(e, this.config) : _}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${e("onb.done.go")}</button>
            ${P(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(e, t) {
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? xt(n, t.capacity_entity) : null) ?? 0), 0), i = (n, r) => {
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, a = this.discovery?.forecast;
		return h`<div class="lines">
      ${[
			[e("sum.batteries"), t.batteries.length ? e("sum.batteries.value", {
				count: t.batteries.length,
				kwh: r ? M(e.lang, r, 1) : "?"
			}) : e("sum.none")],
			[e("sum.tariff"), t.tariff.kind === "unknown" ? e("sum.unknown") : Qn(e, t.tariff, !1)],
			[e("sum.feed_in"), t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : e("sum.unknown") : `${Zn(e, t.tariff.feed_in_price)} ct`],
			[e("sum.forecast"), t.forecast.provider ? a ? e("sum.forecast.value", {
				provider: a.provider_name,
				planes: sr(e, a.planes, "word.plane")
			}) : t.forecast.provider : e("sum.none")],
			[e("sum.heating"), i("heating", cr)],
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
				persons: sr(e, t.persons.length, "word.person"),
				calendars: sr(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
			})]
		].map(([e, t]) => h`<div><span>${e}</span><span>${t}</span></div>`)}
    </div>`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(e, t) {
		return h`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return h`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			[t.sources.grid ?? 0, e("energy.grid")],
			[t.sources.solar ?? 0, e("energy.solar")],
			[t.sources.battery ?? 0, e("energy.battery")],
			[t.devices ?? 0, e("energy.devices")]
		];
		return h`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map(([e, t]) => h`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e} ${t}</span>`)}
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
D([y()], Z.prototype, "step", void 0), D([y({ attribute: !1 })], Z.prototype, "t", void 0), D([y({ attribute: !1 })], Z.prototype, "info", void 0), D([y({ attribute: !1 })], Z.prototype, "hass", void 0), D([y({ attribute: !1 })], Z.prototype, "config", void 0), D([y({ attribute: !1 })], Z.prototype, "discovery", void 0), D([y({ attribute: !1 })], Z.prototype, "checks", void 0), D([y({ type: Boolean })], Z.prototype, "discovering", void 0), D([y({ type: Boolean })], Z.prototype, "discoveryFailed", void 0), T("joe-onboarding", Z);
//#endregion
//#region src/pages/overview.ts
var lr = class extends v {
	constructor(...e) {
		super(...e), this.prefix = "/energy-joe";
	}
	static {
		this.styles = [E, o`
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
          width: 120px;
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
		if (!e) return _;
		let t = !!this.state?.observe?.active, n = !!(this.state?.plan && this.state.plan.kind !== "unavailable"), r = (this.state?.results?.days ?? 0) > 0, i = this.state?.questions ?? [];
		return h`<div class="grid">
      ${i.length ? h`<joe-day-questions class="wide" .hass=${this.hass} .t=${e} .questions=${i}></joe-day-questions>` : _}
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
		return t ? h`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("status.running")}</span>` : h`<span class="chip">${e(this.state?.mode === "off" ? "status.paused" : "status.waiting")}</span>`;
	}
	renderNight(e) {
		let t = this.state?.plan;
		if (!t) return h`<section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${S(e("overview.night.empty.title"))} ${x}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let n = An(e, t), r = jn(e, t, this.hass?.config?.currency), i = t.kind === "charge" || t.kind === "hold" ? h`${M(e.lang, t.target ?? 0, 0)}<small>%</small>` : h`${e(t.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return h`<section class="card figure-card" data-tipped>
      <joe-pose name=${En(t)}></joe-pose>
      <div class="head">
        <div class="eyebrow">
          <ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}${t.window ? ` · ${On(e, t)}` : ""}
        </div>
        ${P(e, "plan_target")}
      </div>
      <div class="big">${i}</div>
      ${x}
      <p class="say">${kn(e, t)}</p>
      ${n.length ? h`<div class="lines">${n.map((e) => h`<div>${e}</div>`)}</div>` : _}
      ${r ? h`<p class="cost">${r}</p>` : _}
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
		if (!t || !n) return h`<section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")}</div>
        ${S(e("overview.sim.empty.title"))} ${x}
        <p class="lead">${e("overview.sim.empty.text")}</p>
      </section>`;
		let r = this.hass?.config?.currency, i = n.window?.end.slice(0, 10) ?? n.date, a = i === Cn(this.hass?.config?.time_zone) ? e("overview.sim.last") : e("overview.sim.night", { day: K(e.lang, i, "weekday") }), o = n.saving, s = o > .005 ? "good" : o < -.005 ? "bad" : "", c = s === "good" ? e("overview.sim.saved", {
			value: W(e, o, r),
			day: M(e.lang, Math.max(0, n.day_kwh_without - n.day_kwh), 1),
			night: M(e.lang, Math.max(0, n.night_kwh - n.night_kwh_without), 1)
		}) : s === "bad" ? e("overview.sim.cost", { value: W(e, -o, r) }) : e("overview.sim.same"), l = t.since ?? t.first;
		return h`<section class="card figure-card" data-tipped>
      <joe-pose name=${s === "good" ? "relax" : "inspect"}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")} · ${a}</div>
        ${P(e, "sim_result")}
      </div>
      <div class="big ${s}">${W(e, o, r, !0)}</div>
      ${x}
      <p class="say">${c}</p>
      <p class="cost">
        ${e("overview.sim.total", {
			since: l ? K(e.lang, l) : "–",
			value: W(e, t.saving, r, !0),
			nights: wn(e, t.days)
		})}
      </p>
      <div class="bottom">
        ${n.final || !n.until ? h`<span class="chip">
              ${e("learn.results.split", {
			better: t.better,
			worse: t.worse,
			same: Math.max(0, t.days - t.better - t.worse)
		})}
            </span>` : h`<span class="chip warn">${e("overview.sim.provisional", { time: n.until.slice(11, 16) })}</span>`}
        <a class="btn btn-secondary" data-notip href=${`${this.prefix}/learn`} @click=${(e) => this.open(e, "learn")}
          >${e("overview.sim.more")}</a
        >
      </div>
    </section>`;
	}
	renderNow(e) {
		let t = this.hass, n = this.state?.config;
		if (!t || !n) return h``;
		let r = n.measurements, i = r.solar_power.length ? St(t, r.solar_power) : null, a = bt(t, r.grid_power), o = n.batteries.map((e) => ({
			power: bt(t, e.power),
			soc: j(t, e.soc_entity)
		})), s = o.filter((e) => e.power != null), c = s.length ? s.reduce((e, t) => e + (t.power ?? 0), 0) : null, l = bt(t, r.home_power), u = l == null && a != null;
		u && (l = (a ?? 0) + (i ?? 0) - (c ?? 0));
		let d = o.map((e) => e.soc).filter((e) => e != null), f = (t) => t == null ? "–" : M(e.lang, Math.abs(t), 2), p = (e, t, n, r, i) => h`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${f(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, m = (e) => e == null || Math.abs(e) < .05;
		return h`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("overview.now")}</div>
        ${P(e, "now")}
      </div>
      <div class="now">
        ${p("sun", "mdi:solar-power", e("overview.now.solar"), i, e(i == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${p("home", "mdi:home-lightning-bolt-outline", e("overview.now.home"), l, e(l == null ? "overview.now.none" : u ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${p("battery", "mdi:home-battery-outline", m(c) ? e("overview.now.battery") : e(c > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), c, d.length ? d.length === 1 ? e("overview.now.soc", { value: M(e.lang, d[0], 0) }) : e("overview.now.soc_avg", {
			value: M(e.lang, d.reduce((e, t) => e + t, 0) / d.length, 0),
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
		return h`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${P(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? h`<joe-chart
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
                ${i.map((e) => h`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
              </div>
              <a class="btn btn-secondary" data-notip href=${this.historyHref()} @click=${this.openHistory}
                >${e("overview.week.more")}</a
              >
            </div>` : _}
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
D([y({ attribute: !1 })], lr.prototype, "t", void 0), D([y({ attribute: !1 })], lr.prototype, "hass", void 0), D([y({ attribute: !1 })], lr.prototype, "state", void 0), D([y()], lr.prototype, "prefix", void 0), D([b()], lr.prototype, "week", void 0), T("joe-overview", lr);
//#endregion
//#region src/pages/plan.ts
var ur = 36e5, dr = class extends v {
	constructor(...e) {
		super(...e), this.refreshing = !1;
	}
	static {
		this.styles = [E, o`
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
		if (!e) return _;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let n = An(e, t), r = jn(e, t, this.hass?.config?.currency);
		return h`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${On(e, t)}</div>
      ${S(e("plan.page.title"))} ${x}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? h`<span class="pill-sim">${e("mode.simulation")}</span>` : h`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${P(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${En(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : h`${M(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${kn(e, t)} ${P(e, "plan_target")}</p>
        ${n.length ? h`<div class="lines">${n.map((e) => h`<div>${e}</div>`)}</div>` : _}
        ${r ? h`<p class="cost">${r}</p>` : _}
      </section>
      ${this.renderSteer(e, t)} ${this.renderActions(e, t)} ${this.renderEnergy(e, t, t.hours)}
      ${this.renderPrices(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)}
      ${this.renderMath(e, t)}
    </div>`;
	}
	renderSteer(e, t) {
		let n = this.state, r = n?.control;
		if (!n || !r || !["advisory", "live"].includes(n.mode) || !t.window || t.kind === "none") return _;
		let i = t.window.start, a = r.skip === i, o = r.answer?.night === i ? r.answer.yes : null, s = n.config.batteries.filter((e) => e.adapter !== "none" && r.ready[e.id] && r.ready[e.id] !== "ready"), c, l;
		return n.mode === "advisory" && !a ? (c = e(o === !0 ? "plan.steer.answered_yes" : o === !1 ? "plan.steer.answered_no" : "plan.steer.advisory"), l = h`${o === !0 ? _ : h`<button type="button" class="btn btn-primary" @click=${() => this.answer(i, !0)}>${e("plan.steer.yes")}</button>`}
      ${o === !1 ? _ : h`<button type="button" class="btn btn-secondary" @click=${() => this.answer(i, !1)}>${e("plan.steer.no")}</button>`}`) : (c = e(a ? "plan.steer.skipped" : "plan.steer.live"), l = h`<button type="button" class="btn btn-secondary" @click=${() => this.skip(!a)}>
        ${e(a ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`), h`<section class="chart-card steer" data-tipped>
      <div class="chart-head">${c} ${P(e, "plan_steer")}</div>
      ${s.length ? h`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("plan.steer.untested", { names: s.map((e) => e.name).join(", ") })}</span>
          </div>` : _}
      <div class="actions">${l}</div>
    </section>`;
	}
	renderActions(e, t) {
		let n = t.actions ?? [];
		if (!n.length) return _;
		let r = this.hass?.config?.currency ?? "EUR", i = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: r
		}).format(t);
		return h`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.actions")} ${P(e, "plan_actions")}</div>
      <dl>
        ${n.map((n) => {
			let r = n.target == null ? "" : M(e.lang, n.target, 0), a = n.run ? n.kind === "target" ? e("plan.actions.target", {
				start: q(n.start),
				end: q(n.end),
				target: r
			}) : e("plan.actions.run", {
				start: q(n.start),
				end: q(n.end)
			}) : e.optional(`devices.action.why.${n.reasons[n.reasons.length - 1] ?? "manual_only"}`, {
				kwh: M(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
				temperature: M(e.lang, n.temperature ?? 0, 0)
			}) ?? "", o = n.run && n.energy_kwh ? e("plan.actions.energy", {
				kwh: M(e.lang, n.energy_kwh, 1),
				cost: i(n.cost ?? 0)
			}) : "", s = this.state?.config.actions.find((e) => e.id === n.id);
			return h`<dt>${n.name}</dt>
            <dd>
              ${a}${o ? h`<small>${o}</small>` : _}
              ${n.need ? h`<joe-car-need .hass=${this.hass} .t=${e} .action=${n} .roundTrip=${s?.need?.round_trip ?? !0}></joe-car-need>` : _}
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
		let n = t ? kn(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return h`<div class="empty">
      <joe-pose name=${t ? En(t) : "plan"}></joe-pose>
      <div>
        ${S(e("plan.title"))} ${x}
        <p class="lead">${n}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${q(e.start)}–${q(n[t + 1]?.start) || r(q(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = q(t.start);
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
					if (t >= r && t < r + ur) return e + (t - r) / ur;
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
			let n = q(t.sun_takes_over);
			a.push({
				at: o,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return h`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${P(e, "chart_plan_energy")}</div>
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
        ${i.map((e) => h`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, n) {
		if (!n.some((e) => e.price != null)) return _;
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
				label: e("plan.chart.charge_at", { time: q(t.start) }),
				short: q(t.start)
			}];
		});
		return h`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${P(e, "chart_plan_prices")}</div>
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
      ${t.charge_slots?.length ? h`<p class="slots">${e("plan.slots", { slots: Dn(t) })}</p>` : _}
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
				label: e("plan.chart.reserve", { value: M(e.lang, i, 0) }),
				kind: "line",
				values: n.map(() => i),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], o = [], s = r.at(t.window?.end);
		s != null && t.kind !== "none" && o.push({
			at: s,
			label: e("plan.chart.target", { value: M(e.lang, t.target ?? 0, 0) })
		});
		let c = r.at(t.full_at);
		return c != null && o.push({
			at: c,
			label: e("plan.chart.full", { time: q(t.full_at) }),
			short: `${q(t.full_at)}`
		}), h`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${P(e, "chart_plan_soc")}</div>
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
        ${a.map((e) => h`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let n = (t, n = 1) => t == null ? "–" : `${M(e.lang, t, n)} kWh`, r = (t) => t == null ? "–" : `${M(e.lang, t * 100, 1)} ct`, i = t.window?.start.slice(0, 10) ?? "", a = t.meta?.solar.sources[i] ?? "none", o = t.meta?.tomorrow, s = o?.solar_factor ?? t.meta?.solar_factor ?? 1, c = t.meta?.consumption, l = this.state?.config.persons ?? [], u = [
			[e("plan.math.battery_now"), h`${M(e.lang, t.soc_now ?? 0, 0)} %<small
            >${e("plan.math.battery_now.sub", {
				stored: M(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
				capacity: M(e.lang, t.capacity_kwh ?? 0, 1)
			})}</small
          >`],
			[e("plan.math.battery_start"), `${M(e.lang, t.soc_start ?? 0, 0)} %`],
			[e("plan.math.solar"), h`${n(t.solar_kwh)}<small
            >${e(`plan.math.solar.${a}`)}${s === 1 ? "" : ` · ${e(o?.solar_source === "combined" ? "plan.math.solar.combined" : o?.solar_source === "weather" && o.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
				value: M(e.lang, s, 2),
				weather: o?.weather ? e(`learn.weather.${o.weather}`) : ""
			})}`}</small
          >`],
			[e("plan.math.home"), h`${n(t.home_kwh)}<small
            >${c?.source === "history" ? e("plan.math.home.history", {
				days: c.days,
				kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
			}) : e("plan.math.home.default")}</small
          >`],
			...o && (o.temp != null || Object.keys(o.labels).length) ? [[e("plan.math.tomorrow"), h`${[o.temp == null ? "" : `${M(e.lang, o.temp, 0)} °C`, ...Object.entries(o.labels).map(([t, n]) => e("plan.math.tomorrow.person", {
				name: l.find((e) => e.id === t)?.name ?? t,
				label: e(`label.${n}`)
			}))].filter(Boolean).join(" · ")}<small
                  >${o.expected_kwh == null ? e("plan.math.tomorrow.usual") : e("plan.math.tomorrow.scaled", {
				expected: M(e.lang, o.expected_kwh, 1),
				usual: M(e.lang, o.profile_kwh, 1)
			})}</small
                >`]] : [],
			[e("plan.math.target"), h`${M(e.lang, t.target ?? 0, 0)} %<small
            >${e("plan.math.target.sub", {
				optimum: M(e.lang, t.optimum ?? 0, 0),
				buffer: M(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
			})}</small
          >`],
			[e("plan.math.prices"), h`${e("plan.math.prices.value", {
				night: r(t.prices?.night),
				day: r(t.prices?.day),
				feed: r(t.prices?.feed_in)
			})}${t.prices?.assumed ? h`<small>${e("plan.math.prices.assumed")}</small>` : _}`],
			[e("plan.math.rules"), e("plan.math.rules.value", {
				reserve: M(e.lang, t.rules?.reserve ?? 0, 0),
				max: M(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			})]
		], d = [...new Set(t.notes ?? [])].map((t) => e.optional(`plan.note.${t}`)).filter(Boolean);
		return h`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${P(e, "plan_math")}</div>
      <dl>${u.map(([e, t]) => h`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      ${d.map((e) => h`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`)}
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
D([y({ attribute: !1 })], dr.prototype, "hass", void 0), D([y({ attribute: !1 })], dr.prototype, "t", void 0), D([y({ attribute: !1 })], dr.prototype, "state", void 0), D([b()], dr.prototype, "refreshing", void 0), T("joe-plan-page", dr);
//#endregion
//#region src/pages/settings.ts
var fr = [
	"simulation",
	"advisory",
	"live",
	"off"
], pr = [
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
], mr = [{
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
}], hr = {
	key: "balance_days",
	unit: "",
	min: 3,
	max: 90,
	step: 1,
	optional: !0,
	integer: !0
}, gr = [
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
], _r = {
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
}, Q = class extends v {
	constructor(...e) {
		super(...e), this.checks = [], this.pro = !1, this.question = "";
	}
	static {
		this.styles = [E, o`
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
		if (!e || !t) return _;
		let n = t.config;
		return h`<div class="list">
        <section class="group">
          <h2>${e("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.mode")}</b>${P(e, "mode")}</div>
              <small>${e("settings.mode.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("settings.mode")}>
              ${fr.map((n) => h`<button
                    type="button"
                    aria-pressed=${String(t.mode === n)}
                    @click=${() => this.emit("joe-set-mode", { mode: n })}
                  >
                    ${e(`mode.${n}`)}
                  </button>`)}
            </div>
          </div>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.setup")}</b>${P(e, "restart")}</div>
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
          ${gr.map((t) => this.answerRow(e, t.key, t.tip))}
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
          ${this.pro ? h`<p class="intro">${e("settings.pro.intro")}</p>
                ${pr.slice(0, 5).map((t) => this.numberRow(e, n.rules, t))}
                ${mr.map((t) => this.numberRow(e, n.rules, t))} ${this.guardRow(e, n.rules)}
                ${this.numberRow(e, n.rules, hr)}
                ${this.priorityRow(e, n.rules)} ${this.dischargeRow(e, n.rules)}
                ${pr.slice(5).map((t) => this.numberRow(e, n.rules, t))}` : _}
        </section>

        <section class="group">
          <h2>${e("settings.about")}</h2>
          <div class="row"><b>${e("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.energy")}</b><span class="value">${this.energyText(e)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(e) : _}`;
	}
	renderRouting(e) {
		let t = this.state.config.routing, n = this.info?.routing, r = t.service === "google" ? `google:${t.google_entry ?? ""}` : t.service ?? "", i = (e) => {
			e.startsWith("google:") ? z(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : z(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, a = (n) => h`<div class="row" data-tipped>
      <div>
        <div class="name"><label for="routing-${n}"><b>${e(`settings.routing.${n}`)}</b></label>${P(e, "routing_osm")}</div>
        <small>${e(`settings.routing.${n}.hint`)}</small>
      </div>
      <input
        id="routing-${n}"
        class="input"
        type="url"
        .value=${t[n]}
        @change=${(e) => {
			let t = e.target.value.trim();
			t.startsWith("http") && z(this, { routing: { [n]: t } });
		}}
      />
    </div>`;
		return h`<section class="group">
      <h2>${e("settings.routing")}</h2>
      <p class="intro">${e("settings.routing.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="routing-service"><b>${e("settings.routing.service")}</b></label>${P(e, "routing_service")}</div>
          <small>${e("settings.routing.service.hint")}</small>
        </div>
        <select id="routing-service" class="input" @change=${(e) => i(e.target.value)}>
          <option value="" ?selected=${r === ""}>${e("settings.routing.none")}</option>
          ${n?.waze === !1 ? _ : h`<option value="waze" ?selected=${r === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(n?.google ?? []).map((t) => h`<option value=${`google:${t.entry_id}`} ?selected=${r === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${r === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${t.service === "osm" ? h`${a("geocoder_url")} ${a("router_url")}` : _}
    </section>`;
	}
	renderNotify(e) {
		let t = this.state.config, n = t.notify, r = Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort(), i = (t, r) => h`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="notify-${t}">${e(`settings.notify.${t}`)}</b>${P(e, r)}</div>
          <small>${e(`settings.notify.${t}.hint`)}</small>
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n[t])}
          aria-labelledby="notify-${t}"
          ?disabled=${!n.service}
          @click=${() => z(this, { notify: { [t]: !n[t] } })}
        ></button>
      </div>`;
		return h`<section class="group">
      <h2>${e("settings.notify")}</h2>
      <p class="intro">${e("settings.notify.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${P(e, "notify_service")}</div>
          <small>${e("settings.notify.service.hint")}</small>
        </div>
        <select
          id="notify-service"
          class="input"
          @change=${(e) => {
			let t = e.target.value;
			z(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
        >
          <option value="" ?selected=${!n.service}>${e("settings.notify.none")}</option>
          ${r.map((e) => h`<option value=${e} ?selected=${n.service === `notify.${e}`}>${e.replace(/_/g, " ")}</option>`)}
        </select>
      </div>
      ${i("ask", "notify_ask")} ${i("problems", "notify_problems")} ${i("morning", "notify_morning")}
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="ask-time"><b>${e("settings.ask_time")}</b></label>${P(e, "ask_time")}</div>
          <small>${e("settings.ask_time.hint")}</small>
        </div>
        <input
          id="ask-time"
          class="input time"
          type="time"
          .value=${t.rules.ask_time}
          @change=${(e) => {
			let t = e.target.value;
			/^\d{2}:\d{2}$/.test(t) && z(this, { rules: { ask_time: t } });
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
		return c?.state === "running" ? s.push(e("history.reading")) : c?.state === "unavailable" ? s.push(e("settings.observe.no_recorder")) : c?.state === "failed" && s.push(e("settings.observe.failed")), h`<section class="group">
      <h2>${e("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.recording")}</b>${P(e, "observe")}</div>
          <small>${o}</small>
        </div>
        <span class="chip ${r ? "ok" : ""}">
          ${e(r ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${P(e, "rebuild")}</div>
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
		let r = this.state.config, i = r.answers[t], a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [], o = i === "unknown" ? e("sum.unknown") : a.length ? a.map((n) => _r[t][n] ? e(_r[t][n]) : n).join(", ") : e("sum.open");
		return h`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`settings.answer.${t}`)}</b>${P(e, n)}</div>
        <small>${o}</small>
      </div>
      <div class="control">
        ${i == null ? _ : w(e, I(r, `answers.${t}`))}
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
		return h`<joe-sheet label=${e("settings.answers")} closeLabel=${e("common.close")} @joe-close=${t}>
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
		let r = this.state.config, i = t[n.key], a = n.scale ?? 1, o = i == null ? "" : String(Math.round(i * a * 100) / 100), s = this.info?.defaults?.rules[n.key], c = I(r, `rules.${n.key}`), l = c?.source === "user";
		return h`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`rule.${n.key}`)}</b>${P(e, `r_${n.key}`)}</div>
        <small>${e(`rule.${n.key}.hint`)}</small>
      </div>
      <div class="control">
        ${w(e, c)}
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
          <span class="unit">${n.unit || e(`rule.${n.key}.unit`)}</span>
        </span>
        ${l && s !== void 0 ? h`<button
              type="button"
              class="mini-btn quiet"
              @click=${() => z(this, { rules: { [n.key]: s } }, "default")}
            >
              <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
            </button>` : _}
      </div>
    </div>`;
	}
	setNumber(e, t) {
		let n = t.value.trim(), r = e.scale ?? 1;
		if (n === "") {
			e.optional && z(this, { rules: { [e.key]: null } });
			return;
		}
		let i = Number.parseFloat(n);
		if (!Number.isFinite(i) || i < e.min || i > e.max) {
			t.reportValidity();
			return;
		}
		let a = e.integer ? Math.round(i) : Math.round(i / r * 1e4) / 1e4;
		z(this, { rules: { [e.key]: a } });
	}
	guardRow(e, t) {
		let n = this.state.config, r = t.grid_limit_w;
		return h`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="guard-grid">${e("rule.guard_grid")}</b>${P(e, "r_guard_grid")}</div>
        <small>${e(r ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
      </div>
      <div class="control">
        ${w(e, I(n, "rules.guard_grid"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(t.guard_grid)}
          aria-labelledby="guard-grid"
          ?disabled=${!r}
          @click=${() => z(this, { rules: { guard_grid: !t.guard_grid } })}
        ></button>
      </div>
    </div>`;
	}
	priorityRow(e, t) {
		let n = this.state.config, r = t.priority, i = (e, t) => {
			let n = [...r];
			[n[e], n[e + t]] = [n[e + t], n[e]], z(this, { rules: { priority: n } });
		}, a = (e) => h`<svg
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
		return h`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e("rule.priority")}</b>${P(e, "r_priority")}</div>
        <small>${e("rule.priority.hint")}</small>
      </div>
      <div class="control">
        ${w(e, I(n, "rules.priority"))}
        <div class="order">
          ${r.map((t, n) => h`<div>
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
		return h`<div class="row stacked" data-tipped>
      <div>
        <div class="name">
          <b>${e("rule.discharge_in_window")}</b>${P(e, "r_discharge_in_window")}
          ${w(e, I(n, "rules.discharge_in_window"))}
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
			e.detail.value[0] && z(this, { rules: { discharge_in_window: e.detail.value[0] } });
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
D([y({ attribute: !1 })], Q.prototype, "t", void 0), D([y({ attribute: !1 })], Q.prototype, "hass", void 0), D([y({ attribute: !1 })], Q.prototype, "state", void 0), D([y({ attribute: !1 })], Q.prototype, "info", void 0), D([y({ attribute: !1 })], Q.prototype, "discovery", void 0), D([y({ attribute: !1 })], Q.prototype, "checks", void 0), D([b()], Q.prototype, "pro", void 0), D([b()], Q.prototype, "question", void 0), T("joe-settings", Q);
//#endregion
//#region src/styles/tokens.ts
var vr = o`
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
`, yr = [
	"simulation",
	"advisory",
	"live",
	"off"
], br = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, xr = yr, $ = class extends v {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
			this.picker = e.detail;
		}), this.addEventListener("joe-edit", (e) => {
			this.editor = e.detail;
		});
	}
	get t() {
		return at(this.hass?.language);
	}
	get page() {
		let e = (this.route?.path ?? "").split("/")[1] ?? "";
		return an.includes(e) ? e : "overview";
	}
	connectedCallback() {
		super.connectedCallback(), xn(), this.subscribe();
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
		if (this.failed) return h`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return h`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return h`
      <header>
        ${this.joe.mode === "simulation" ? h`<div class="simband" aria-hidden="true"></div>` : _}
        <div class="bar">
          ${this.narrow ? h`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : _}
          <div class="brand">
            <img class="light" src=${et("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${et("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? h`<div class="notice" role="alert">${this.notice}</div>` : _}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-set-mode=${(e) => this.setMode(e.detail.mode)}
        @joe-navigate=${(e) => this.go(e.detail.page)}
      >
        ${t ? h`<joe-onboarding
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
      ${this.modeDialog ? this.renderModeDialog(e) : _} ${this.editor ? this.renderEditor(e) : _}
      ${this.picker ? this.renderPicker(e) : _}
    `;
	}
	renderTabs(e) {
		return h`<nav class="tabs" aria-label=${e("nav.label")}>
      ${an.map((t) => h`<a
            href=${this.href(t)}
            class=${t === this.page ? "on" : ""}
            aria-current=${t === this.page ? "page" : "false"}
            @click=${(e) => this.navigate(e, t)}
            >${e(`tab.${t}`)}</a
          >`)}
    </nav>`;
	}
	renderSteps(e) {
		let t = Zt.indexOf(this.joe?.onboarding.step ?? "welcome");
		return h`<ol class="steps" aria-label=${e("steps.label")}>
      ${Zt.map((n, r) => h`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.page;
		return t === "overview" ? h`<joe-overview
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        prefix=${this.route?.prefix ?? "/energy-joe"}
      ></joe-overview>` : t === "history" ? h`<joe-history .t=${e} .hass=${this.hass} .state=${this.joe}></joe-history>` : t === "plan" ? h`<joe-plan-page .t=${e} .hass=${this.hass} .state=${this.joe}></joe-plan-page>` : t === "learn" ? h`<joe-learn-page .t=${e} .hass=${this.hass} .state=${this.joe}></joe-learn-page>` : t === "devices" ? h`<joe-devices-page
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        .discovery=${this.discovery}
        .info=${this.info}
      ></joe-devices-page>` : t === "settings" ? h`<joe-settings
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        .info=${this.info}
        .discovery=${this.discovery}
        .checks=${this.checks}
      ></joe-settings>` : h``;
	}
	renderModeDialog(e) {
		let t = this.joe?.mode ?? "simulation";
		return h`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${S(e("mode.dialog.title"), "h2", P(e, "mode"))}</div>
          ${x}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${yr.map((n) => {
			let r = xr.includes(n);
			return h`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${br[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? h`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? _ : h`<span class="chip soon">${e("mode.soon")}</span>`}
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
		if (!r.length) return _;
		let i = r.filter((e) => n[e.id] !== "ready");
		return i.length ? h`<div class="note warn readiness"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${i.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: i.map((e) => e.name).join(", ") })}</span></div>` : _;
	}
	renderEditor(e) {
		let t = this.editor, n = this.joe?.config, r = () => {
			this.editor = void 0;
		}, i = h``, a = "", o = !1;
		switch (t?.editor) {
			case "battery":
				a = e("edit.battery.label"), i = h`<joe-battery-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
          .info=${this.info}
          batteryId=${t.id ?? ""}
        ></joe-battery-editor>`;
				break;
			case "tariff":
				a = e("edit.tariff.label"), i = h`<joe-tariff-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
        ></joe-tariff-editor>`;
				break;
			case "household":
				a = e("edit.household.label"), i = h`<div class="sheet-title">${S(e("edit.household.title"), "h2", P(e, "q_household"))}</div>
          <joe-household .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
				break;
			case "action":
				a = e("action.label"), i = h`<joe-action-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
          actionId=${t.id ?? ""}
        ></joe-action-editor>`;
				break;
			case "consumers": a = e("edit.consumers.label"), o = !0, i = h`<div class="sheet-title">${S(e("edit.consumers.title"))}</div>
          <joe-consumers .hass=${this.hass} .t=${e} .config=${n}></joe-consumers>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
		}
		return h`<joe-sheet label=${a} closeLabel=${e("common.close")} ?wide=${o} @joe-close=${r}>
      ${i}
    </joe-sheet>`;
	}
	renderPicker(e) {
		let t = this.picker, n = (e) => {
			t?.resolve(e), this.picker = void 0;
		};
		return h`<joe-sheet
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
			vr,
			E,
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
D([y({ attribute: !1 })], $.prototype, "hass", void 0), D([y({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), D([y({ attribute: !1 })], $.prototype, "route", void 0), D([b()], $.prototype, "joe", void 0), D([b()], $.prototype, "info", void 0), D([b()], $.prototype, "failed", void 0), D([b()], $.prototype, "modeDialog", void 0), D([b()], $.prototype, "notice", void 0), D([b()], $.prototype, "discovery", void 0), D([b()], $.prototype, "discovering", void 0), D([b()], $.prototype, "discoveryFailed", void 0), D([b()], $.prototype, "checks", void 0), D([b()], $.prototype, "picker", void 0), D([b()], $.prototype, "editor", void 0), T("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
