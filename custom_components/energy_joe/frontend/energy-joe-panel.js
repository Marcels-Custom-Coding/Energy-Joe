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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
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
}, h = (e, t) => !l(e, t), oe = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: h
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
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
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? h)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[p("elementProperties")] = /* @__PURE__ */ new Map(), g[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: g }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var _ = globalThis, se = (e) => e, v = _.trustedTypes, ce = v ? v.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, le = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ue = "?" + y, de = `<${ue}>`, b = document, x = () => b.createComment(""), S = (e) => e === null || typeof e != "object" && typeof e != "function", fe = Array.isArray, pe = (e) => fe(e) || typeof e?.[Symbol.iterator] == "function", me = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, T = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), O = b.createTreeWalker(b, 129);
function xe(e, t) {
	if (!fe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ce === void 0 ? t : ce.createHTML(t);
}
var Se = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + le + n.slice(l) + y + d) : n + y + (l === -2 ? t : d);
	}
	return [xe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, k = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Se(t, n);
		if (this.el = e.createElement(l, r), O.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = O.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(le)) {
					let t = u[o++], n = i.getAttribute(e).split(y), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? we : r[1] === "?" ? Te : r[1] === "@" ? Ee : M
					}), i.removeAttribute(e);
				} else e.startsWith(y) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(y), t = e.length - 1;
					if (t > 0) {
						i.textContent = v ? v.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], x()), O.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], x());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ue) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(y, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += y.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = b.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = S(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
}
var Ce = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? b).importNode(t, !0);
		O.currentNode = r;
		let i = O.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new j(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new De(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = b, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, j = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = A(this, e, t), S(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && S(this._$AH) ? this._$AA.nextSibling.data = e : this.T(b.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = k.createElement(xe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = be.get(e.strings);
		return t === void 0 && be.set(e.strings, t = new k(e)), t;
	}
	k(t) {
		fe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(x()), this.O(x()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = se(e).nextSibling;
			se(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, M = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = D, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = D;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !S(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !S(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, we = class extends M {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, Te = class extends M {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, Ee = class extends M {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, De = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		A(this, e);
	}
}, Oe = _.litHtmlPolyfillSupport;
Oe?.(k, j), (_.litHtmlVersions ??= []).push("3.3.3");
var ke = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new j(t.insertBefore(x(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, N = globalThis, P = class extends g {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ke(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
P._$litElement$ = !0, P.finalized = !0, N.litElementHydrateSupport?.({ LitElement: P });
var Ae = N.litElementPolyfillSupport;
Ae?.({ LitElement: P }), (N.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var je = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	hasChanged: h
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
function F(e) {
	return (t, n) => typeof n == "object" ? Me(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function I(e) {
	return F({
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
function Pe(e, t) {
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
//#region src/assets.ts
var Fe = import.meta.url.replace(/[^/]*$/, ""), L = (e) => `${Fe}${e}`, Ie = {
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
	"scan.lead": "Ich habe mich in deinem Home Assistant umgesehen. Bestätigen und ändern kannst du gleich im nächsten Update – schau schon mal drüber.",
	"scan.again": "Nochmal suchen",
	"scan.why": "Warum?",
	"scan.failed": "Beim Umschauen ist etwas schiefgegangen. Versuch es nochmal.",
	"scan.confirm.soon": "Bestätigen und Ändern kommt im nächsten Update",
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
	"check.grid_sign.export": "Netz: Nach Sonne und Verbrauch müsstest du gerade etwa {expected} kW einspeisen, der Sensor zeigt aber {actual} kW Bezug. Zählt er andersherum?",
	"check.grid_sign.import": "Netz: Nach Sonne und Verbrauch müsstest du gerade etwa {expected} kW beziehen, der Sensor zeigt aber {actual} kW Einspeisung. Zählt er andersherum?",
	"check.soc_range": "{battery}: Ladezustand {value} % ist unplausibel.",
	"check.capacity_unknown": "{battery}: Größe unbekannt – frag ich dich oder lerne sie.",
	"check.not_controllable": "{battery}: kann ich lesen, aber nicht steuern.",
	"check.tariff_unknown": "Den Tarif habe ich nicht erkannt – frag ich dich gleich.",
	"role.grid_power": "Netzleistung",
	"role.home_power": "Hausverbrauch",
	"role.solar_power": "PV-Leistung",
	"onb.questions.title": "Ein paar |Fragen",
	"onb.questions.lead": "Was ich nicht selbst herausfinde, frage ich dich – mit Antworten zum Antippen und immer mit „Weiß ich nicht“.",
	"onb.done.title": "Alles klar, |Partner.",
	"onb.done.lead": "Ich plane ab heute jede Nacht, steuere aber nichts. Nach einer Woche zeige ich dir, was es gebracht hätte.",
	"onb.done.go": "Joe starten",
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
	"overview.next.1.title": "Joe ist eingezogen",
	"overview.next.1.text": "Die Simulation läuft. Ich schalte nichts.",
	"overview.next.2.title": "Geräte bestätigen",
	"overview.next.2.text": "Ich zeige dir, was ich gefunden habe – Speicher, Tarif, Prognose.",
	"overview.next.3.title": "Erste Nacht planen",
	"overview.next.3.text": "Ich rechne aus, wie viel ich geladen hätte.",
	"overview.next.4.title": "Ergebnis ansehen",
	"overview.next.4.text": "Was es gebracht hätte – Tag für Tag.",
	"status.done": "erledigt",
	"plan.title": "Hier |rechne ich",
	"plan.text": "Jede Nacht plane ich, wie weit die Speicher geladen werden – mit Kurven für Sonne, Verbrauch und Ladezustand.",
	"history.title": "Jeder Tag |unter der Lupe",
	"history.text": "Hier siehst du für jeden Tag, was ich geplant habe und was wirklich passiert ist.",
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
	"error.title": "Joe antwortet |nicht",
	"error.text": "Ich erreiche die Integration nicht. Lade die Seite neu – hilft das nicht, schau unter Einstellungen → System → Protokolle nach.",
	"error.action": "Fehler beim Speichern",
	loading: "Joe sattelt auf …"
}, Le = {
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
	"scan.lead": "I looked around your Home Assistant. Confirming and changing comes with the next update – have a look already.",
	"scan.again": "Look again",
	"scan.why": "Why?",
	"scan.failed": "Something went wrong while looking around. Please try again.",
	"scan.confirm.soon": "Confirming and changing comes with the next update",
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
	"check.grid_sign.export": "Grid: going by sun and consumption you should be exporting about {expected} kW, but the sensor shows {actual} kW import. Does it count the other way round?",
	"check.grid_sign.import": "Grid: going by sun and consumption you should be importing about {expected} kW, but the sensor shows {actual} kW export. Does it count the other way round?",
	"check.soc_range": "{battery}: state of charge {value} % is implausible.",
	"check.capacity_unknown": "{battery}: size unknown – I'll ask you or learn it.",
	"check.not_controllable": "{battery}: I can read it but not control it.",
	"check.tariff_unknown": "I didn't recognise the tariff – I'll ask you in a moment.",
	"role.grid_power": "grid power",
	"role.home_power": "home consumption",
	"role.solar_power": "solar power",
	"onb.questions.title": "A few |questions",
	"onb.questions.lead": "Whatever I can't find out myself, I'll ask you – with answers to tap and always with “I don't know”.",
	"onb.done.title": "Alright, |partner.",
	"onb.done.lead": "From tonight I plan every night but don't switch anything. After a week I'll show you what it would have saved.",
	"onb.done.go": "Start Joe",
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
	"overview.next.1.title": "Joe moved in",
	"overview.next.1.text": "The simulation is running. I don't switch anything.",
	"overview.next.2.title": "Confirm devices",
	"overview.next.2.text": "I show you what I found – batteries, tariff, forecast.",
	"overview.next.3.title": "Plan the first night",
	"overview.next.3.text": "I work out how much I would have charged.",
	"overview.next.4.title": "See the result",
	"overview.next.4.text": "What it would have saved – day by day.",
	"status.done": "done",
	"plan.title": "Where I |do the math",
	"plan.text": "Every night I plan how far to charge the batteries – with curves for sun, consumption and state of charge.",
	"history.title": "Every day |up close",
	"history.text": "See for every day what I planned and what really happened.",
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
	"error.title": "Joe isn't |answering",
	"error.text": "I can't reach the integration. Reload the page – if that doesn't help, check Settings → System → Logs.",
	"error.action": "Saving failed",
	loading: "Joe is saddling up …"
}, Re = /* @__PURE__ */ new Map();
function ze(e, t) {
	return e.replace(/\{(\w+)\}/g, (e, n) => String(t?.[n] ?? ""));
}
function Be(e) {
	let t = e || "en", n = Re.get(t);
	if (n) return n;
	let r = t.startsWith("de") ? Ie : Le, i = ((e, t) => ze(r[e], t));
	return i.optional = (e, t) => e in r ? ze(r[e], t) : void 0, Object.defineProperty(i, "lang", { value: t }), Re.set(t, i), i;
}
function R(e, t, n) {
	return Be(e).optional(t, n);
}
function Ve(e) {
	return e.split("|");
}
//#endregion
//#region src/components/bits.ts
var z = T`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;
function B(e, t = "h2") {
	let n = Ve(e), r = n.length - 1, i = n.map((e, t) => t === r && n.length > 1 ? T`<span class="hl">${e}</span>` : e.endsWith("!") ? T`${e}<br />` : T`${e}`);
	return t === "h1" ? T`<h1 class="display">${i}</h1>` : T`<h2 class="display">${i}</h2>`;
}
//#endregion
//#region src/define.ts
function V(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
//#endregion
//#region src/styles/shared.ts
var H = o`
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
//#region src/components/pose.ts
var He = /* @__PURE__ */ new Set(["welcome"]), Ue = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), We = "thumbs", W = class extends P {
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
		let e = Ue.has(this.name) ? "scene" : "";
		if (this.name === We) return T`<img class="light" src=${L("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${L("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = L(`poses/${this.name}.webp`);
		return He.has(this.name) ? T`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${L(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : T`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
U([F()], W.prototype, "name", void 0), U([F()], W.prototype, "alt", void 0), V("joe-pose", W);
//#endregion
//#region src/components/empty-state.ts
var G = class extends P {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [H, o`
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
		return T`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${B(this.heading)} ${z}
        <p class="lead">${this.text}</p>
        ${this.note ? T`<div class="note"><span class="chip soon">${this.note}</span></div>` : D}
        <slot></slot>
      </div>
    </div>`;
	}
};
U([F()], G.prototype, "pose", void 0), U([F()], G.prototype, "heading", void 0), U([F()], G.prototype, "text", void 0), U([F()], G.prototype, "note", void 0), V("joe-empty-state", G);
//#endregion
//#region src/components/sim-switch.ts
var Ge = {
	simulation: "mdi:pause",
	live: "mdi:play",
	off: "mdi:power"
}, K = class extends P {
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
		return e ? T`<button
      type="button"
      class=${this.mode}
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Ge[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? D : T`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : D;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
U([F()], K.prototype, "mode", void 0), U([F({ type: Boolean })], K.prototype, "compact", void 0), U([F({ attribute: !1 })], K.prototype, "t", void 0), V("joe-sim-switch", K);
//#endregion
//#region src/components/tip.ts
var Ke = 120, qe = 220, Je = 8, Ye = 10, q, J = class extends P {
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
		return e ? T`<button
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
        ${Xe(e.text)}
        ${e.facts?.length ? T`<dl>${e.facts.map(([e, t]) => T`<dt>${e}</dt><dd>${t}</dd>`)}</dl>` : D}
        <span class="arrow"></span>
      </div>` : D;
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
		e.pointerType === "mouse" && (this.cancelTimer(), this.open || (this.timer = window.setTimeout(() => this.show(), Ke)));
	}
	onLeave(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open && !this.pinned && (this.timer = window.setTimeout(() => this.close(), qe)));
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
		let r = t.getBoundingClientRect(), i = document.documentElement.clientWidth, a = n.top - r.height - Ye, o = "top";
		a < Je && (a = n.bottom + Ye, o = "bottom");
		let s = n.left + n.width / 2, c = Math.max(Je, Math.min(s - r.width / 2, i - r.width - Je)), l = Math.max(14, Math.min(s - c, r.width - 14));
		t.style.left = `${Math.round(c)}px`, t.style.top = `${Math.round(a)}px`, t.style.setProperty("--arrow", `${Math.round(l)}px`), t.dataset.place = o;
	}
};
U([F({ attribute: !1 })], J.prototype, "tip", void 0), U([F()], J.prototype, "label", void 0), U([I()], J.prototype, "open", void 0), U([Pe("button")], J.prototype, "button", void 0), U([Pe(".bubble")], J.prototype, "bubble", void 0);
function Xe(e) {
	return e.split("\n").map((e) => T`<p>
        ${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? T`<strong>${e}</strong>` : e)}
      </p>`);
}
function Ze(e, t, n, r = []) {
	let i = e.optional(`tip.${t}.hint`, n);
	return {
		heading: e(`tip.${t}.title`, n),
		text: e(`tip.${t}.text`, n),
		facts: i ? [...r, [e("tip.hint"), i]] : r
	};
}
function Y(e, t, n, r) {
	return T`<joe-tip .tip=${Ze(e, t, n, r)} label=${e("tip.label")}></joe-tip>`;
}
V("joe-tip", J);
//#endregion
//#region src/fonts.ts
var Qe = [
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
function $e() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = Qe.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${L(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region src/components/found-list.ts
var et = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), X = class extends P {
	constructor(...e) {
		super(...e), this.language = "de";
	}
	static {
		this.styles = [H, o`
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
      li.item.missing {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
        background: transparent;
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
      .missing .ico-box {
        color: var(--joe-muted);
      }
      .text {
        min-width: 0;
        flex: 1;
      }
      .t {
        font-weight: 700;
        line-height: 1.3;
      }
      .d {
        font-size: 13.5px;
        color: var(--joe-ink-2);
        margin-top: 2px;
        overflow-wrap: anywhere;
      }
      .missing .d {
        color: var(--joe-muted);
      }
      .end {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        flex: none;
      }
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
      .notes {
        margin-top: 18px;
      }
      .notes h3 {
        margin: 0 0 8px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        color: var(--joe-muted);
      }
      .note {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 14px;
        margin-bottom: 6px;
        background: var(--joe-info-soft);
        color: var(--joe-ink);
      }
      .note ha-icon {
        color: var(--joe-info);
        margin-top: 1px;
      }
      .note.warn {
        background: var(--joe-warn-soft);
      }
      .note.warn ha-icon {
        color: var(--joe-warn);
      }
      @media (max-width: 480px) {
        li.item {
          flex-wrap: wrap;
        }
        .end {
          flex-direction: row;
          align-items: center;
          width: 100%;
          justify-content: flex-end;
        }
      }
    `];
	}
	render() {
		let e = this.discovery, t = this.t;
		if (!e || !t) return D;
		let n = e.checks;
		return T`<ul class="found">
        ${this.rows(e, t).map((e) => this.renderRow(e, t))}
      </ul>
      ${n.length ? T`<div class="notes">
            <h3>${t("scan.notes")}</h3>
            ${n.map((e) => this.renderCheck(e, t))}
          </div>` : D}`;
	}
	rows(e, t) {
		let n = [], r = e.energy_dashboard;
		r.configured && n.push({
			icon: "mdi:lightning-bolt",
			title: t("find.energy"),
			detail: t("find.energy.detail", {
				grid: this.count(r.grid ?? 0, "word.grid"),
				solar: this.count(r.solar ?? 0, "word.solar"),
				battery: this.count(r.battery ?? 0, "word.battery"),
				devices: this.count(r.devices ?? 0, "word.device")
			}),
			read: !0
		});
		for (let r of e.batteries) {
			let e = [
				r.capacity_kwh ? `${this.num(r.capacity_kwh, 1)} kWh` : null,
				typeof r.soc.value == "number" ? `${this.num(r.soc.value, 0)} %` : null,
				r.controllable ? t("find.battery.control") : t("find.battery.read")
			];
			n.push({
				icon: "mdi:home-battery-outline",
				title: r.name,
				detail: e.filter(Boolean).join(" · "),
				confidence: r.confidence,
				reasons: r.reasons
			});
		}
		let i = e.tariff, a = (e) => e == null ? "–" : this.num(e * 100, 1), o = t("find.tariff.unknown");
		i.kind === "fixed_window" && i.window ? o = t("find.tariff.window", {
			start: i.window.start,
			end: i.window.end,
			night: a(i.night_price),
			day: a(i.day_price)
		}) : i.kind === "dynamic" ? o = t("find.tariff.dynamic", {
			night: a(i.night_price),
			day: a(i.day_price)
		}) : i.kind === "flat" && (o = t("find.tariff.flat", { day: a(i.day_price) })), i.feed_in_price != null && (o += ` · ${t("find.tariff.feedin", { price: a(i.feed_in_price) })}`), n.push({
			icon: "mdi:cash-clock",
			title: i.provider ?? t("find.tariff"),
			detail: o,
			confidence: i.kind === "unknown" ? void 0 : i.confidence,
			reasons: i.reasons,
			missing: i.kind === "unknown"
		});
		let s = e.forecast;
		n.push(s ? {
			icon: "mdi:weather-sunny",
			title: t("find.forecast"),
			detail: t("find.forecast.detail", {
				provider: s.provider_name,
				planes: this.count(s.planes, "word.plane"),
				today: s.today_kwh == null ? "–" : this.num(s.today_kwh, 1),
				tomorrow: s.tomorrow_kwh == null ? "–" : this.num(s.tomorrow_kwh, 1)
			}),
			confidence: s.confidence,
			reasons: s.reasons
		} : {
			icon: "mdi:weather-sunny",
			title: t("find.forecast"),
			detail: t("find.none"),
			missing: !0
		});
		let c = e.measurements;
		n.push(this.single("mdi:transmission-tower", t("find.grid"), c.grid_power, t)), n.push(this.single("mdi:home-lightning-bolt-outline", t("find.home"), c.home_power, t)), n.push(c.solar_power ? {
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			detail: t("find.solar.detail", {
				count: this.count(c.solar_power.entities.length, "word.sensor"),
				total: c.solar_power.total == null ? "–" : this.num(c.solar_power.total, 2)
			}),
			confidence: c.solar_power.confidence,
			reasons: c.solar_power.reasons
		} : {
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			detail: t("find.none"),
			missing: !0
		});
		for (let r of e.wallboxes.filter((e) => e.is_car)) n.push({
			icon: "mdi:ev-station",
			title: t("find.wallbox"),
			detail: r.name,
			confidence: r.confidence,
			reasons: r.reasons
		});
		return e.weather && n.push({
			icon: "mdi:weather-partly-cloudy",
			title: t("find.weather"),
			detail: e.weather.entity.name,
			confidence: e.weather.confidence,
			reasons: e.weather.reasons
		}), e.holiday && n.push({
			icon: "mdi:calendar-star",
			title: t("find.holiday"),
			detail: e.holiday.entity.name,
			confidence: e.holiday.confidence,
			reasons: e.holiday.reasons
		}), (e.persons.length || e.calendars.length) && n.push({
			icon: "mdi:account-group-outline",
			title: t("find.people"),
			detail: t("find.people.detail", {
				persons: this.count(e.persons.length, "word.person"),
				calendars: this.count(e.calendars.length, "word.calendar")
			}),
			read: !0
		}), e.consumers.length && n.push({
			icon: "mdi:devices",
			title: t("find.devices"),
			detail: t("find.devices.detail", {
				count: this.count(e.consumers.filter((e) => e.kind !== "submeter").length, "word.device"),
				heating: e.consumers.filter((e) => et.has(e.kind)).length
			}),
			read: !0
		}), n;
	}
	single(e, t, n, r) {
		return n ? {
			icon: e,
			title: t,
			detail: `${n.entity.name} · ${this.value(n.entity)}`,
			confidence: n.confidence,
			reasons: n.reasons
		} : {
			icon: e,
			title: t,
			detail: r("find.none"),
			missing: !0
		};
	}
	renderRow(e, t) {
		return T`<li class="item ${e.missing ? "missing" : ""}">
      <span class="ico-box"><ha-icon icon=${e.icon}></ha-icon></span>
      <div class="text">
        <div class="t">${e.title}</div>
        <div class="d">${e.detail}</div>
        ${e.reasons?.length ? T`<details data-notip>
              <summary>${t("scan.why")}</summary>
              <ul>
                ${e.reasons.map((e) => T`<li>${this.reasonText(e)}</li>`)}
              </ul>
            </details>` : D}
      </div>
      <div class="end">
        ${e.read ? T`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${t("energy.read")}</span>` : D}
        ${e.confidence == null ? D : this.dots(e.confidence, t)}
      </div>
    </li>`;
	}
	dots(e, t) {
		let n = e >= .85 ? 4 : e >= .65 ? 3 : e >= .45 ? 2 : 1, r = t(`conf.${n}`);
		return T`<span class="conf" role="img" aria-label=${r} title=${r}>
      ${[
			1,
			2,
			3,
			4
		].map((e) => T`<i class=${e <= n ? "on" : ""}></i>`)}
    </span>`;
	}
	reasonText(e) {
		let t = {};
		for (let [n, r] of Object.entries(e)) (typeof r == "string" || typeof r == "number") && (t[n] = r);
		return R(this.language, `reason.${e.code}`, t) ?? e.code;
	}
	renderCheck(e, t) {
		let n = {};
		for (let [t, r] of Object.entries(e)) typeof r == "number" ? n[t] = this.num(r, 2) : typeof r == "string" && (n[t] = r);
		typeof e.role == "string" && (n.role = R(this.language, `role.${e.role}`) ?? e.role);
		let r = `check.${e.code}`;
		e.code === "grid_sign" && typeof e.expected == "number" && typeof e.actual == "number" && (r = e.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = this.num(Math.abs(e.expected), 1), n.actual = this.num(Math.abs(e.actual), 1));
		let i = R(this.language, r, n) ?? e.code;
		return T`<div class="note ${e.level}">
      <ha-icon icon=${e.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <span>${i}</span>
    </div>`;
	}
	count(e, t) {
		let [n, r] = (R(this.language, t) ?? "|").split("|");
		return `${this.num(e, 0)} ${e === 1 ? n : r}`;
	}
	value(e) {
		return typeof e.value == "number" ? `${this.num(e.value, e.unit === "kW" ? 2 : 0)} ${e.unit ?? ""}`.trim() : String(e.value ?? "–");
	}
	num(e, t) {
		return new Intl.NumberFormat(this.language, { maximumFractionDigits: t }).format(e);
	}
};
U([F({ attribute: !1 })], X.prototype, "discovery", void 0), U([F({ attribute: !1 })], X.prototype, "t", void 0), U([F()], X.prototype, "language", void 0), V("joe-found-list", X);
//#endregion
//#region src/pages/onboarding.ts
var Z = class extends P {
	constructor(...e) {
		super(...e), this.step = "welcome", this.discovering = !1, this.discoveryFailed = !1, this.language = "de";
	}
	static {
		this.styles = [H, o`
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
      .note {
        margin-top: 14px;
      }
      .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
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
      joe-found-list {
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
		if (!e) return D;
		switch (this.step) {
			case "welcome": return this.layout("welcome", T`${B(e("onb.welcome.title"), "h1")} ${z}
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
              ${Y(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return this.layout("ask", T`${B(e("onb.questions.title"))} ${z}
            <p class="lead">${e("onb.questions.lead")}</p>
            <div class="note"><span class="chip soon">${e("soon")}</span></div>
            <div class="actions" data-notip>
              <button type="button" class="btn btn-primary" @click=${() => this.go("done")}>
                ${e("onb.next")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => this.go("scan")}>
                ${e("onb.back")}
              </button>
            </div>`);
			case "done": return this.layout("thumbs", T`${B(e("onb.done.title"))} ${z}
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
            <div class="actions">
              <span class="with-tip" data-tipped>
                <button type="button" class="btn btn-primary" @click=${this.complete}>
                  ${e("onb.done.go")}
                </button>
                ${Y(e, "start")}
              </span>
              <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("questions")}>
                ${e("onb.back")}
              </button>
            </div>`);
		}
	}
	renderScan(e) {
		return this.discovering || !this.discovery && !this.discoveryFailed ? this.layout("scout", T`${B(e("onb.scan.title"))} ${z}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`) : T`<div class="wrap wide">
      <joe-pose name="scout"></joe-pose>
      <div>
        ${B(e("scan.title"))} ${z}
        <p class="lead">${e("scan.lead")}</p>
        ${this.discoveryFailed ? T`<p class="failed">${e("scan.failed")}</p>` : T`<joe-found-list .discovery=${this.discovery} .t=${e} language=${this.language}></joe-found-list>`}
        <div class="note"><span class="chip soon">${e("scan.confirm.soon")}</span></div>
        <div class="actions">
          <button type="button" class="btn btn-primary" data-notip @click=${() => this.go("questions")}>
            ${e("onb.next")}
          </button>
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-secondary" @click=${this.rediscover}>${e("scan.again")}</button>
            ${Y(e, "rescan")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
            ${e("onb.back")}
          </button>
        </div>
      </div>
    </div>`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(e, t) {
		return T`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return T`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			[t.sources.grid ?? 0, e("energy.grid")],
			[t.sources.solar ?? 0, e("energy.solar")],
			[t.sources.battery ?? 0, e("energy.battery")],
			[t.devices ?? 0, e("energy.devices")]
		];
		return T`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map(([e, t]) => T`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e} ${t}</span>`)}
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
U([F()], Z.prototype, "step", void 0), U([F({ attribute: !1 })], Z.prototype, "t", void 0), U([F({ attribute: !1 })], Z.prototype, "info", void 0), U([F({ attribute: !1 })], Z.prototype, "discovery", void 0), U([F({ type: Boolean })], Z.prototype, "discovering", void 0), U([F({ type: Boolean })], Z.prototype, "discoveryFailed", void 0), U([F()], Z.prototype, "language", void 0), V("joe-onboarding", Z);
//#endregion
//#region src/pages/overview.ts
var tt = class extends P {
	static {
		this.styles = [H, o`
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
      joe-pose {
        position: absolute;
        right: -6px;
        top: 10px;
        width: 170px;
        pointer-events: none;
      }
      .wide {
        grid-column: 1 / -1;
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
        .next {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .next {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 480px) {
        joe-pose {
          width: 120px;
        }
        .card .display {
          max-width: 64%;
        }
      }
    `];
	}
	render() {
		let e = this.t;
		return e ? T`<div class="grid">
      <section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${B(e("overview.night.empty.title"))} ${z}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>
      <section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")}</div>
        ${B(e("overview.sim.empty.title"))} ${z}
        <p class="lead">${e("overview.sim.empty.text")}</p>
      </section>
      <section class="card wide">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-path"></ha-icon>${e("overview.next")}</div>
        <ol class="next">
          <li class="done">
            <b>${e("overview.next.1.title")}</b><span>${e("overview.next.1.text")}</span>
            <span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("status.done")}</span>
          </li>
          <li>
            <b>${e("overview.next.2.title")}</b><span>${e("overview.next.2.text")}</span>
            <span class="chip soon">${e("soon")}</span>
          </li>
          <li><b>${e("overview.next.3.title")}</b><span>${e("overview.next.3.text")}</span></li>
          <li><b>${e("overview.next.4.title")}</b><span>${e("overview.next.4.text")}</span></li>
        </ol>
      </section>
    </div>` : D;
	}
};
U([F({ attribute: !1 })], tt.prototype, "t", void 0), V("joe-overview", tt);
//#endregion
//#region src/pages/settings.ts
var nt = [
	"simulation",
	"off",
	"live"
], Q = class extends P {
	static {
		this.styles = [H, o`
      :host {
        display: block;
      }
      .list {
        display: grid;
        gap: 16px;
        max-width: 860px;
        margin: 0 auto;
      }
      .group {
        background: var(--joe-surface);
        border-radius: 14px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 4px 18px;
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
      }
      .row small {
        display: block;
        color: var(--joe-muted);
        font-size: 13px;
        margin-top: 2px;
        max-width: 46ch;
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
      @media (pointer: coarse) {
        .seg button {
          min-height: 44px;
        }
      }
    `];
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return D;
		let n = this.info?.energy, r = n?.configured && n.sources ? `${n.sources.solar ?? 0} ${e("energy.solar")} · ${n.sources.battery ?? 0} ${e("energy.battery")} · ${n.devices ?? 0} ${e("energy.devices")}` : e("settings.energy.none");
		return T`<div class="list">
      <section class="group">
        <h2>${e("settings.operation")}</h2>
        <div class="row" data-tipped>
          <div>
            <div class="name"><b>${e("settings.mode")}</b>${Y(e, "mode")}</div>
            <small>${e("settings.mode.hint")} ${e("settings.live.unavailable")}</small>
          </div>
          <div class="seg" role="group" aria-label=${e("settings.mode")}>
            ${nt.map((n) => T`<button
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
            <div class="name"><b>${e("settings.setup")}</b>${Y(e, "restart")}</div>
            <small>${e("settings.setup.hint")}</small>
          </div>
          <button type="button" class="btn btn-secondary" @click=${() => this.emit("joe-onboarding", {
			step: "welcome",
			completed: !1
		})}>
            ${e("settings.setup.restart")}
          </button>
        </div>
      </section>
      <section class="group">
        <h2>${e("settings.about")}</h2>
        <div class="row"><b>${e("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
        <div class="row"><b>${e("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
        <div class="row"><b>${e("settings.energy")}</b><span class="value">${r}</span></div>
      </section>
    </div>`;
	}
	emit(e, t) {
		this.dispatchEvent(new CustomEvent(e, {
			detail: t,
			bubbles: !0,
			composed: !0
		}));
	}
};
U([F({ attribute: !1 })], Q.prototype, "t", void 0), U([F({ attribute: !1 })], Q.prototype, "state", void 0), U([F({ attribute: !1 })], Q.prototype, "info", void 0), V("joe-settings", Q);
//#endregion
//#region src/styles/tokens.ts
var rt = o`
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
    --joe-show-light: none;
    --joe-show-dark: block;
    color-scheme: dark;
  }
`, it = [
	"welcome",
	"scan",
	"questions",
	"done"
], at = [
	"overview",
	"plan",
	"history",
	"learn",
	"devices",
	"settings"
], ot = [
	"simulation",
	"live",
	"off"
], st = {
	simulation: "mdi:pause",
	live: "mdi:play",
	off: "mdi:power"
}, ct = ["simulation", "off"], lt = {
	plan: {
		pose: "plan",
		title: "plan.title",
		text: "plan.text"
	},
	history: {
		pose: "inspect",
		title: "history.title",
		text: "history.text"
	},
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
}, $ = class extends P {
	constructor(...e) {
		super(...e), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.infoRequested = !1;
	}
	get t() {
		return Be(this.hass?.language);
	}
	get page() {
		let e = (this.route?.path ?? "").split("/")[1] ?? "";
		return at.includes(e) ? e : "overview";
	}
	connectedCallback() {
		super.connectedCallback(), $e(), this.subscribe();
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
		this.joe && !this.joe.onboarding.completed && this.joe.onboarding.step === "scan" && !this.discovery && !this.discovering && !this.discoveryFailed && this.discover();
	}
	async discover(e = !1) {
		if (!(!this.hass || this.discovering || this.discovery && !e)) {
			this.discovering = !0, this.discoveryFailed = !1;
			try {
				this.discovery = await this.hass.callWS({ type: "energy_joe/discover" });
			} catch {
				this.discoveryFailed = !0;
			} finally {
				this.discovering = !1;
			}
		}
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
		if (this.failed) return T`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return T`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return T`
      <header>
        ${this.joe.mode === "simulation" ? T`<div class="simband" aria-hidden="true"></div>` : D}
        <div class="bar">
          ${this.narrow ? T`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : D}
          <div class="brand">
            <img class="light" src=${L("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${L("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? T`<div class="notice" role="alert">${this.notice}</div>` : D}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.discover(!0)}
        @joe-set-mode=${(e) => this.setMode(e.detail.mode)}
      >
        ${t ? T`<joe-onboarding
              .step=${this.joe.onboarding.step}
              .t=${e}
              .info=${this.info}
              .discovery=${this.discovery}
              ?discovering=${this.discovering}
              ?discoveryFailed=${this.discoveryFailed}
              language=${this.hass?.language ?? "de"}
            ></joe-onboarding>` : this.renderPage(e)}
      </main>
      ${this.modeDialog ? this.renderModeDialog(e) : D}
    `;
	}
	renderTabs(e) {
		return T`<nav class="tabs" aria-label=${e("nav.label")}>
      ${at.map((t) => T`<a
            href=${this.href(t)}
            class=${t === this.page ? "on" : ""}
            aria-current=${t === this.page ? "page" : "false"}
            @click=${(e) => this.navigate(e, t)}
            >${e(`tab.${t}`)}</a
          >`)}
    </nav>`;
	}
	renderSteps(e) {
		let t = it.indexOf(this.joe?.onboarding.step ?? "welcome");
		return T`<ol class="steps" aria-label=${e("steps.label")}>
      ${it.map((n, r) => T`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.page;
		if (t === "overview") return T`<joe-overview .t=${e}></joe-overview>`;
		if (t === "settings") return T`<joe-settings .t=${e} .state=${this.joe} .info=${this.info}></joe-settings>`;
		let n = lt[t];
		return n ? T`<joe-empty-state
          pose=${n.pose}
          heading=${e(n.title)}
          text=${e(n.text)}
          note=${e("soon")}
        ></joe-empty-state>` : T``;
	}
	renderModeDialog(e) {
		let t = this.joe?.mode ?? "simulation";
		return T`<div class="scrim" @click=${this.closeDialog}>
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
          <div class="title-row">
            <div id="mode-title">${B(e("mode.dialog.title"))}</div>
            ${Y(e, "mode")}
          </div>
          ${z}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${ot.map((n) => {
			let r = ct.includes(n);
			return T`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${st[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? T`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? D : T`<span class="chip soon">${e("mode.soon")}</span>`}
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
			rt,
			H,
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
      .title-row {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
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
U([F({ attribute: !1 })], $.prototype, "hass", void 0), U([F({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), U([F({ attribute: !1 })], $.prototype, "route", void 0), U([I()], $.prototype, "joe", void 0), U([I()], $.prototype, "info", void 0), U([I()], $.prototype, "failed", void 0), U([I()], $.prototype, "modeDialog", void 0), U([I()], $.prototype, "notice", void 0), U([I()], $.prototype, "discovery", void 0), U([I()], $.prototype, "discovering", void 0), U([I()], $.prototype, "discoveryFailed", void 0), V("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
