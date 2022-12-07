import { gql as Yt, getClient as Xt } from "https://tfl.dev/@truffle/api@^0.2.0/client.ts";
const At = {}, Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: At
}, Symbol.toStringTag, { value: "Module" }));
function te(t) {
  var e = t.default;
  if (typeof e == "function") {
    var r = function() {
      return e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else
    r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(t).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(t, n);
    Object.defineProperty(r, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[n];
      }
    });
  }), r;
}
const M = /* @__PURE__ */ te(Jt);
var vt = {}, Q = M, x = process.platform === "win32", B = M, ee = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
function re() {
  var t;
  if (ee) {
    var e = new Error();
    t = r;
  } else
    t = n;
  return t;
  function r(i) {
    i && (e.message = i.message, i = e, n(i));
  }
  function n(i) {
    if (i) {
      if (process.throwDeprecation)
        throw i;
      if (!process.noDeprecation) {
        var c = "fs: missing callback " + (i.stack || i.message);
        process.traceDeprecation ? console.trace(c) : console.error(c);
      }
    }
  }
}
function ne(t) {
  return typeof t == "function" ? t : re();
}
Q.normalize;
if (x)
  var q = /(.*?)(?:[\/\\]+|$)/g;
else
  var q = /(.*?)(?:[\/]+|$)/g;
if (x)
  var gt = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
else
  var gt = /^[\/]*/;
