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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: ne, getPrototypeOf: re } = Object, ie = globalThis, ae = ie.trustedTypes, oe = ae ? ae.emptyScript : "", se = ie.reactiveElementPolyfillSupport, ce = (e, t) => e, le = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? oe : null;
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
}, ue = (e, t) => !l(e, t), de = {
	attribute: !0,
	type: String,
	converter: le,
	reflect: !1,
	useDefault: !1,
	hasChanged: ue
};
Symbol.metadata ??= Symbol("metadata"), ie.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var d = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = de) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = ee(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? de;
	}
	static _$Ei() {
		if (this.hasOwnProperty(ce("elementProperties"))) return;
		let e = re(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(ce("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ce("properties"))) {
			let e = this.properties, t = [...te(e), ...ne(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? le : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? le : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ue)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
d.elementStyles = [], d.shadowRootOptions = { mode: "open" }, d[ce("elementProperties")] = /* @__PURE__ */ new Map(), d[ce("finalized")] = /* @__PURE__ */ new Map(), se?.({ ReactiveElement: d }), (ie.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var fe = globalThis, pe = (e) => e, me = fe.trustedTypes, he = me ? me.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ge = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, _e = "?" + f, ve = `<${_e}>`, p = document, ye = () => p.createComment(""), be = (e) => e === null || typeof e != "object" && typeof e != "function", xe = Array.isArray, Se = (e) => xe(e) || typeof e?.[Symbol.iterator] == "function", Ce = "[ 	\n\f\r]", we = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Te = /-->/g, Ee = />/g, m = RegExp(`>|${Ce}(?:([^\\s"'>=/]+)(${Ce}*=${Ce}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), De = /'/g, Oe = /"/g, ke = /^(?:script|style|textarea|title)$/i, h = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), g = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Ae = /* @__PURE__ */ new WeakMap(), v = p.createTreeWalker(p, 129);
function je(e, t) {
	if (!xe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return he === void 0 ? t : he.createHTML(t);
}
var Me = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = we;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === we ? c[1] === "!--" ? o = Te : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = m) : (ke.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = m) : o = Ee : o === m ? c[0] === ">" ? (o = i ?? we, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? m : c[3] === "\"" ? Oe : De) : o === Oe || o === De ? o = m : o === Te || o === Ee ? o = we : (o = m, i = void 0);
		let ee = o === m && e[t + 1].startsWith("/>") ? " " : "";
		a += o === we ? n + ve : l >= 0 ? (r.push(s), n.slice(0, l) + ge + n.slice(l) + f + ee) : n + f + (l === -2 ? t : ee);
	}
	return [je(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ne = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Me(t, n);
		if (this.el = e.createElement(l, r), v.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = v.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ge)) {
					let t = u[o++], n = i.getAttribute(e).split(f), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Le : r[1] === "?" ? Re : r[1] === "@" ? ze : Ie
					}), i.removeAttribute(e);
				} else e.startsWith(f) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ke.test(i.tagName)) {
					let e = i.textContent.split(f), t = e.length - 1;
					if (t > 0) {
						i.textContent = me ? me.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ye()), v.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], ye());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === _e) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(f, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += f.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = p.createElement("template");
		return n.innerHTML = e, n;
	}
};
function y(e, t, n = e, r) {
	if (t === g) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = be(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = y(e, i._$AS(e, t.values), i, r)), t;
}
var Pe = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? p).importNode(t, !0);
		v.currentNode = r;
		let i = v.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Fe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Be(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = v.nextNode(), a++);
		}
		return v.currentNode = p, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Fe = class e {
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
		e = y(this, e, t), be(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== g && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== _ && be(this._$AH) ? this._$AA.nextSibling.data = e : this.T(p.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ne.createElement(je(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Pe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ae.get(e.strings);
		return t === void 0 && Ae.set(e.strings, t = new Ne(e)), t;
	}
	k(t) {
		xe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(ye()), this.O(ye()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = pe(e).nextSibling;
			pe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Ie = class {
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
		if (i === void 0) e = y(this, e, t, 0), a = !be(e) || e !== this._$AH && e !== g, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = y(this, r[n + o], t, o), s === g && (s = this._$AH[o]), a ||= !be(s) || s !== this._$AH[o], s === _ ? e = _ : e !== _ && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Le = class extends Ie {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === _ ? void 0 : e;
	}
}, Re = class extends Ie {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== _);
	}
}, ze = class extends Ie {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = y(this, e, t, 0) ?? _) === g) return;
		let n = this._$AH, r = e === _ && n !== _ || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== _ && (n === _ || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Be = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		y(this, e);
	}
}, Ve = fe.litHtmlPolyfillSupport;
Ve?.(Ne, Fe), (fe.litHtmlVersions ??= []).push("3.3.3");
var He = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Fe(t.insertBefore(ye(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ue = globalThis, b = class extends d {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = He(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return g;
	}
};
b._$litElement$ = !0, b.finalized = !0, Ue.litElementHydrateSupport?.({ LitElement: b });
var We = Ue.litElementPolyfillSupport;
We?.({ LitElement: b }), (Ue.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var Ge = {
	attribute: !0,
	type: String,
	converter: le,
	reflect: !1,
	hasChanged: ue
}, Ke = (e = Ge, t, n) => {
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
function x(e) {
	return (t, n) => typeof n == "object" ? Ke(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function S(e) {
	return x({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var qe = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Je(e, t) {
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
			return qe(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return qe(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region src/assets.ts
var Ye = import.meta.url.replace(/[^/]*$/, ""), C = (e) => `${Ye}${e}`, Xe = {
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
	"overview.next.1.title": "Joe ist eingezogen",
	"overview.next.1.text": "Die Simulation läuft. Ich schalte nichts.",
	"overview.next.2.title": "Alles eingerichtet",
	"overview.next.2.text": "Speicher, Tarif und Prognose kenne ich. Ändern kannst du alles in den Einstellungen.",
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
	"error.title": "Joe antwortet |nicht",
	"error.text": "Ich erreiche die Integration nicht. Lade die Seite neu – hilft das nicht, schau unter Einstellungen → System → Protokolle nach.",
	"error.action": "Fehler beim Speichern",
	loading: "Joe sattelt auf …"
}, Ze = {
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
	"overview.next.1.title": "Joe moved in",
	"overview.next.1.text": "The simulation is running. I don't switch anything.",
	"overview.next.2.title": "All set up",
	"overview.next.2.text": "I know your batteries, tariff and forecast. You can change everything in the settings.",
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
	"error.title": "Joe isn't |answering",
	"error.text": "I can't reach the integration. Reload the page – if that doesn't help, check Settings → System → Logs.",
	"error.action": "Saving failed",
	loading: "Joe is saddling up …"
}, Qe = /* @__PURE__ */ new Map();
function $e(e, t) {
	return e.replace(/\{(\w+)\}/g, (e, n) => String(t?.[n] ?? ""));
}
function et(e) {
	let t = e || "en", n = Qe.get(t);
	if (n) return n;
	let r = t.startsWith("de") ? Xe : Ze, i = ((e, t) => $e(r[e], t));
	return i.optional = (e, t) => e in r ? $e(r[e], t) : void 0, Object.defineProperty(i, "lang", { value: t }), Qe.set(t, i), i;
}
function tt(e) {
	return e.split("|");
}
//#endregion
//#region src/components/bits.ts
var w = h`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;
function T(e, t = "h2", n) {
	let r = tt(e), i = r.length - 1, a = r.map((e, t) => t === i && r.length > 1 ? h`<span class="hl">${e}</span>` : e.endsWith("!") ? h`${e}<br />` : h`${e}`), o = n ? h`<span class="title-tip">${n}</span>` : "";
	return t === "h1" ? h`<h1 class="display">${a}${o}</h1>` : h`<h2 class="display">${a}${o}</h2>`;
}
function E(e, t) {
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
var nt = {
	read: "mdi:eye-outline",
	learned: "mdi:auto-fix",
	user: "mdi:account-edit-outline",
	default: "mdi:tune-variant"
};
function D(e, t) {
	let n = t?.source ?? "default";
	return h`<span class="chip ${n}"
    ><ha-icon icon=${nt[n]}></ha-icon>${e(`source.${n}`)}</span
  >`;
}
function rt(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) (typeof r == "string" || typeof r == "number") && (n[e] = r);
	return e.optional(`reason.${t.code}`, n) ?? t.code;
}
//#endregion
//#region src/define.ts
function O(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
//#endregion
//#region src/styles/shared.ts
var k = o`
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
function A(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/components/pose.ts
var it = /* @__PURE__ */ new Set(["welcome"]), at = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), ot = "thumbs", st = class extends b {
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
		let e = at.has(this.name) ? "scene" : "";
		if (this.name === ot) return h`<img class="light" src=${C("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${C("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = C(`poses/${this.name}.webp`);
		return it.has(this.name) ? h`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${C(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : h`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
A([x()], st.prototype, "name", void 0), A([x()], st.prototype, "alt", void 0), O("joe-pose", st);
//#endregion
//#region src/components/empty-state.ts
var ct = class extends b {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [k, o`
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
        ${T(this.heading)} ${w}
        <p class="lead">${this.text}</p>
        ${this.note ? h`<div class="note"><span class="chip soon">${this.note}</span></div>` : _}
        <slot></slot>
      </div>
    </div>`;
	}
};
A([x()], ct.prototype, "pose", void 0), A([x()], ct.prototype, "heading", void 0), A([x()], ct.prototype, "text", void 0), A([x()], ct.prototype, "note", void 0), O("joe-empty-state", ct);
//#endregion
//#region src/entities.ts
var lt = [
	"W",
	"kW",
	"MW"
], ut = [
	"Wh",
	"kWh",
	"MWh"
], dt = {
	power: (e) => j(e) === "sensor" && lt.includes(M(e)),
	soc: (e) => j(e) === "sensor" && M(e) === "%",
	energy: (e) => j(e) === "sensor" && ut.includes(M(e)),
	price: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(j(e)) && (e.attributes.device_class === "monetary" || /\/\s*kwh/i.test(M(e))),
	weather: (e) => j(e) === "weather",
	workday: (e) => j(e) === "binary_sensor",
	calendar: (e) => j(e) === "calendar",
	person: (e) => j(e) === "person",
	any: () => !0
};
function j(e) {
	return e.entity_id.split(".", 1)[0];
}
function M(e) {
	return String(e.attributes.unit_of_measurement ?? "");
}
function ft(e, t) {
	return dt[t](e);
}
function N(e, t) {
	let n = e.states[t]?.attributes.friendly_name;
	return typeof n == "string" && n ? n : t.split(".", 2)[1]?.replace(/_/g, " ") ?? t;
}
function pt(e, t) {
	let n = e.entities?.[t], r = n?.device_id ? e.devices?.[n.device_id] : void 0, i = n?.area_id ?? r?.area_id, a = i ? e.areas?.[i]?.name : void 0, o = r?.name_by_user || r?.name || void 0;
	return [o && N(e, t).toLowerCase().startsWith(o.toLowerCase()) ? void 0 : o, a].filter(Boolean).join(" · ");
}
function mt(e, t) {
	if (!t) return null;
	let n = Number.parseFloat(e.states[t]?.state ?? "");
	return Number.isFinite(n) ? n : null;
}
function P(e, t, n) {
	return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
}
function F(e, t, n) {
	let r = e.states[t];
	if (!r) return "–";
	if (e.formatEntityState) return e.formatEntityState(r);
	let i = mt(e, t);
	return i === null ? r.state : `${P(n, i, Math.abs(i) >= 100 ? 0 : Math.abs(i) >= 10 ? 1 : 2)} ${M(r)}`.trim();
}
function ht(e, t) {
	return t === "W" ? e / 1e3 : t === "MW" ? e * 1e3 : e;
}
function gt(e, t) {
	if (!t) return null;
	let n = mt(e, t.entity_id);
	if (n === null) return null;
	let r = ht(n, M(e.states[t.entity_id]));
	if (t.invert && (r = -r), t.minus_entity_id) {
		let n = mt(e, t.minus_entity_id);
		if (n === null) return null;
		r -= ht(n, M(e.states[t.minus_entity_id]));
	}
	return r;
}
function _t(e, t) {
	let n = mt(e, t);
	if (n === null || !t) return null;
	let r = M(e.states[t]);
	return r === "Wh" ? n / 1e3 : r === "MWh" ? n * 1e3 : n;
}
function vt(e, t) {
	let n = t.map((t) => gt(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
//#endregion
//#region src/components/tip.ts
var yt = 120, bt = 220, xt = 8, St = 10, I, Ct = class extends b {
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
        ${wt(e.text)}
        ${e.facts?.length ? h`<dl>${e.facts.map(([e, t]) => h`<dt>${e}</dt><dd>${t}</dd>`)}</dl>` : _}
        <span class="arrow"></span>
      </div>` : _;
	}
	show(e = !1) {
		this.cancelTimer(), this.pinned = this.pinned || e, !this.open && (I && I !== this && I.close(), I = this, this.open = !0, window.addEventListener("pointerdown", this.onOutside, !0), window.addEventListener("keydown", this.onKey, !0), this.updateComplete.then(() => {
			let e = this.bubble;
			this.open && e && (typeof e.showPopover == "function" && !e.matches(":popover-open") && e.showPopover(), this.follow());
		}));
	}
	close() {
		this.cancelTimer(), this.pinned = !1, this.frame !== void 0 && (cancelAnimationFrame(this.frame), this.frame = void 0), window.removeEventListener("pointerdown", this.onOutside, !0), window.removeEventListener("keydown", this.onKey, !0);
		let e = this.bubble;
		e && typeof e.hidePopover == "function" && e.matches(":popover-open") && e.hidePopover(), I === this && (I = void 0), this.open = !1;
	}
	onClick() {
		this.open && this.pinned ? this.close() : this.show(!0);
	}
	onEnter(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open || (this.timer = window.setTimeout(() => this.show(), yt)));
	}
	onLeave(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open && !this.pinned && (this.timer = window.setTimeout(() => this.close(), bt)));
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
		let r = t.getBoundingClientRect(), i = document.documentElement.clientWidth, a = n.top - r.height - St, o = "top";
		a < xt && (a = n.bottom + St, o = "bottom");
		let s = n.left + n.width / 2, c = Math.max(xt, Math.min(s - r.width / 2, i - r.width - xt)), l = Math.max(14, Math.min(s - c, r.width - 14));
		t.style.left = `${Math.round(c)}px`, t.style.top = `${Math.round(a)}px`, t.style.setProperty("--arrow", `${Math.round(l)}px`), t.dataset.place = o;
	}
};
A([x({ attribute: !1 })], Ct.prototype, "tip", void 0), A([x()], Ct.prototype, "label", void 0), A([S()], Ct.prototype, "open", void 0), A([Je("button")], Ct.prototype, "button", void 0), A([Je(".bubble")], Ct.prototype, "bubble", void 0);
function wt(e) {
	return e.split("\n").map((e) => h`<p>
        ${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? h`<strong>${e}</strong>` : e)}
      </p>`);
}
function Tt(e, t, n, r = []) {
	let i = e.optional(`tip.${t}.hint`, n);
	return {
		heading: e(`tip.${t}.title`, n),
		text: e(`tip.${t}.text`, n),
		facts: i ? [...r, [e("tip.hint"), i]] : r
	};
}
function L(e, t, n, r) {
	return h`<joe-tip .tip=${Tt(e, t, n, r)} label=${e("tip.label")}></joe-tip>`;
}
O("joe-tip", Ct);
//#endregion
//#region src/components/entity-picker.ts
var Et = 60, R = class extends b {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = Et;
	}
	static {
		this.styles = [k, o`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = Et);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return _;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), a = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return h`<div data-tipped>
      <div class="sheet-title">${T(n.heading, "h2", L(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = Et;
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
      ${r.length > i.length ? h`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += Et}>
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
			this.showAll = !this.showAll, this.limit = Et;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${L(t, "pick_all")}
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
			if (r.has(a) || !this.showAll && (!ft(o, t.filter) || e.entities?.[a]?.hidden)) continue;
			let s = N(e, a);
			if (n.length) {
				let t = `${s} ${a} ${pt(e, a)}`.toLowerCase();
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
		let a = this.selected.includes(r), o = pt(e, r), s = i?.reasons?.[0];
		return h`<li>
      <button type="button" class="row" aria-pressed=${String(a)} @click=${() => this.toggle(r)}>
        <span class="mark ${n.multiple ? "box" : ""}" aria-hidden="true">
          ${a ? h`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : _}
        </span>
        <span class="txt">
          <b>${N(e, r)}</b>
          <small>${o ? `${o} · ` : ""}${r}</small>
          ${s ? h`<small class="why">${rt(t, s)}</small>` : _}
        </span>
        <span class="end">
          <span class="val">${F(e, r, t.lang)}</span>
          ${i?.confidence == null ? _ : E(t, i.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let r = n.measurement?.role ?? "grid", i = this.selected[0], a = i ? gt(e, {
			entity_id: i,
			invert: this.invert,
			minus_entity_id: null
		}) : null, o = "";
		if (a !== null) {
			let e = P(t.lang, Math.abs(a), 2);
			o = r === "grid" ? t(a >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : r === "battery" ? t(a >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(a >= -.05 ? `pick.preview.${r}` : "pick.preview.negative", { value: P(t.lang, a, 2) });
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
        ${L(t, r === "battery" ? "pick_invert_battery" : "pick_invert")}
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
A([x({ attribute: !1 })], R.prototype, "hass", void 0), A([x({ attribute: !1 })], R.prototype, "t", void 0), A([x({ attribute: !1 })], R.prototype, "request", void 0), A([S()], R.prototype, "selected", void 0), A([S()], R.prototype, "invert", void 0), A([S()], R.prototype, "query", void 0), A([S()], R.prototype, "showAll", void 0), A([S()], R.prototype, "limit", void 0), O("joe-entity-picker", R);
//#endregion
//#region src/components/sheet.ts
var Dt = class extends b {
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
A([x()], Dt.prototype, "label", void 0), A([x()], Dt.prototype, "closeLabel", void 0), A([x({
	type: Boolean,
	reflect: !0
})], Dt.prototype, "wide", void 0), A([Je(".panel")], Dt.prototype, "panel", void 0), O("joe-sheet", Dt);
//#endregion
//#region src/components/sim-switch.ts
var Ot = {
	simulation: "mdi:pause",
	live: "mdi:play",
	off: "mdi:power"
}, kt = class extends b {
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
		return e ? h`<button
      type="button"
      class=${this.mode}
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Ot[this.mode]}></ha-icon></span>
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
A([x()], kt.prototype, "mode", void 0), A([x({ type: Boolean })], kt.prototype, "compact", void 0), A([x({ attribute: !1 })], kt.prototype, "t", void 0), O("joe-sim-switch", kt);
//#endregion
//#region src/config.ts
var At = /\[[^\]]*\]|[^.[]+/g;
function jt(e) {
	let t = [], n = "";
	for (let r of e.match(At) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function z(e, t) {
	for (let n of jt(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function B(e, t) {
	return e.answers.ignored.includes(t);
}
function V(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function H(e, t, n = "user") {
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
function U(e, t) {
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
function Mt(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function Nt(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/editors/battery-editor.ts
var Pt = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"priority",
	"adapter"
], W = class extends b {
	constructor(...e) {
		super(...e), this.batteryId = "", this.capacityUnknown = !1, this.saving = !1;
	}
	static {
		this.styles = [k, o`
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
		(e.has("config") || e.has("batteryId")) && t && !this.draft && (this.draft = Object.fromEntries(Pt.map((e) => [e, structuredClone(t[e])])), this.capacityUnknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, draft: r } = this, i = this.battery;
		if (!e || !t || !n || !r || !i) return _;
		let a = this.discovery?.batteries.find((e) => e.id === i.id), o = !!Object.keys(i.controls).length && (a?.controllable ?? i.adapter !== "none"), s = _t(t, i.capacity_entity);
		return h`<div class="sheet-title">${T(e("edit.battery.title", { name: i.name }))}</div>
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
                placeholder=${s == null ? e("f.unknown") : P(e.lang, s, 2)}
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
          ${s == null ? _ : h`<p class="field-hint">${e("f.battery.capacity.read", { value: P(e.lang, s, 2) })}</p>`}`, D(e, z(n, `batteries[${i.id}].capacity_kwh`)))}
      ${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, r.soc_entity, `${F(t, r.soc_entity, e.lang)}`, () => this.pickSoc()), D(e, z(n, `batteries[${i.id}].soc_entity`)))}
      ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, r.power?.entity_id ?? null, this.powerText(e, r.power), () => this.pickPower()), D(e, z(n, `batteries[${i.id}].power`)))}
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
      ${this.field(e("f.battery.control"), "f_battery_control", o ? h`<div class="toggle">
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
            <p class="field-hint">${e("f.battery.control.found", { count: Object.keys(i.controls).length })}</p>` : h`<p class="field-hint">${e("f.battery.control.none")}</p>`)}
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
      </div>`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return h`<div class="field" data-tipped>
      <div class="field-label">${e} ${L(i, t)} ${r ?? _}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return h`<div class="entity">
      <span>
        ${t ? h`<b>${N(i, t)}</b><small>${n}</small>` : h`<small>${e("find.none")}</small>`}
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
		let n = this.hass, r = gt(n, t);
		if (!t || r === null) return t ? F(n, t.entity_id, e.lang) : "";
		let i = P(e.lang, Math.abs(r), 2);
		return e(r >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: i });
	}
	async pickSoc() {
		let { t: e, draft: t } = this;
		if (!e || !t) return;
		let n = await U(this, {
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
		let n = await U(this, {
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
		for (let r of Pt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
		let r = `capacity:${e.id}`, i = this.config.answers[r] === "unknown", a = {};
		if (Object.keys(n).length && (a.batteries = { [e.id]: n }), i !== this.capacityUnknown && (a.answers = { [r]: this.capacityUnknown ? "unknown" : null }), Object.keys(a).length) {
			this.saving = !0;
			let e = await H(this, a);
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
A([x({ attribute: !1 })], W.prototype, "hass", void 0), A([x({ attribute: !1 })], W.prototype, "t", void 0), A([x({ attribute: !1 })], W.prototype, "config", void 0), A([x({ attribute: !1 })], W.prototype, "discovery", void 0), A([x()], W.prototype, "batteryId", void 0), A([S()], W.prototype, "draft", void 0), A([S()], W.prototype, "capacityUnknown", void 0), A([S()], W.prototype, "saving", void 0), O("joe-battery-editor", W);
//#endregion
//#region src/types.ts
var Ft = [
	"welcome",
	"scan",
	"questions",
	"done"
], It = [
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water",
	"ev",
	"comfort",
	"household",
	"submeter",
	"other"
], Lt = [
	"overview",
	"plan",
	"history",
	"learn",
	"devices",
	"settings"
], Rt = class extends b {
	static {
		this.styles = [k, o`
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
		if (!e || !t || !n) return _;
		let r = [...n.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return h`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${L(e, "f_consumer_kind")}</div>
      ${r.length ? h`<ul>
            ${r.map((r) => this.renderConsumer(e, t, n, r))}
          </ul>` : h`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
	renderConsumer(e, t, n, r) {
		let i = r.power_entity ? F(t, r.power_entity, e.lang) : "";
		return h`<li>
      <div>
        <b>${r.name}</b>
        <small>${D(e, z(n, `consumers[${r.id}].kind`))}${i}</small>
      </div>
      <select
        class="input"
        aria-label=${e("consumers.kind_of", { name: r.name })}
        .value=${r.kind}
        @change=${(e) => this.setKind(r, e.target.value)}
      >
        ${It.map((t) => h`<option value=${t} ?selected=${t === r.kind}>${e(`kind.${t}`)}</option>`)}
      </select>
    </li>`;
	}
	setKind(e, t) {
		t !== e.kind && H(this, { consumers: { [e.id]: { kind: t } } });
	}
};
A([x({ attribute: !1 })], Rt.prototype, "hass", void 0), A([x({ attribute: !1 })], Rt.prototype, "t", void 0), A([x({ attribute: !1 })], Rt.prototype, "config", void 0), O("joe-consumers", Rt);
//#endregion
//#region src/editors/household.ts
var zt = class extends b {
	static {
		this.styles = [k, o`
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
		let r = (this.discovery?.persons ?? []).filter((e) => B(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return h`<div data-tipped>
      ${n.persons.length ? h`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : h`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add">
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${L(e, "f_person_add")}
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
            ${N(t, r)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: N(t, r) })}
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
        ${L(e, "f_calendars")}
      </div>
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await U(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		H(this, {
			persons: { [n]: {
				name: N(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: V(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		H(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: V(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		H(this, {
			persons: { [e.id]: null },
			answers: { ignored: V(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await U(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		H(this, { persons: { [e.id]: { calendars: t } } });
	}
};
A([x({ attribute: !1 })], zt.prototype, "hass", void 0), A([x({ attribute: !1 })], zt.prototype, "t", void 0), A([x({ attribute: !1 })], zt.prototype, "config", void 0), A([x({ attribute: !1 })], zt.prototype, "discovery", void 0), O("joe-household", zt);
//#endregion
//#region src/components/choice.ts
var Bt = "unknown", G = class extends b {
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
			value: Bt,
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
A([x({ attribute: !1 })], G.prototype, "options", void 0), A([x({ attribute: !1 })], G.prototype, "value", void 0), A([x({ type: Boolean })], G.prototype, "multiple", void 0), A([x({ attribute: !1 })], G.prototype, "exclusive", void 0), A([x()], G.prototype, "idk", void 0), A([x()], G.prototype, "label", void 0), A([x({
	type: Boolean,
	reflect: !0
})], G.prototype, "compact", void 0), O("joe-choice", G);
//#endregion
//#region src/editors/tariff-form.ts
var K = class extends b {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [k, o`
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
            <div class="field-label">${e("f.tariff.kind")} ${L(e, "q_tariff")}</div>
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
        <div class="field-label">${e("f.window")} ${L(e, "f_window")}</div>
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
        <div class="field-label">${e("f.prices")} ${L(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return h`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${L(e, "f_prices")}</div>
      ${this.centInput(e, t.day_price, "day_price")}
    </div>`;
	}
	renderDynamic(e, t) {
		let n = this.hass, r = t.price_entity;
		return h`<div class="field" data-tipped>
      <div class="field-label">${e("f.price_entity")} ${L(e, "f_price_entity")}</div>
      <div class="entity">
        ${r && n ? h`<span><b>${N(n, r)}</b> <small>${F(n, r, e.lang)}</small></span>` : h`<small>${e("f.price_entity.none")}</small>`}
        <button type="button" class="mini-btn" @click=${this.pickPrice}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e(r ? "review.change" : "review.choose")}
        </button>
      </div>
    </div>`;
	}
	renderFeedIn(e, t) {
		let n = this.hass;
		return h`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${L(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? h`<p class="field-hint">
            ${e("f.feed_in.entity", { name: N(n, t.feed_in_entity) })}
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
		let n = this.discovery?.tariff, r = (await U(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: Mt(n?.price_entity ? [{
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
A([x({ attribute: !1 })], K.prototype, "hass", void 0), A([x({ attribute: !1 })], K.prototype, "t", void 0), A([x({ attribute: !1 })], K.prototype, "tariff", void 0), A([x({ attribute: !1 })], K.prototype, "discovery", void 0), A([x({ type: Boolean })], K.prototype, "feedIn", void 0), A([x({ type: Boolean })], K.prototype, "asQuestion", void 0), O("joe-tariff-form", K);
//#endregion
//#region src/editors/tariff-editor.ts
var Vt = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity"
];
function Ht(e, t) {
	let n = {};
	for (let r of Vt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
	return n;
}
var q = class extends b {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [k, o`
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
		return !e || !t ? _ : h`<div class="sheet-title">${T(e("edit.tariff.title"))}</div>
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
		let n = Ht(e.tariff, t);
		if (Object.keys(n).length) {
			this.saving = !0;
			let e = { tariff: n };
			"kind" in n && (e.answers = { tariff: t.kind });
			let r = await H(this, e);
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
A([x({ attribute: !1 })], q.prototype, "hass", void 0), A([x({ attribute: !1 })], q.prototype, "t", void 0), A([x({ attribute: !1 })], q.prototype, "config", void 0), A([x({ attribute: !1 })], q.prototype, "discovery", void 0), A([S()], q.prototype, "draft", void 0), A([S()], q.prototype, "saving", void 0), O("joe-tariff-editor", q);
//#endregion
//#region src/fonts.ts
var Ut = [
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
function Wt() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = Ut.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${C(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region src/components/texts.ts
function J(e, t) {
	return t == null ? "–" : P(e.lang, t * 100, 2);
}
function Gt(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: J(e, t.night_price),
		day: J(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: J(e, t.night_price),
		day: J(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: J(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: J(e, t.feed_in_price) })}`), r;
}
function Kt(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = P(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = P(e.lang, Math.abs(t.expected), 1), n.actual = P(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/components/review.ts
var qt = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), Y = class extends b {
	constructor(...e) {
		super(...e), this.checks = [], this.context = "setup";
	}
	static {
		this.styles = [k, o`
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
			chips: [D(t, { source: "read" })]
		}), i.push(...this.batteryRows(e, t, n)), i.push(this.tariffRow(t, n)), i.push(this.forecastRow(t, n)), i.push(this.powerRow(e, t, n, "grid_power")), i.push(this.powerRow(e, t, n, "home_power")), i.push(this.solarRow(e, t, n));
		for (let e of r?.wallboxes.filter((e) => e.is_car) ?? []) i.push({
			key: `wallbox:${e.name}`,
			icon: "mdi:ev-station",
			title: t("find.wallbox"),
			detail: `${e.name} · ${t("review.wallbox.later")}`,
			chips: [h`<span class="chip soon">${t("review.later")}</span>`]
		});
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
				heating: c.filter((e) => qt.has(e.kind)).length
			}),
			chips: o ? [] : s,
			tip: o ? "f_consumer_kind" : void 0,
			actions: o ? [this.button(t("review.assign"), "mdi:devices", () => this.edit("consumers"))] : void 0
		}), i;
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let i of n.batteries) {
			let a = this.discovery?.batteries.find((e) => e.id === i.id), o = mt(e, i.soc_entity), s = i.capacity_kwh ?? _t(e, i.capacity_entity), c = [
				s ? `${P(t.lang, s, 2)} kWh` : t("review.capacity_unknown"),
				o === null ? null : `${P(t.lang, o, 0)} %`,
				i.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], l = this.checks.filter((e) => e.battery_id === i.id).map((e) => this.note(t, e));
			r.push({
				key: `battery:${i.id}`,
				icon: "mdi:home-battery-outline",
				title: i.name,
				detail: c.filter(Boolean).join(" · "),
				chips: [D(t, z(n, `batteries[${i.id}].soc_entity`)), ...a ? [E(t, a.confidence)] : []],
				reasons: a?.reasons,
				notes: l,
				state: this.checks.some((e) => e.battery_id === i.id && e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [this.button(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", i.id)), this.button(t("review.ignore"), "", () => this.ignoreBattery(i.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) B(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
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
		H(this, {
			batteries: { [e]: null },
			answers: { ignored: V(this.config, `battery:${e}`, !0) }
		});
	}
	useBattery(e) {
		let t = this.config;
		H(this, {
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
			answers: { ignored: V(t, `battery:${e.id}`, !1) }
		}, "read");
	}
	async addBattery() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return;
		let r = (await U(this, {
			heading: e("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: []
		}))?.selected[0];
		if (!r) return;
		let i = t.entities?.[r]?.device_id, a = i ?? r;
		H(this, { batteries: { [a]: {
			name: i && (t.devices?.[i]?.name_by_user || t.devices?.[i]?.name) || N(t, r),
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
			detail: Gt(e, n),
			chips: r ? [] : [D(e, z(t, "tariff.kind")), ...this.discovery && this.discovery.tariff.kind !== "unknown" ? [E(e, this.discovery.tariff.confidence)] : []],
			reasons: this.discovery?.tariff.reasons,
			notes: r ? [this.info(e("review.tariff.ask"))] : [],
			state: r ? "missing" : void 0,
			tip: "review_tariff",
			actions: [this.button(e(r ? "review.enter" : "review.change"), "mdi:pencil-outline", () => this.edit("tariff"))]
		};
	}
	forecastRow(e, t) {
		let n = this.discovery?.forecast, r = B(t, "forecast"), i = {
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
				today: n.today_kwh == null ? "–" : P(e.lang, n.today_kwh, 1),
				tomorrow: n.tomorrow_kwh == null ? "–" : P(e.lang, n.tomorrow_kwh, 1)
			}) : t.forecast.provider,
			chips: [D(e, z(t, "forecast.provider")), ...n ? [E(e, n.confidence)] : []],
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
		H(this, {
			forecast: {
				provider: null,
				config_entries: [],
				today: [],
				tomorrow: [],
				remaining_today: []
			},
			answers: { ignored: V(this.config, "forecast", !0) }
		});
	}
	useForecast() {
		let e = this.discovery?.forecast;
		e && H(this, {
			forecast: {
				provider: e.provider,
				config_entries: e.config_entries ?? [],
				today: e.today ?? [],
				tomorrow: e.tomorrow ?? [],
				remaining_today: e.remaining_today ?? []
			},
			answers: { ignored: V(this.config, "forecast", !1) }
		}, "read");
	}
	powerRow(e, t, n, r) {
		let i = n.measurements[r], a = this.discovery?.measurements[r] ?? null, o = r === "grid_power", s = B(n, r), c = {
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
		let u = gt(e, i), ee = F(e, i.entity_id, t.lang);
		if (u !== null) {
			let e = P(t.lang, Math.abs(u), 2);
			ee = o ? t(u >= 0 ? "live.import" : "live.export", { value: e }) : t("live.kw", { value: P(t.lang, u, 2) });
		}
		let te = this.checks.filter((e) => e.code !== "missing" && (e.role === r || o && e.code === "grid_sign" || !o && e.code === "home_negative")), ne = te.map((e) => e.code === "grid_sign" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		})), this.button(t("review.keep"), "mdi:check", () => this.confirm(`grid_sign:${i.entity_id}`), !0)]) : e.code === "home_negative" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		}))]) : this.note(t, e)), re = a?.entity.entity_id === i.entity_id;
		return {
			...c,
			detail: `${N(e, i.entity_id)} · ${ee}`,
			chips: [D(t, z(n, `measurements.${r}`)), ...a && re ? [E(t, a.confidence)] : []],
			reasons: re ? a?.reasons : void 0,
			notes: ne,
			state: te.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l]
		};
	}
	async pickPower(e) {
		let { t, config: n } = this;
		if (!t || !n) return;
		let r = n.measurements[e], i = this.discovery?.measurements[e], a = e === "grid_power", o = await U(this, {
			heading: t(a ? "pick.grid.title" : "pick.home.title"),
			tip: a ? "pick_grid" : "pick_home",
			filter: "power",
			selected: r ? [r.entity_id] : [],
			suggestions: Mt(i ? [Nt(i)] : [], i?.alternatives),
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
		B(n, e) && (c.answers = { ignored: V(n, e, !1) }), H(this, c);
	}
	setPower(e, t) {
		H(this, { measurements: { [e]: t } });
	}
	solarRow(e, t, n) {
		let r = n.measurements.solar_power, i = this.discovery?.measurements.solar_power ?? null, a = {
			key: "solar_power",
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			tip: "review_solar"
		};
		if (!r.length) return B(n, "solar_power") ? {
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
		let o = vt(e, r), s = this.checks.filter((e) => e.role === "solar_power" && e.code !== "missing").map((e) => this.note(t, e));
		return {
			...a,
			detail: t("find.solar.detail", {
				count: this.count(t, r.length, "word.sensor"),
				total: o === null ? "–" : P(t.lang, o, 2)
			}),
			chips: [D(t, z(n, "measurements.solar_power")), ...i ? [E(t, i.confidence)] : []],
			reasons: i?.reasons,
			notes: s,
			state: s.length && this.checks.some((e) => e.role === "solar_power" && e.level === "warn") ? "flag" : void 0,
			actions: [this.button(t("review.change"), "mdi:magnify", () => this.pickSolar())]
		};
	}
	async pickSolar() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = t.measurements.solar_power, r = this.discovery?.measurements.solar_power, i = await U(this, {
			heading: e("pick.solar.title"),
			tip: "pick_solar",
			filter: "power",
			multiple: !0,
			selected: n.map((e) => e.entity_id),
			suggestions: Mt((r?.entities ?? []).map((e) => ({
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
		B(t, "solar_power") && (a.answers = { ignored: V(t, "solar_power", !1) }), H(this, a);
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
				detail: N(e, a),
				chips: [D(t, z(n, `context.${i}`)), ...o && l ? [E(t, o.confidence)] : []],
				reasons: l ? o?.reasons : void 0,
				actions: [this.button(t("review.change"), "mdi:magnify", c), this.button(t("review.ignore"), "", () => this.ignore(r, { context: { [i]: null } }), !0)]
			};
		}
		return B(n, r) ? {
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
		let r = e === "weather" ? "weather_entity" : "holiday_entity", i = this.discovery?.[e], a = n.context[r], o = (await U(this, {
			heading: t(e === "weather" ? "pick.weather.title" : "pick.holiday.title"),
			tip: e === "weather" ? "pick_weather" : "pick_holiday",
			filter: e === "weather" ? "weather" : "workday",
			selected: a ? [a] : i ? [i.entity.entity_id] : [],
			suggestions: Mt(i ? [Nt(i)] : [], i?.alternatives)
		}))?.selected[0];
		o && H(this, {
			context: { [r]: o },
			answers: { ignored: V(n, e, !1) }
		});
	}
	ignore(e, t) {
		H(this, {
			...t,
			answers: { ignored: V(this.config, e, !0) }
		});
	}
	confirm(e) {
		let t = this.config.answers.confirmed.filter((t) => t !== e);
		H(this, { answers: { confirmed: [...t, e] } });
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
        <span>${Kt(e, t)}</span>
        ${n.length ? h`<div class="note-actions">${n}</div>` : _}
      </div>
    </div>`;
	}
	count(e, t, n) {
		let [r, i] = e(n).split("|");
		return `${P(e.lang, t, 0)} ${t === 1 ? r : i}`;
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
                ${t.reasons.map((t) => h`<li>${rt(e, t)}</li>`)}
              </ul>
            </details>` : _}
        ${t.notes ?? _}
        ${t.actions?.length ? h`<div class="row-actions">${t.actions}${t.tip ? L(e, t.tip) : _}</div>` : _}
      </div>
    </li>`;
	}
};
A([x({ attribute: !1 })], Y.prototype, "hass", void 0), A([x({ attribute: !1 })], Y.prototype, "t", void 0), A([x({ attribute: !1 })], Y.prototype, "config", void 0), A([x({ attribute: !1 })], Y.prototype, "discovery", void 0), A([x({ attribute: !1 })], Y.prototype, "checks", void 0), A([x()], Y.prototype, "context", void 0), O("joe-review", Y);
//#endregion
//#region src/pages/questions.ts
var Jt = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, Yt = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function Xt(e) {
	let t = [], n = (t) => z(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var X = class extends b {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [k, o`
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
		if (!e || !t) return _;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = Xt(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1;
		return h`<div class="wrap">
      <joe-pose name=${Jt[i.split(":")[0]] ?? "ask"}></joe-pose>
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
      <div class="title-row">${T(e, "h2", L(r, t))}</div>
      ${w}
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
      @joe-choice=${(e) => H(this, { answers: { [t]: r ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => Yt.includes(e));
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
                ${L(e, "f_consumer_kind")}
              </div>
            </div>` : _}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === Bt;
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
			H(this, {
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
          @click=${() => H(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => H(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: Bt }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return h``;
		let i = `capacity:${n}`, a = t.answers[i] === Bt;
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
			H(this, {
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
          @click=${() => H(this, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: Bt }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), H(this, t);
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
A([x({ attribute: !1 })], X.prototype, "hass", void 0), A([x({ attribute: !1 })], X.prototype, "t", void 0), A([x({ attribute: !1 })], X.prototype, "config", void 0), A([x({ attribute: !1 })], X.prototype, "discovery", void 0), A([x()], X.prototype, "single", void 0), A([S()], X.prototype, "index", void 0), O("joe-questions", X);
//#endregion
//#region src/pages/onboarding.ts
function Zt(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${P(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
var Qt = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, Z = class extends b {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [k, o`
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
		if (!e) return _;
		switch (this.step) {
			case "welcome": return this.layout("welcome", h`${T(e("onb.welcome.title"), "h1")} ${w}
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
              ${L(e, "scan_start")}
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
		return this.discovering || !this.discovery && !this.discoveryFailed ? this.layout("scout", h`${T(e("onb.scan.title"))} ${w}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`) : h`<div class="wrap wide">
      <joe-pose name="scout"></joe-pose>
      <div>
        ${T(e("scan.title"))} ${w}
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
            ${L(e, "rescan")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
            ${e("onb.back")}
          </button>
        </div>
      </div>
    </div>`;
	}
	renderDone(e) {
		return this.layout("thumbs", h`${T(e("onb.done.title"))} ${w}
        ${this.config ? this.renderSummary(e, this.config) : _}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${e("onb.done.go")}</button>
            ${L(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`);
	}
	renderSummary(e, t) {
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? _t(n, t.capacity_entity) : null) ?? 0), 0), i = (n, r) => {
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, a = this.discovery?.forecast;
		return h`<div class="lines">
      ${[
			[e("sum.batteries"), t.batteries.length ? e("sum.batteries.value", {
				count: t.batteries.length,
				kwh: r ? P(e.lang, r, 1) : "?"
			}) : e("sum.none")],
			[e("sum.tariff"), t.tariff.kind === "unknown" ? e("sum.unknown") : Gt(e, t.tariff, !1)],
			[e("sum.feed_in"), t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : e("sum.unknown") : `${J(e, t.tariff.feed_in_price)} ct`],
			[e("sum.forecast"), t.forecast.provider ? a ? e("sum.forecast.value", {
				provider: a.provider_name,
				planes: Zt(e, a.planes, "word.plane")
			}) : t.forecast.provider : e("sum.none")],
			[e("sum.heating"), i("heating", Qt)],
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
				persons: Zt(e, t.persons.length, "word.person"),
				calendars: Zt(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
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
A([x()], Z.prototype, "step", void 0), A([x({ attribute: !1 })], Z.prototype, "t", void 0), A([x({ attribute: !1 })], Z.prototype, "info", void 0), A([x({ attribute: !1 })], Z.prototype, "hass", void 0), A([x({ attribute: !1 })], Z.prototype, "config", void 0), A([x({ attribute: !1 })], Z.prototype, "discovery", void 0), A([x({ attribute: !1 })], Z.prototype, "checks", void 0), A([x({ type: Boolean })], Z.prototype, "discovering", void 0), A([x({ type: Boolean })], Z.prototype, "discoveryFailed", void 0), O("joe-onboarding", Z);
//#endregion
//#region src/pages/overview.ts
var $t = class extends b {
	static {
		this.styles = [k, o`
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
		return e ? h`<div class="grid">
      <section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${T(e("overview.night.empty.title"))} ${w}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>
      <section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")}</div>
        ${T(e("overview.sim.empty.title"))} ${w}
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
    </div>` : _;
	}
};
A([x({ attribute: !1 })], $t.prototype, "t", void 0), O("joe-overview", $t);
//#endregion
//#region src/pages/settings.ts
var en = [
	"simulation",
	"off",
	"live"
], tn = [
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
], nn = [
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
], rn = {
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
		super(...e), this.checks = [], this.pro = !1, this.question = "";
	}
	static {
		this.styles = [k, o`
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
		if (!e || !t) return _;
		let n = t.config;
		return h`<div class="list">
        <section class="group">
          <h2>${e("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.mode")}</b>${L(e, "mode")}</div>
              <small>${e("settings.mode.hint")} ${e("settings.live.unavailable")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("settings.mode")}>
              ${en.map((n) => h`<button
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
              <div class="name"><b>${e("settings.setup")}</b>${L(e, "restart")}</div>
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
          ${nn.map((t) => this.answerRow(e, t.key, t.tip))}
        </section>

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
                ${tn.slice(0, 5).map((t) => this.numberRow(e, n.rules, t))}
                ${this.priorityRow(e, n.rules)} ${this.dischargeRow(e, n.rules)}
                ${tn.slice(5).map((t) => this.numberRow(e, n.rules, t))}` : _}
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
	answerRow(e, t, n) {
		let r = this.state.config, i = r.answers[t], a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [], o = i === "unknown" ? e("sum.unknown") : a.length ? a.map((n) => rn[t][n] ? e(rn[t][n]) : n).join(", ") : e("sum.open");
		return h`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`settings.answer.${t}`)}</b>${L(e, n)}</div>
        <small>${o}</small>
      </div>
      <div class="control">
        ${i == null ? _ : D(e, z(r, `answers.${t}`))}
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
		let r = this.state.config, i = t[n.key], a = n.scale ?? 1, o = i == null ? "" : String(Math.round(i * a * 100) / 100), s = this.info?.defaults?.rules[n.key], c = z(r, `rules.${n.key}`), l = c?.source === "user";
		return h`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`rule.${n.key}`)}</b>${L(e, `r_${n.key}`)}</div>
        <small>${e(`rule.${n.key}.hint`)}</small>
      </div>
      <div class="control">
        ${D(e, c)}
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
        ${l && s !== void 0 ? h`<button
              type="button"
              class="mini-btn quiet"
              @click=${() => H(this, { rules: { [n.key]: s } }, "default")}
            >
              <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
            </button>` : _}
      </div>
    </div>`;
	}
	setNumber(e, t) {
		let n = t.value.trim(), r = e.scale ?? 1;
		if (n === "") {
			e.optional && H(this, { rules: { [e.key]: null } });
			return;
		}
		let i = Number.parseFloat(n);
		if (!Number.isFinite(i) || i < e.min || i > e.max) {
			t.reportValidity();
			return;
		}
		let a = e.unit === "min" ? Math.round(i) : Math.round(i / r * 1e4) / 1e4;
		H(this, { rules: { [e.key]: a } });
	}
	priorityRow(e, t) {
		let n = this.state.config, r = t.priority, i = (e, t) => {
			let n = [...r];
			[n[e], n[e + t]] = [n[e + t], n[e]], H(this, { rules: { priority: n } });
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
        <div class="name"><b>${e("rule.priority")}</b>${L(e, "r_priority")}</div>
        <small>${e("rule.priority.hint")}</small>
      </div>
      <div class="control">
        ${D(e, z(n, "rules.priority"))}
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
          <b>${e("rule.discharge_in_window")}</b>${L(e, "r_discharge_in_window")}
          ${D(e, z(n, "rules.discharge_in_window"))}
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
			e.detail.value[0] && H(this, { rules: { discharge_in_window: e.detail.value[0] } });
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
A([x({ attribute: !1 })], Q.prototype, "t", void 0), A([x({ attribute: !1 })], Q.prototype, "hass", void 0), A([x({ attribute: !1 })], Q.prototype, "state", void 0), A([x({ attribute: !1 })], Q.prototype, "info", void 0), A([x({ attribute: !1 })], Q.prototype, "discovery", void 0), A([x({ attribute: !1 })], Q.prototype, "checks", void 0), A([S()], Q.prototype, "pro", void 0), A([S()], Q.prototype, "question", void 0), O("joe-settings", Q);
//#endregion
//#region src/styles/tokens.ts
var an = o`
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
`, on = [
	"simulation",
	"live",
	"off"
], sn = {
	simulation: "mdi:pause",
	live: "mdi:play",
	off: "mdi:power"
}, cn = ["simulation", "off"], ln = {
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
}, $ = class extends b {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
			this.picker = e.detail;
		}), this.addEventListener("joe-edit", (e) => {
			this.editor = e.detail;
		});
	}
	get t() {
		return et(this.hass?.language);
	}
	get page() {
		let e = (this.route?.path ?? "").split("/")[1] ?? "";
		return Lt.includes(e) ? e : "overview";
	}
	connectedCallback() {
		super.connectedCallback(), Wt(), this.subscribe();
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
		if (this.failed) return h`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return h`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return h`
      <header>
        ${this.joe.mode === "simulation" ? h`<div class="simband" aria-hidden="true"></div>` : _}
        <div class="bar">
          ${this.narrow ? h`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : _}
          <div class="brand">
            <img class="light" src=${C("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${C("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? h`<div class="notice" role="alert">${this.notice}</div>` : _}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-set-mode=${(e) => this.setMode(e.detail.mode)}
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
      ${Lt.map((t) => h`<a
            href=${this.href(t)}
            class=${t === this.page ? "on" : ""}
            aria-current=${t === this.page ? "page" : "false"}
            @click=${(e) => this.navigate(e, t)}
            >${e(`tab.${t}`)}</a
          >`)}
    </nav>`;
	}
	renderSteps(e) {
		let t = Ft.indexOf(this.joe?.onboarding.step ?? "welcome");
		return h`<ol class="steps" aria-label=${e("steps.label")}>
      ${Ft.map((n, r) => h`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.page;
		if (t === "overview") return h`<joe-overview .t=${e}></joe-overview>`;
		if (t === "settings") return h`<joe-settings
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        .info=${this.info}
        .discovery=${this.discovery}
        .checks=${this.checks}
      ></joe-settings>`;
		let n = ln[t];
		return n ? h`<joe-empty-state
          pose=${n.pose}
          heading=${e(n.title)}
          text=${e(n.text)}
          note=${e("soon")}
        ></joe-empty-state>` : h``;
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
          <div id="mode-title">${T(e("mode.dialog.title"), "h2", L(e, "mode"))}</div>
          ${w}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${on.map((n) => {
			let r = cn.includes(n);
			return h`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${sn[n]}></ha-icon></span>
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
				a = e("edit.household.label"), i = h`<div class="sheet-title">${T(e("edit.household.title"), "h2", L(e, "q_household"))}</div>
          <joe-household .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
				break;
			case "consumers": a = e("edit.consumers.label"), o = !0, i = h`<div class="sheet-title">${T(e("edit.consumers.title"))}</div>
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
			an,
			k,
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
A([x({ attribute: !1 })], $.prototype, "hass", void 0), A([x({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), A([x({ attribute: !1 })], $.prototype, "route", void 0), A([S()], $.prototype, "joe", void 0), A([S()], $.prototype, "info", void 0), A([S()], $.prototype, "failed", void 0), A([S()], $.prototype, "modeDialog", void 0), A([S()], $.prototype, "notice", void 0), A([S()], $.prototype, "discovery", void 0), A([S()], $.prototype, "discovering", void 0), A([S()], $.prototype, "discoveryFailed", void 0), A([S()], $.prototype, "checks", void 0), A([S()], $.prototype, "picker", void 0), A([S()], $.prototype, "editor", void 0), O("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