vt.realpathSync = function(e, r) {
  if (e = Q.resolve(e), r && Object.prototype.hasOwnProperty.call(r, e))
    return r[e];
  var n = e, i = {}, c = {}, l, d, v, b;
  E();
  function E() {
    var w = gt.exec(e);
    l = w[0].length, d = w[0], v = w[0], b = "", x && !c[v] && (B.lstatSync(v), c[v] = !0);
  }
  for (; l < e.length; ) {
    q.lastIndex = l;
    var O = q.exec(e);
    if (b = d, d += O[0], v = b + O[1], l = q.lastIndex, !(c[v] || r && r[v] === v)) {
      var o;
      if (r && Object.prototype.hasOwnProperty.call(r, v))
        o = r[v];
      else {
        var p = B.lstatSync(v);
        if (!p.isSymbolicLink()) {
          c[v] = !0, r && (r[v] = v);
          continue;
        }
        var g = null;
        if (!x) {
          var m = p.dev.toString(32) + ":" + p.ino.toString(32);
          i.hasOwnProperty(m) && (g = i[m]);
        }
        g === null && (B.statSync(v), g = B.readlinkSync(v)), o = Q.resolve(b, g), r && (r[v] = o), x || (i[m] = g);
      }
      e = Q.resolve(o, e.slice(l)), E();
    }
  }
  return r && (r[n] = e), e;
};
vt.realpath = function(e, r, n) {
  if (typeof n != "function" && (n = ne(r), r = null), e = Q.resolve(e), r && Object.prototype.hasOwnProperty.call(r, e))
    return process.nextTick(n.bind(null, null, r[e]));
  var i = e, c = {}, l = {}, d, v, b, E;
  O();
  function O() {
    var w = gt.exec(e);
    d = w[0].length, v = w[0], b = w[0], E = "", x && !l[b] ? B.lstat(b, function(A) {
      if (A)
        return n(A);
      l[b] = !0, o();
    }) : process.nextTick(o);
  }
  function o() {
    if (d >= e.length)
      return r && (r[i] = e), n(null, e);
    q.lastIndex = d;
    var w = q.exec(e);
    return E = v, v += w[0], b = E + w[1], d = q.lastIndex, l[b] || r && r[b] === b ? process.nextTick(o) : r && Object.prototype.hasOwnProperty.call(r, b) ? m(r[b]) : B.lstat(b, p);
  }
  function p(w, A) {
    if (w)
      return n(w);
    if (!A.isSymbolicLink())
      return l[b] = !0, r && (r[b] = b), process.nextTick(o);
    if (!x) {
      var _ = A.dev.toString(32) + ":" + A.ino.toString(32);
      if (c.hasOwnProperty(_))
        return g(null, c[_], b);
    }
    B.stat(b, function(I) {
      if (I)
        return n(I);
      B.readlink(b, function(a, s) {
        x || (c[_] = s), g(a, s);
      });
    });
  }
  function g(w, A, _) {
    if (w)
      return n(w);
    var I = Q.resolve(E, A);
    r && (r[_] = I), m(I);
  }
  function m(w) {
    e = Q.resolve(w, e.slice(d)), O();
  }
};
var jt = U;
U.realpath = U;
U.sync = mt;
U.realpathSync = mt;
U.monkeypatch = se;
U.unmonkeypatch = ae;
var H = M, ct = H.realpath, ht = H.realpathSync, ie = process.version, It = /^v[0-5]\./.test(ie), Rt = vt;
function $t(t) {
  return t && t.syscall === "realpath" && (t.code === "ELOOP" || t.code === "ENOMEM" || t.code === "ENAMETOOLONG");
}
function U(t, e, r) {
  if (It)
    return ct(t, e, r);
  typeof e == "function" && (r = e, e = null), ct(t, e, function(n, i) {
    $t(n) ? Rt.realpath(t, e, r) : r(n, i);
  });
}
function mt(t, e) {
  if (It)
    return ht(t, e);
  try {
    return ht(t, e);
  } catch (r) {
    if ($t(r))
      return Rt.realpathSync(t, e);
    throw r;
  }
}
function se() {
  H.realpath = U, H.realpathSync = mt;
}
function ae() {
  H.realpath = ct, H.realpathSync = ht;
}
const oe = typeof process == "object" && process && process.platform === "win32";
var ce = oe ? { sep: "\\" } : { sep: "/" }, he = Dt;
function Dt(t, e, r) {
  t instanceof RegExp && (t = _t(t, r)), e instanceof RegExp && (e = _t(e, r));
  var n = Mt(t, e, r);
  return n && {
    start: n[0],
    end: n[1],
    pre: r.slice(0, n[0]),
    body: r.slice(n[0] + t.length, n[1]),
    post: r.slice(n[1] + e.length)
  };
}
function _t(t, e) {
  var r = e.match(t);
  return r ? r[0] : null;
}
Dt.range = Mt;
function Mt(t, e, r) {
  var n, i, c, l, d, v = r.indexOf(t), b = r.indexOf(e, v + 1), E = v;
  if (v >= 0 && b > 0) {
    if (t === e)
      return [v, b];
    for (n = [], c = r.length; E >= 0 && !d; )
      E == v ? (n.push(E), v = r.indexOf(t, E + 1)) : n.length == 1 ? d = [n.pop(), b] : (i = n.pop(), i < c && (c = i, l = b), b = r.indexOf(e, E + 1)), E = v < b && v >= 0 ? v : b;
    n.length && (d = [c, l]);
  }
  return d;
}
var Lt = he, ue = pe, Nt = "\0SLASH" + Math.random() + "\0", Pt = "\0OPEN" + Math.random() + "\0", yt = "\0CLOSE" + Math.random() + "\0", Tt = "\0COMMA" + Math.random() + "\0", Ct = "\0PERIOD" + Math.random() + "\0";
function it(t) {
  return parseInt(t, 10) == t ? parseInt(t, 10) : t.charCodeAt(0);
}
function le(t) {
  return t.split("\\\\").join(Nt).split("\\{").join(Pt).split("\\}").join(yt).split("\\,").join(Tt).split("\\.").join(Ct);
}
function fe(t) {
  return t.split(Nt).join("\\").split(Pt).join("{").split(yt).join("}").split(Tt).join(",").split(Ct).join(".");
}
function Gt(t) {
  if (!t)
    return [""];
  var e = [], r = Lt("{", "}", t);
  if (!r)
    return t.split(",");
  var n = r.pre, i = r.body, c = r.post, l = n.split(",");
  l[l.length - 1] += "{" + i + "}";
  var d = Gt(c);
  return c.length && (l[l.length - 1] += d.shift(), l.push.apply(l, d)), e.push.apply(e, l), e;
}
function pe(t) {
  return t ? (t.substr(0, 2) === "{}" && (t = "\\{\\}" + t.substr(2)), Z(le(t), !0).map(fe)) : [];
}
function de(t) {
  return "{" + t + "}";
}
function ve(t) {
  return /^-?0\d/.test(t);
}
function ge(t, e) {
  return t <= e;
}
function me(t, e) {
  return t >= e;
}
function Z(t, e) {
  var r = [], n = Lt("{", "}", t);
  if (!n)
    return [t];
  var i = n.pre, c = n.post.length ? Z(n.post, !1) : [""];
  if (/\$$/.test(n.pre))
    for (var l = 0; l < c.length; l++) {
      var d = i + "{" + n.body + "}" + c[l];
      r.push(d);
    }
  else {
    var v = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(n.body), b = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(n.body), E = v || b, O = n.body.indexOf(",") >= 0;
    if (!E && !O)
      return n.post.match(/,.*\}/) ? (t = n.pre + "{" + n.body + yt + n.post, Z(t)) : [t];
    var o;
    if (E)
      o = n.body.split(/\.\./);
    else if (o = Gt(n.body), o.length === 1 && (o = Z(o[0], !1).map(de), o.length === 1))
      return c.map(function(S) {
        return n.pre + o[0] + S;
      });
    var p;
    if (E) {
      var g = it(o[0]), m = it(o[1]), w = Math.max(o[0].length, o[1].length), A = o.length == 3 ? Math.abs(it(o[2])) : 1, _ = ge, I = m < g;
      I && (A *= -1, _ = me);
      var a = o.some(ve);
      p = [];
      for (var s = g; _(s, m); s += A) {
        var u;
        if (b)
          u = String.fromCharCode(s), u === "\\" && (u = "");
        else if (u = String(s), a) {
          var f = w - u.length;
          if (f > 0) {
            var h = new Array(f + 1).join("0");
            s < 0 ? u = "-" + h + u.slice(1) : u = h + u;
          }
        }
        p.push(u);
      }
    } else {
      p = [];
      for (var y = 0; y < o.length; y++)
        p.push.apply(p, Z(o[y], !1));
    }
    for (var y = 0; y < p.length; y++)
      for (var l = 0; l < c.length; l++) {
        var d = i + p[y] + c[l];
        (!e || E || d) && r.push(d);
      }
  }
  return r;
}
const L = et = (t, e, r = {}) => (tt(e), !r.nocomment && e.charAt(0) === "#" ? !1 : new rt(e, r).match(t));
var et = L;
const ut = ce;
L.sep = ut.sep;
const N = Symbol("globstar **");
L.GLOBSTAR = N;
const ye = ue, wt = {
  "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
  "?": { open: "(?:", close: ")?" },
  "+": { open: "(?:", close: ")+" },
  "*": { open: "(?:", close: ")*" },
  "@": { open: "(?:", close: ")" }
}, lt = "[^/]", st = lt + "*?", be = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", _e = "(?:(?!(?:\\/|^)\\.).)*?", Ft = (t) => t.split("").reduce((e, r) => (e[r] = !0, e), {}), Et = Ft("().*{}+?[]^$\\!"), we = Ft("[.("), kt = /\/+/;
L.filter = (t, e = {}) => (r, n, i) => L(r, t, e);
const F = (t, e = {}) => {
  const r = {};
  return Object.keys(t).forEach((n) => r[n] = t[n]), Object.keys(e).forEach((n) => r[n] = e[n]), r;
};
L.defaults = (t) => {
  if (!t || typeof t != "object" || !Object.keys(t).length)
    return L;
  const e = L, r = (n, i, c) => e(n, i, F(t, c));
  return r.Minimatch = class extends e.Minimatch {
    constructor(i, c) {
      super(i, F(t, c));
    }
  }, r.Minimatch.defaults = (n) => e.defaults(F(t, n)).Minimatch, r.filter = (n, i) => e.filter(n, F(t, i)), r.defaults = (n) => e.defaults(F(t, n)), r.makeRe = (n, i) => e.makeRe(n, F(t, i)), r.braceExpand = (n, i) => e.braceExpand(n, F(t, i)), r.match = (n, i, c) => e.match(n, i, F(t, c)), r;
};
L.braceExpand = (t, e) => Bt(t, e);
const Bt = (t, e = {}) => (tt(t), e.nobrace || !/\{(?:(?!\{).)*\}/.test(t) ? [t] : ye(t)), Ee = 1024 * 64, tt = (t) => {
  if (typeof t != "string")
    throw new TypeError("invalid pattern");
  if (t.length > Ee)
    throw new TypeError("pattern is too long");
}, X = Symbol("subparse");
L.makeRe = (t, e) => new rt(t, e || {}).makeRe();
L.match = (t, e, r = {}) => {
  const n = new rt(e, r);
  return t = t.filter((i) => n.match(i)), n.options.nonull && !t.length && t.push(e), t;
};
const ke = (t) => t.replace(/\\(.)/g, "$1"), Oe = (t) => t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
class rt {
  constructor(e, r) {
    tt(e), r || (r = {}), this.options = r, this.set = [], this.pattern = e, this.windowsPathsNoEscape = !!r.windowsPathsNoEscape || r.allowWindowsEscape === !1, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!r.partial, this.make();
  }
  debug() {
  }
  make() {
    const e = this.pattern, r = this.options;
    if (!r.nocomment && e.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!e) {
      this.empty = !0;
      return;
    }
    this.parseNegate();
    let n = this.globSet = this.braceExpand();
    r.debug && (this.debug = (...i) => console.error(...i)), this.debug(this.pattern, n), n = this.globParts = n.map((i) => i.split(kt)), this.debug(this.pattern, n), n = n.map((i, c, l) => i.map(this.parse, this)), this.debug(this.pattern, n), n = n.filter((i) => i.indexOf(!1) === -1), this.debug(this.pattern, n), this.set = n;
  }
  parseNegate() {
    if (this.options.nonegate)
      return;
    const e = this.pattern;
    let r = !1, n = 0;
    for (let i = 0; i < e.length && e.charAt(i) === "!"; i++)
      r = !r, n++;
    n && (this.pattern = e.substr(n)), this.negate = r;
  }
  matchOne(e, r, n) {
    var i = this.options;
    this.debug("matchOne", { this: this, file: e, pattern: r }), this.debug("matchOne", e.length, r.length);
    for (var c = 0, l = 0, d = e.length, v = r.length; c < d && l < v; c++, l++) {
      this.debug("matchOne loop");
      var b = r[l], E = e[c];
      if (this.debug(r, b, E), b === !1)
        return !1;
      if (b === N) {
        this.debug("GLOBSTAR", [r, b, E]);
        var O = c, o = l + 1;
        if (o === v) {
          for (this.debug("** at the end"); c < d; c++)
            if (e[c] === "." || e[c] === ".." || !i.dot && e[c].charAt(0) === ".")
              return !1;
          return !0;
        }
        for (; O < d; ) {
          var p = e[O];
          if (this.debug(`
globstar while`, e, O, r, o, p), this.matchOne(e.slice(O), r.slice(o), n))
            return this.debug("globstar found match!", O, d, p), !0;
          if (p === "." || p === ".." || !i.dot && p.charAt(0) === ".") {
            this.debug("dot detected!", e, O, r, o);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), O++;
        }
        return !!(n && (this.debug(`
>>> no match, partial?`, e, O, r, o), O === d));
      }
      var g;
      if (typeof b == "string" ? (g = E === b, this.debug("string match", b, E, g)) : (g = E.match(b), this.debug("pattern match", b, E, g)), !g)
        return !1;
    }
    if (c === d && l === v)
      return !0;
    if (c === d)
      return n;
    if (l === v)
      return c === d - 1 && e[c] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return Bt(this.pattern, this.options);
  }
  parse(e, r) {
    tt(e);
    const n = this.options;
    if (e === "**")
      if (n.noglobstar)
        e = "*";
      else
        return N;
    if (e === "")
      return "";
    let i = "", c = !!n.nocase, l = !1;
    const d = [], v = [];
    let b, E = !1, O = -1, o = -1, p, g, m;
    const w = e.charAt(0) === "." ? "" : n.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", A = () => {
      if (b) {
        switch (b) {
          case "*":
            i += st, c = !0;
            break;
          case "?":
            i += lt, c = !0;
            break;
          default:
            i += "\\" + b;
            break;
        }
        this.debug("clearStateChar %j %j", b, i), b = !1;
      }
    };
    for (let a = 0, s; a < e.length && (s = e.charAt(a)); a++) {
      if (this.debug("%s	%s %s %j", e, a, i, s), l) {
        if (s === "/")
          return !1;
        Et[s] && (i += "\\"), i += s, l = !1;
        continue;
      }
      switch (s) {
        case "/":
          return !1;
        case "\\":
          A(), l = !0;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", e, a, i, s), E) {
            this.debug("  in class"), s === "!" && a === o + 1 && (s = "^"), i += s;
            continue;
          }
          this.debug("call clearStateChar %j", b), A(), b = s, n.noext && A();
          continue;
        case "(":
          if (E) {
            i += "(";
            continue;
          }
          if (!b) {
            i += "\\(";
            continue;
          }
          d.push({
            type: b,
            start: a - 1,
            reStart: i.length,
            open: wt[b].open,
            close: wt[b].close
          }), i += b === "!" ? "(?:(?!(?:" : "(?:", this.debug("plType %j %j", b, i), b = !1;
          continue;
        case ")":
          if (E || !d.length) {
            i += "\\)";
            continue;
          }
          A(), c = !0, g = d.pop(), i += g.close, g.type === "!" && v.push(g), g.reEnd = i.length;
          continue;
        case "|":
          if (E || !d.length) {
            i += "\\|";
            continue;
          }
          A(), i += "|";
          continue;
        case "[":
          if (A(), E) {
            i += "\\" + s;
            continue;
          }
          E = !0, o = a, O = i.length, i += s;
          continue;
        case "]":
          if (a === o + 1 || !E) {
            i += "\\" + s;
            continue;
          }
          p = e.substring(o + 1, a);
          try {
            RegExp("[" + p + "]");
          } catch {
            m = this.parse(p, X), i = i.substr(0, O) + "\\[" + m[0] + "\\]", c = c || m[1], E = !1;
            continue;
          }
          c = !0, E = !1, i += s;
          continue;
        default:
          A(), Et[s] && !(s === "^" && E) && (i += "\\"), i += s;
          break;
      }
    }
    for (E && (p = e.substr(o + 1), m = this.parse(p, X), i = i.substr(0, O) + "\\[" + m[0], c = c || m[1]), g = d.pop(); g; g = d.pop()) {
      let a;
      a = i.slice(g.reStart + g.open.length), this.debug("setting tail", i, g), a = a.replace(/((?:\\{2}){0,64})(\\?)\|/g, (u, f, h) => (h || (h = "\\"), f + f + h + "|")), this.debug(`tail=%j
   %s`, a, a, g, i);
      const s = g.type === "*" ? st : g.type === "?" ? lt : "\\" + g.type;
      c = !0, i = i.slice(0, g.reStart) + s + "\\(" + a;
    }
    A(), l && (i += "\\\\");
    const _ = we[i.charAt(0)];
    for (let a = v.length - 1; a > -1; a--) {
      const s = v[a], u = i.slice(0, s.reStart), f = i.slice(s.reStart, s.reEnd - 8);
      let h = i.slice(s.reEnd);
      const y = i.slice(s.reEnd - 8, s.reEnd) + h, S = u.split("(").length - 1;
      let k = h;
      for (let $ = 0; $ < S; $++)
        k = k.replace(/\)[+*?]?/, "");
      h = k;
      const j = h === "" && r !== X ? "$" : "";
      i = u + f + h + j + y;
    }
    if (i !== "" && c && (i = "(?=.)" + i), _ && (i = w + i), r === X)
      return [i, c];
    if (!c)
      return ke(e);
    const I = n.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + i + "$", I), {
        _glob: e,
        _src: i
      });
    } catch {
      return new RegExp("$.");
    }
  }
  makeRe() {
    if (this.regexp || this.regexp === !1)
      return this.regexp;
    const e = this.set;
    if (!e.length)
      return this.regexp = !1, this.regexp;
    const r = this.options, n = r.noglobstar ? st : r.dot ? be : _e, i = r.nocase ? "i" : "";
    let c = e.map((l) => (l = l.map((d) => typeof d == "string" ? Oe(d) : d === N ? N : d._src).reduce((d, v) => (d[d.length - 1] === N && v === N || d.push(v), d), []), l.forEach((d, v) => {
      d !== N || l[v - 1] === N || (v === 0 ? l.length > 1 ? l[v + 1] = "(?:\\/|" + n + "\\/)?" + l[v + 1] : l[v] = n : v === l.length - 1 ? l[v - 1] += "(?:\\/|" + n + ")?" : (l[v - 1] += "(?:\\/|\\/" + n + "\\/)" + l[v + 1], l[v + 1] = N));
    }), l.filter((d) => d !== N).join("/"))).join("|");
    c = "^(?:" + c + ")$", this.negate && (c = "^(?!" + c + ").*$");
    try {
      this.regexp = new RegExp(c, i);
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  match(e, r = this.partial) {
    if (this.debug("match", e, this.pattern), this.comment)
      return !1;
    if (this.empty)
      return e === "";
    if (e === "/" && r)
      return !0;
    const n = this.options;
    ut.sep !== "/" && (e = e.split(ut.sep).join("/")), e = e.split(kt), this.debug(this.pattern, "split", e);
    const i = this.set;
    this.debug(this.pattern, "set", i);
    let c;
    for (let l = e.length - 1; l >= 0 && (c = e[l], !c); l--)
      ;
    for (let l = 0; l < i.length; l++) {
      const d = i[l];
      let v = e;
      if (n.matchBase && d.length === 1 && (v = [c]), this.matchOne(v, d, r))
        return n.flipNegate ? !0 : !this.negate;
    }
    return n.flipNegate ? !1 : this.negate;
  }
  static defaults(e) {
    return L.defaults(e).Minimatch;
  }
}
L.Minimatch = rt;
var ft = { exports: {} };
typeof Object.create == "function" ? ft.exports = function(e, r) {
  r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : ft.exports = function(e, r) {
  if (r) {
    e.super_ = r;
    var n = function() {
    };
    n.prototype = r.prototype, e.prototype = new n(), e.prototype.constructor = e;
  }
};
var C = {};
C.setopts = $e;
C.ownProp = xt;
C.makeAbs = Y;
C.finish = De;
C.mark = Me;
C.isIgnored = Wt;
C.childrenIgnored = Le;
function xt(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
var Se = M, W = M, Ae = et, Ut = M.isAbsolute, pt = Ae.Minimatch;
function je(t, e) {
  return t.localeCompare(e, "en");
}
function Ie(t, e) {
  t.ignore = e.ignore || [], Array.isArray(t.ignore) || (t.ignore = [t.ignore]), t.ignore.length && (t.ignore = t.ignore.map(Re));
}
function Re(t) {
  var e = null;
  if (t.slice(-3) === "/**") {
    var r = t.replace(/(\/\*\*)+$/, "");
    e = new pt(r, { dot: !0 });
  }
  return {
    matcher: new pt(t, { dot: !0 }),
    gmatcher: e
  };
}
function $e(t, e, r) {
  if (r || (r = {}), r.matchBase && e.indexOf("/") === -1) {
    if (r.noglobstar)
      throw new Error("base matching requires globstar");
    e = "**/" + e;
  }
  t.silent = !!r.silent, t.pattern = e, t.strict = r.strict !== !1, t.realpath = !!r.realpath, t.realpathCache = r.realpathCache || /* @__PURE__ */ Object.create(null), t.follow = !!r.follow, t.dot = !!r.dot, t.mark = !!r.mark, t.nodir = !!r.nodir, t.nodir && (t.mark = !0), t.sync = !!r.sync, t.nounique = !!r.nounique, t.nonull = !!r.nonull, t.nosort = !!r.nosort, t.nocase = !!r.nocase, t.stat = !!r.stat, t.noprocess = !!r.noprocess, t.absolute = !!r.absolute, t.fs = r.fs || Se, t.maxLength = r.maxLength || 1 / 0, t.cache = r.cache || /* @__PURE__ */ Object.create(null), t.statCache = r.statCache || /* @__PURE__ */ Object.create(null), t.symlinks = r.symlinks || /* @__PURE__ */ Object.create(null), Ie(t, r), t.changedCwd = !1;
  var n = process.cwd();
  xt(r, "cwd") ? (t.cwd = W.resolve(r.cwd), t.changedCwd = t.cwd !== n) : t.cwd = W.resolve(n), t.root = r.root || W.resolve(t.cwd, "/"), t.root = W.resolve(t.root), t.cwdAbs = Ut(t.cwd) ? t.cwd : Y(t, t.cwd), t.nomount = !!r.nomount, process.platform === "win32" && (t.root = t.root.replace(/\\/g, "/"), t.cwd = t.cwd.replace(/\\/g, "/"), t.cwdAbs = t.cwdAbs.replace(/\\/g, "/")), r.nonegate = !0, r.nocomment = !0, r.allowWindowsEscape = !0, t.minimatch = new pt(e, r), t.options = t.minimatch.options;
}
function De(t) {
  for (var e = t.nounique, r = e ? [] : /* @__PURE__ */ Object.create(null), n = 0, i = t.matches.length; n < i; n++) {
    var c = t.matches[n];
    if (!c || Object.keys(c).length === 0) {
      if (t.nonull) {
        var l = t.minimatch.globSet[n];
        e ? r.push(l) : r[l] = !0;
      }
    } else {
      var d = Object.keys(c);
      e ? r.push.apply(r, d) : d.forEach(function(v) {
        r[v] = !0;
      });
    }
  }
  if (e || (r = Object.keys(r)), t.nosort || (r = r.sort(je)), t.mark) {
    for (var n = 0; n < r.length; n++)
      r[n] = t._mark(r[n]);
    t.nodir && (r = r.filter(function(v) {
      var b = !/\/$/.test(v), E = t.cache[v] || t.cache[Y(t, v)];
      return b && E && (b = E !== "DIR" && !Array.isArray(E)), b;
    }));
  }
  t.ignore.length && (r = r.filter(function(v) {
    return !Wt(t, v);
  })), t.found = r;
}
function Me(t, e) {
  var r = Y(t, e), n = t.cache[r], i = e;
  if (n) {
    var c = n === "DIR" || Array.isArray(n), l = e.slice(-1) === "/";
    if (c && !l ? i += "/" : !c && l && (i = i.slice(0, -1)), i !== e) {
      var d = Y(t, i);
      t.statCache[d] = t.statCache[r], t.cache[d] = t.cache[r];
    }
  }
  return i;
}
function Y(t, e) {
  var r = e;
  return e.charAt(0) === "/" ? r = W.join(t.root, e) : Ut(e) || e === "" ? r = e : t.changedCwd ? r = W.resolve(t.cwd, e) : r = W.resolve(e), process.platform === "win32" && (r = r.replace(/\\/g, "/")), r;
}
function Wt(t, e) {
  return t.ignore.length ? t.ignore.some(function(r) {
    return r.matcher.match(e) || !!(r.gmatcher && r.gmatcher.match(e));
  }) : !1;
}
function Le(t, e) {
  return t.ignore.length ? t.ignore.some(function(r) {
    return !!(r.gmatcher && r.gmatcher.match(e));
  }) : !1;
}
var at, Ot;
function Ne() {
  if (Ot)
    return at;
  Ot = 1, at = E, E.GlobSync = O;
  var t = jt, e = et;
  e.Minimatch, zt().Glob;
  var r = M, n = M, i = M.isAbsolute, c = C, l = c.setopts, d = c.ownProp, v = c.childrenIgnored, b = c.isIgnored;
  function E(o, p) {
    if (typeof p == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    return new O(o, p).found;
  }
  function O(o, p) {
    if (!o)
      throw new Error("must provide pattern");
    if (typeof p == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    if (!(this instanceof O))
      return new O(o, p);
    if (l(this, o, p), this.noprocess)
      return this;
    var g = this.minimatch.set.length;
    this.matches = new Array(g);
    for (var m = 0; m < g; m++)
      this._process(this.minimatch.set[m], m, !1);
    this._finish();
  }
  return O.prototype._finish = function() {
    if (n.ok(this instanceof O), this.realpath) {
      var o = this;
      this.matches.forEach(function(p, g) {
        var m = o.matches[g] = /* @__PURE__ */ Object.create(null);
        for (var w in p)
          try {
            w = o._makeAbs(w);
            var A = t.realpathSync(w, o.realpathCache);
            m[A] = !0;
          } catch (_) {
            if (_.syscall === "stat")
              m[o._makeAbs(w)] = !0;
            else
              throw _;
          }
      });
    }
    c.finish(this);
  }, O.prototype._process = function(o, p, g) {
    n.ok(this instanceof O);
    for (var m = 0; typeof o[m] == "string"; )
      m++;
    var w;
    switch (m) {
      case o.length:
        this._processSimple(o.join("/"), p);
        return;
      case 0:
        w = null;
        break;
      default:
        w = o.slice(0, m).join("/");
        break;
    }
    var A = o.slice(m), _;
    w === null ? _ = "." : ((i(w) || i(o.map(function(s) {
      return typeof s == "string" ? s : "[*]";
    }).join("/"))) && (!w || !i(w)) && (w = "/" + w), _ = w);
    var I = this._makeAbs(_);
    if (!v(this, _)) {
      var a = A[0] === e.GLOBSTAR;
      a ? this._processGlobStar(w, _, I, A, p, g) : this._processReaddir(w, _, I, A, p, g);
    }
  }, O.prototype._processReaddir = function(o, p, g, m, w, A) {
    var _ = this._readdir(g, A);
    if (!!_) {
      for (var I = m[0], a = !!this.minimatch.negate, s = I._glob, u = this.dot || s.charAt(0) === ".", f = [], h = 0; h < _.length; h++) {
        var y = _[h];
        if (y.charAt(0) !== "." || u) {
          var S;
          a && !o ? S = !y.match(I) : S = y.match(I), S && f.push(y);
        }
      }
      var k = f.length;
      if (k !== 0) {
        if (m.length === 1 && !this.mark && !this.stat) {
          this.matches[w] || (this.matches[w] = /* @__PURE__ */ Object.create(null));
          for (var h = 0; h < k; h++) {
            var y = f[h];
            o && (o.slice(-1) !== "/" ? y = o + "/" + y : y = o + y), y.charAt(0) === "/" && !this.nomount && (y = r.join(this.root, y)), this._emitMatch(w, y);
          }
          return;
        }
        m.shift();
        for (var h = 0; h < k; h++) {
          var y = f[h], j;
          o ? j = [o, y] : j = [y], this._process(j.concat(m), w, A);
        }
      }
    }
  }, O.prototype._emitMatch = function(o, p) {
    if (!b(this, p)) {
      var g = this._makeAbs(p);
      if (this.mark && (p = this._mark(p)), this.absolute && (p = g), !this.matches[o][p]) {
        if (this.nodir) {
          var m = this.cache[g];
          if (m === "DIR" || Array.isArray(m))
            return;
        }
        this.matches[o][p] = !0, this.stat && this._stat(p);
      }
    }
  }, O.prototype._readdirInGlobStar = function(o) {
    if (this.follow)
      return this._readdir(o, !1);
    var p, g;
    try {
      g = this.fs.lstatSync(o);
    } catch (w) {
      if (w.code === "ENOENT")
        return null;
    }
    var m = g && g.isSymbolicLink();
    return this.symlinks[o] = m, !m && g && !g.isDirectory() ? this.cache[o] = "FILE" : p = this._readdir(o, !1), p;
  }, O.prototype._readdir = function(o, p) {
    if (p && !d(this.symlinks, o))
      return this._readdirInGlobStar(o);
    if (d(this.cache, o)) {
      var g = this.cache[o];
      if (!g || g === "FILE")
        return null;
      if (Array.isArray(g))
        return g;
    }
    try {
      return this._readdirEntries(o, this.fs.readdirSync(o));
    } catch (m) {
      return this._readdirError(o, m), null;
    }
  }, O.prototype._readdirEntries = function(o, p) {
    if (!this.mark && !this.stat)
      for (var g = 0; g < p.length; g++) {
        var m = p[g];
        o === "/" ? m = o + m : m = o + "/" + m, this.cache[m] = !0;
      }
    return this.cache[o] = p, p;
  }, O.prototype._readdirError = function(o, p) {
    switch (p.code) {
      case "ENOTSUP":
      case "ENOTDIR":
        var g = this._makeAbs(o);
        if (this.cache[g] = "FILE", g === this.cwdAbs) {
          var m = new Error(p.code + " invalid cwd " + this.cwd);
          throw m.path = this.cwd, m.code = p.code, m;
        }
        break;
      case "ENOENT":
      case "ELOOP":
      case "ENAMETOOLONG":
      case "UNKNOWN":
        this.cache[this._makeAbs(o)] = !1;
        break;
      default:
        if (this.cache[this._makeAbs(o)] = !1, this.strict)
          throw p;
        this.silent || console.error("glob error", p);
        break;
    }
  }, O.prototype._processGlobStar = function(o, p, g, m, w, A) {
    var _ = this._readdir(g, A);
    if (!!_) {
      var I = m.slice(1), a = o ? [o] : [], s = a.concat(I);
      this._process(s, w, !1);
      var u = _.length, f = this.symlinks[g];
      if (!(f && A))
        for (var h = 0; h < u; h++) {
          var y = _[h];
          if (!(y.charAt(0) === "." && !this.dot)) {
            var S = a.concat(_[h], I);
            this._process(S, w, !0);
            var k = a.concat(_[h], m);
            this._process(k, w, !0);
          }
        }
    }
  }, O.prototype._processSimple = function(o, p) {
    var g = this._stat(o);
    if (this.matches[p] || (this.matches[p] = /* @__PURE__ */ Object.create(null)), !!g) {
      if (o && i(o) && !this.nomount) {
        var m = /[\/\\]$/.test(o);
        o.charAt(0) === "/" ? o = r.join(this.root, o) : (o = r.resolve(this.root, o), m && (o += "/"));
      }
      process.platform === "win32" && (o = o.replace(/\\/g, "/")), this._emitMatch(p, o);
    }
  }, O.prototype._stat = function(o) {
    var p = this._makeAbs(o), g = o.slice(-1) === "/";
    if (o.length > this.maxLength)
      return !1;
    if (!this.stat && d(this.cache, p)) {
      var A = this.cache[p];
      if (Array.isArray(A) && (A = "DIR"), !g || A === "DIR")
        return A;
      if (g && A === "FILE")
        return !1;
    }
    var m = this.statCache[p];
    if (!m) {
      var w;
      try {
        w = this.fs.lstatSync(p);
      } catch (_) {
        if (_ && (_.code === "ENOENT" || _.code === "ENOTDIR"))
          return this.statCache[p] = !1, !1;
      }
      if (w && w.isSymbolicLink())
        try {
          m = this.fs.statSync(p);
        } catch {
          m = w;
        }
      else
        m = w;
    }
    this.statCache[p] = m;
    var A = !0;
    return m && (A = m.isDirectory() ? "DIR" : "FILE"), this.cache[p] = this.cache[p] || A, g && A === "FILE" ? !1 : A;
  }, O.prototype._mark = function(o) {
    return c.mark(this, o);
  }, O.prototype._makeAbs = function(o) {
    return c.makeAbs(this, o);
  }, at;
}
var Qt = qt;
function qt(t, e) {
  if (t && e)
    return qt(t)(e);
  if (typeof t != "function")
    throw new TypeError("need wrapper function");
  return Object.keys(t).forEach(function(n) {
    r[n] = t[n];
  }), r;
  function r() {
    for (var n = new Array(arguments.length), i = 0; i < n.length; i++)
      n[i] = arguments[i];
    var c = t.apply(this, n), l = n[n.length - 1];
    return typeof c == "function" && c !== l && Object.keys(l).forEach(function(d) {
      c[d] = l[d];
    }), c;
  }
}
var nt = { exports: {} }, Ht = Qt;
nt.exports = Ht(J);
nt.exports.strict = Ht(Vt);
J.proto = J(function() {
  Object.defineProperty(Function.prototype, "once", {
    value: function() {
      return J(this);
    },
    configurable: !0
  }), Object.defineProperty(Function.prototype, "onceStrict", {
    value: function() {
      return Vt(this);
    },
    configurable: !0
  });
});
function J(t) {
  var e = function() {
    return e.called ? e.value : (e.called = !0, e.value = t.apply(this, arguments));
  };
  return e.called = !1, e;
}
function Vt(t) {
  var e = function() {
    if (e.called)
      throw new Error(e.onceError);
    return e.called = !0, e.value = t.apply(this, arguments);
  }, r = t.name || "Function wrapped with `once`";
  return e.onceError = r + " shouldn't be called more than once", e.called = !1, e;
}
var Pe = Qt, K = /* @__PURE__ */ Object.create(null), Te = nt.exports, Ce = Pe(Ge);
function Ge(t, e) {
  return K[t] ? (K[t].push(e), null) : (K[t] = [e], Fe(t));
}
function Fe(t) {
  return Te(function e() {
    var r = K[t], n = r.length, i = Be(arguments);
    try {
      for (var c = 0; c < n; c++)
        r[c].apply(null, i);
    } finally {
      r.length > n ? (r.splice(0, n), process.nextTick(function() {
        e.apply(null, i);
      })) : delete K[t];
    }
  });
}
function Be(t) {
  for (var e = t.length, r = [], n = 0; n < e; n++)
    r[n] = t[n];
  return r;
}
var ot, St;
function zt() {
  if (St)
    return ot;
  St = 1, ot = m;
  var t = jt, e = et;
  e.Minimatch;
  var r = ft.exports, n = M.EventEmitter, i = M, c = M, l = M.isAbsolute, d = Ne(), v = C, b = v.setopts, E = v.ownProp, O = Ce, o = v.childrenIgnored, p = v.isIgnored, g = nt.exports;
  function m(a, s, u) {
    if (typeof s == "function" && (u = s, s = {}), s || (s = {}), s.sync) {
      if (u)
        throw new TypeError("callback provided to sync glob");
      return d(a, s);
    }
    return new _(a, s, u);
  }
  m.sync = d;
  var w = m.GlobSync = d.GlobSync;
  m.glob = m;
  function A(a, s) {
    if (s === null || typeof s != "object")
      return a;
    for (var u = Object.keys(s), f = u.length; f--; )
      a[u[f]] = s[u[f]];
    return a;
  }
  m.hasMagic = function(a, s) {
    var u = A({}, s);
    u.noprocess = !0;
    var f = new _(a, u), h = f.minimatch.set;
    if (!a)
      return !1;
    if (h.length > 1)
      return !0;
    for (var y = 0; y < h[0].length; y++)
      if (typeof h[0][y] != "string")
        return !0;
    return !1;
  }, m.Glob = _, r(_, n);
  function _(a, s, u) {
    if (typeof s == "function" && (u = s, s = null), s && s.sync) {
      if (u)
        throw new TypeError("callback provided to sync glob");
      return new w(a, s);
    }
    if (!(this instanceof _))
      return new _(a, s, u);
    b(this, a, s), this._didRealPath = !1;
    var f = this.minimatch.set.length;
    this.matches = new Array(f), typeof u == "function" && (u = g(u), this.on("error", u), this.on("end", function(j) {
      u(null, j);
    }));
    var h = this;
    if (this._processing = 0, this._emitQueue = [], this._processQueue = [], this.paused = !1, this.noprocess)
      return this;
    if (f === 0)
      return k();
    for (var y = !0, S = 0; S < f; S++)
      this._process(this.minimatch.set[S], S, !1, k);
    y = !1;
    function k() {
      --h._processing, h._processing <= 0 && (y ? process.nextTick(function() {
        h._finish();
      }) : h._finish());
    }
  }
  _.prototype._finish = function() {
    if (c(this instanceof _), !this.aborted) {
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      v.finish(this), this.emit("end", this.found);
    }
  }, _.prototype._realpath = function() {
    if (this._didRealpath)
      return;
    this._didRealpath = !0;
    var a = this.matches.length;
    if (a === 0)
      return this._finish();
    for (var s = this, u = 0; u < this.matches.length; u++)
      this._realpathSet(u, f);
    function f() {
      --a === 0 && s._finish();
    }
  }, _.prototype._realpathSet = function(a, s) {
    var u = this.matches[a];
    if (!u)
      return s();
    var f = Object.keys(u), h = this, y = f.length;
    if (y === 0)
      return s();
    var S = this.matches[a] = /* @__PURE__ */ Object.create(null);
    f.forEach(function(k, j) {
      k = h._makeAbs(k), t.realpath(k, h.realpathCache, function($, P) {
        $ ? $.syscall === "stat" ? S[k] = !0 : h.emit("error", $) : S[P] = !0, --y === 0 && (h.matches[a] = S, s());
      });
    });
  }, _.prototype._mark = function(a) {
    return v.mark(this, a);
  }, _.prototype._makeAbs = function(a) {
    return v.makeAbs(this, a);
  }, _.prototype.abort = function() {
    this.aborted = !0, this.emit("abort");
  }, _.prototype.pause = function() {
    this.paused || (this.paused = !0, this.emit("pause"));
  }, _.prototype.resume = function() {
    if (this.paused) {
      if (this.emit("resume"), this.paused = !1, this._emitQueue.length) {
        var a = this._emitQueue.slice(0);
        this._emitQueue.length = 0;
        for (var s = 0; s < a.length; s++) {
          var u = a[s];
          this._emitMatch(u[0], u[1]);
        }
      }
      if (this._processQueue.length) {
        var f = this._processQueue.slice(0);
        this._processQueue.length = 0;
        for (var s = 0; s < f.length; s++) {
          var h = f[s];
          this._processing--, this._process(h[0], h[1], h[2], h[3]);
        }
      }
    }
  }, _.prototype._process = function(a, s, u, f) {
    if (c(this instanceof _), c(typeof f == "function"), !this.aborted) {
      if (this._processing++, this.paused) {
        this._processQueue.push([a, s, u, f]);
        return;
      }
      for (var h = 0; typeof a[h] == "string"; )
        h++;
      var y;
      switch (h) {
        case a.length:
          this._processSimple(a.join("/"), s, f);
          return;
        case 0:
          y = null;
          break;
        default:
          y = a.slice(0, h).join("/");
          break;
      }
      var S = a.slice(h), k;
      y === null ? k = "." : ((l(y) || l(a.map(function(P) {
        return typeof P == "string" ? P : "[*]";
      }).join("/"))) && (!y || !l(y)) && (y = "/" + y), k = y);
      var j = this._makeAbs(k);
      if (o(this, k))
        return f();
      var $ = S[0] === e.GLOBSTAR;
      $ ? this._processGlobStar(y, k, j, S, s, u, f) : this._processReaddir(y, k, j, S, s, u, f);
    }
  }, _.prototype._processReaddir = function(a, s, u, f, h, y, S) {
    var k = this;
    this._readdir(u, y, function(j, $) {
      return k._processReaddir2(a, s, u, f, h, y, $, S);
    });
  }, _.prototype._processReaddir2 = function(a, s, u, f, h, y, S, k) {
    if (!S)
      return k();
    for (var j = f[0], $ = !!this.minimatch.negate, P = j._glob, G = this.dot || P.charAt(0) === ".", T = [], D = 0; D < S.length; D++) {
      var R = S[D];
      if (R.charAt(0) !== "." || G) {
        var V;
        $ && !a ? V = !R.match(j) : V = R.match(j), V && T.push(R);
      }
    }
    var z = T.length;
    if (z === 0)
      return k();
    if (f.length === 1 && !this.mark && !this.stat) {
      this.matches[h] || (this.matches[h] = /* @__PURE__ */ Object.create(null));
      for (var D = 0; D < z; D++) {
        var R = T[D];
        a && (a !== "/" ? R = a + "/" + R : R = a + R), R.charAt(0) === "/" && !this.nomount && (R = i.join(this.root, R)), this._emitMatch(h, R);
      }
      return k();
    }
    f.shift();
    for (var D = 0; D < z; D++) {
      var R = T[D];
      a && (a !== "/" ? R = a + "/" + R : R = a + R), this._process([R].concat(f), h, y, k);
    }
    k();
  }, _.prototype._emitMatch = function(a, s) {
    if (!this.aborted && !p(this, s)) {
      if (this.paused) {
        this._emitQueue.push([a, s]);
        return;
      }
      var u = l(s) ? s : this._makeAbs(s);
      if (this.mark && (s = this._mark(s)), this.absolute && (s = u), !this.matches[a][s]) {
        if (this.nodir) {
          var f = this.cache[u];
          if (f === "DIR" || Array.isArray(f))
            return;
        }
        this.matches[a][s] = !0;
        var h = this.statCache[u];
        h && this.emit("stat", s, h), this.emit("match", s);
      }
    }
  }, _.prototype._readdirInGlobStar = function(a, s) {
    if (this.aborted)
      return;
    if (this.follow)
      return this._readdir(a, !1, s);
    var u = "lstat\0" + a, f = this, h = O(u, y);
    h && f.fs.lstat(a, h);
    function y(S, k) {
      if (S && S.code === "ENOENT")
        return s();
      var j = k && k.isSymbolicLink();
      f.symlinks[a] = j, !j && k && !k.isDirectory() ? (f.cache[a] = "FILE", s()) : f._readdir(a, !1, s);
    }
  }, _.prototype._readdir = function(a, s, u) {
    if (!this.aborted && (u = O("readdir\0" + a + "\0" + s, u), !!u)) {
      if (s && !E(this.symlinks, a))
        return this._readdirInGlobStar(a, u);
      if (E(this.cache, a)) {
        var f = this.cache[a];
        if (!f || f === "FILE")
          return u();
        if (Array.isArray(f))
          return u(null, f);
      }
      var h = this;
      h.fs.readdir(a, I(this, a, u));
    }
  };
  function I(a, s, u) {
    return function(f, h) {
      f ? a._readdirError(s, f, u) : a._readdirEntries(s, h, u);
    };
  }
  return _.prototype._readdirEntries = function(a, s, u) {
    if (!this.aborted) {
      if (!this.mark && !this.stat)
        for (var f = 0; f < s.length; f++) {
          var h = s[f];
          a === "/" ? h = a + h : h = a + "/" + h, this.cache[h] = !0;
        }
      return this.cache[a] = s, u(null, s);
    }
  }, _.prototype._readdirError = function(a, s, u) {
    if (!this.aborted) {
      switch (s.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var f = this._makeAbs(a);
          if (this.cache[f] = "FILE", f === this.cwdAbs) {
            var h = new Error(s.code + " invalid cwd " + this.cwd);
            h.path = this.cwd, h.code = s.code, this.emit("error", h), this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(a)] = !1;
          break;
        default:
          this.cache[this._makeAbs(a)] = !1, this.strict && (this.emit("error", s), this.abort()), this.silent || console.error("glob error", s);
          break;
      }
      return u();
    }
  }, _.prototype._processGlobStar = function(a, s, u, f, h, y, S) {
    var k = this;
    this._readdir(u, y, function(j, $) {
      k._processGlobStar2(a, s, u, f, h, y, $, S);
    });
  }, _.prototype._processGlobStar2 = function(a, s, u, f, h, y, S, k) {
    if (!S)
      return k();
    var j = f.slice(1), $ = a ? [a] : [], P = $.concat(j);
    this._process(P, h, !1, k);
    var G = this.symlinks[u], T = S.length;
    if (G && y)
      return k();
    for (var D = 0; D < T; D++) {
      var R = S[D];
      if (!(R.charAt(0) === "." && !this.dot)) {
        var V = $.concat(S[D], j);
        this._process(V, h, !0, k);
        var z = $.concat(S[D], f);
        this._process(z, h, !0, k);
      }
    }
    k();
  }, _.prototype._processSimple = function(a, s, u) {
    var f = this;
    this._stat(a, function(h, y) {
      f._processSimple2(a, s, h, y, u);
    });
  }, _.prototype._processSimple2 = function(a, s, u, f, h) {
    if (this.matches[s] || (this.matches[s] = /* @__PURE__ */ Object.create(null)), !f)
      return h();
    if (a && l(a) && !this.nomount) {
      var y = /[\/\\]$/.test(a);
      a.charAt(0) === "/" ? a = i.join(this.root, a) : (a = i.resolve(this.root, a), y && (a += "/"));
    }
    process.platform === "win32" && (a = a.replace(/\\/g, "/")), this._emitMatch(s, a), h();
  }, _.prototype._stat = function(a, s) {
    var u = this._makeAbs(a), f = a.slice(-1) === "/";
    if (a.length > this.maxLength)
      return s();
    if (!this.stat && E(this.cache, u)) {
      var h = this.cache[u];
      if (Array.isArray(h) && (h = "DIR"), !f || h === "DIR")
        return s(null, h);
      if (f && h === "FILE")
        return s();
    }
    var y = this.statCache[u];
    if (y !== void 0) {
      if (y === !1)
        return s(null, y);
      var S = y.isDirectory() ? "DIR" : "FILE";
      return f && S === "FILE" ? s() : s(null, S, y);
    }
    var k = this, j = O("stat\0" + u, $);
    j && k.fs.lstat(u, j);
    function $(P, G) {
      if (G && G.isSymbolicLink())
        return k.fs.stat(u, function(T, D) {
          T ? k._stat2(a, u, null, G, s) : k._stat2(a, u, T, D, s);
        });
      k._stat2(a, u, P, G, s);
    }
  }, _.prototype._stat2 = function(a, s, u, f, h) {
    if (u && (u.code === "ENOENT" || u.code === "ENOTDIR"))
      return this.statCache[s] = !1, h();
    var y = a.slice(-1) === "/";
    if (this.statCache[s] = f, s.slice(-1) === "/" && f && !f.isDirectory())
      return h(null, !1, f);
    var S = !0;
    return f && (S = f.isDirectory() ? "DIR" : "FILE"), this.cache[s] = this.cache[s] || S, y && S === "FILE" ? h() : h(null, S, f);
  }, ot;
}
var dt = zt();
At.existsSync;
const bt = "(.*)", xe = "(.+)", Zt = "./routes";
function Ue() {
  return dt.sync("**/*/", { cwd: Zt }).map((t) => ({
    filename: t,
    path: `/${t.substr(0, t.length - 1)}`.replace(/\[?\[\.\.\.(.*?)\]\]?/g, bt).replace(/\[(.*?)\]/g, ":$1")
  }));
}
function Ve() {
  return [Kt()];
}
function Kt({ route: t, path: e = "", parentPath: r = "" } = {}) {
  var O, o, p;
  const n = Ue(), i = ((O = e.match(/\//g)) == null ? void 0 : O.length) || 0, c = `${Zt}/${(t == null ? void 0 : t.filename) || ""}`, l = (o = dt.sync("page.{js,jsx,ts,tsx}", { cwd: c })) == null ? void 0 : o[0], d = (p = dt.sync("layout.{js,jsx,ts,tsx}", { cwd: c })) == null ? void 0 : p[0], v = l && `${c}${l}`, b = d && `${c}${d}`, E = We({ routes: n, parentPath: e, depth: i });
  if (v) {
    const g = E.findIndex(({ path: w }) => w === `/${bt}`);
    g !== -1 && (E[g].path = `/${xe}`), E.push({
      fullPath: e,
      path: "",
      moduleUrl: v,
      depth: i,
      children: []
    });
  }
  return {
    fullPath: e || "",
    path: (e == null ? void 0 : e.replace(r, "")) || "",
    moduleUrl: b,
    depth: i,
    children: E
  };
}
function We({ routes: t, parentPath: e, depth: r }) {
  return t.filter((n) => {
    var d;
    const c = ((d = n.path.match(/\//g)) == null ? void 0 : d.length) === r + 1, l = n.path.indexOf(e) !== -1;
    return c && l;
  }).map((n) => Kt({ route: n, path: n.path, parentPath: e })).sort((n, i) => n.path === `/${bt}` ? 1 : -1);
}
const Qe = Yt`query DomainGetConnection($packageVersionId: ID) {
  domainConnection(packageVersionId: $packageVersionId) {
    nodes {
      id
      domainName
      packageVersionId
      packageId
      orgId
    }
  }
}`;
async function ze(t, { packageVersion: e }) {
  var l, d;
  if (!e)
    return console.warn("PackageVersion not found, you may need to deploy first"), null;
  const r = Qe, n = { packageVersionId: e.id }, i = await Xt().query(r, n).toPromise(), c = (d = (l = i.data) == null ? void 0 : l.domainConnection) == null ? void 0 : d.nodes[0];
  return c || console.warn("Domain not found:", e.id, i.error), c;
}
export {
  ze as getDomain,
  Ve as getNestedRoutes
};
