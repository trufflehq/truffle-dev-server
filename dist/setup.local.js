import { g as Yt } from "./domain.js";
import "https://tfl.dev/@truffle/api@^0.2.0/client.ts";
const jt = {}, Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: jt
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
    var s = Object.getOwnPropertyDescriptor(t, n);
    Object.defineProperty(r, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return t[n];
      }
    });
  }), r;
}
const M = /* @__PURE__ */ te(Jt);
var dt = {}, Q = M, x = process.platform === "win32", B = M, ee = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
function re() {
  var t;
  if (ee) {
    var e = new Error();
    t = r;
  } else
    t = n;
  return t;
  function r(s) {
    s && (e.message = s.message, s = e, n(s));
  }
  function n(s) {
    if (s) {
      if (process.throwDeprecation)
        throw s;
      if (!process.noDeprecation) {
        var c = "fs: missing callback " + (s.stack || s.message);
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
  var H = /(.*?)(?:[\/\\]+|$)/g;
else
  var H = /(.*?)(?:[\/]+|$)/g;
if (x)
  var gt = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
else
  var gt = /^[\/]*/;
dt.realpathSync = function(e, r) {
  if (e = Q.resolve(e), r && Object.prototype.hasOwnProperty.call(r, e))
    return r[e];
  var n = e, s = {}, c = {}, f, g, v, b;
  E();
  function E() {
    var w = gt.exec(e);
    f = w[0].length, g = w[0], v = w[0], b = "", x && !c[v] && (B.lstatSync(v), c[v] = !0);
  }
  for (; f < e.length; ) {
    H.lastIndex = f;
    var k = H.exec(e);
    if (b = g, g += k[0], v = b + k[1], f = H.lastIndex, !(c[v] || r && r[v] === v)) {
      var o;
      if (r && Object.prototype.hasOwnProperty.call(r, v))
        o = r[v];
      else {
        var p = B.lstatSync(v);
        if (!p.isSymbolicLink()) {
          c[v] = !0, r && (r[v] = v);
          continue;
        }
        var d = null;
        if (!x) {
          var m = p.dev.toString(32) + ":" + p.ino.toString(32);
          s.hasOwnProperty(m) && (d = s[m]);
        }
        d === null && (B.statSync(v), d = B.readlinkSync(v)), o = Q.resolve(b, d), r && (r[v] = o), x || (s[m] = d);
      }
      e = Q.resolve(o, e.slice(f)), E();
    }
  }
  return r && (r[n] = e), e;
};
dt.realpath = function(e, r, n) {
  if (typeof n != "function" && (n = ne(r), r = null), e = Q.resolve(e), r && Object.prototype.hasOwnProperty.call(r, e))
    return process.nextTick(n.bind(null, null, r[e]));
  var s = e, c = {}, f = {}, g, v, b, E;
  k();
  function k() {
    var w = gt.exec(e);
    g = w[0].length, v = w[0], b = w[0], E = "", x && !f[b] ? B.lstat(b, function(A) {
      if (A)
        return n(A);
      f[b] = !0, o();
    }) : process.nextTick(o);
  }
  function o() {
    if (g >= e.length)
      return r && (r[s] = e), n(null, e);
    H.lastIndex = g;
    var w = H.exec(e);
    return E = v, v += w[0], b = E + w[1], g = H.lastIndex, f[b] || r && r[b] === b ? process.nextTick(o) : r && Object.prototype.hasOwnProperty.call(r, b) ? m(r[b]) : B.lstat(b, p);
  }
  function p(w, A) {
    if (w)
      return n(w);
    if (!A.isSymbolicLink())
      return f[b] = !0, r && (r[b] = b), process.nextTick(o);
    if (!x) {
      var _ = A.dev.toString(32) + ":" + A.ino.toString(32);
      if (c.hasOwnProperty(_))
        return d(null, c[_], b);
    }
    B.stat(b, function(I) {
      if (I)
        return n(I);
      B.readlink(b, function(a, i) {
        x || (c[_] = i), d(a, i);
      });
    });
  }
  function d(w, A, _) {
    if (w)
      return n(w);
    var I = Q.resolve(E, A);
    r && (r[_] = I), m(I);
  }
  function m(w) {
    e = Q.resolve(w, e.slice(g)), k();
  }
};
var It = U;
U.realpath = U;
U.sync = mt;
U.realpathSync = mt;
U.monkeypatch = se;
U.unmonkeypatch = ae;
var q = M, ct = q.realpath, ht = q.realpathSync, ie = process.version, Rt = /^v[0-5]\./.test(ie), Dt = dt;
function $t(t) {
  return t && t.syscall === "realpath" && (t.code === "ELOOP" || t.code === "ENOMEM" || t.code === "ENAMETOOLONG");
}
function U(t, e, r) {
  if (Rt)
    return ct(t, e, r);
  typeof e == "function" && (r = e, e = null), ct(t, e, function(n, s) {
    $t(n) ? Dt.realpath(t, e, r) : r(n, s);
  });
}
function mt(t, e) {
  if (Rt)
    return ht(t, e);
  try {
    return ht(t, e);
  } catch (r) {
    if ($t(r))
      return Dt.realpathSync(t, e);
    throw r;
  }
}
function se() {
  q.realpath = U, q.realpathSync = mt;
}
function ae() {
  q.realpath = ct, q.realpathSync = ht;
}
const oe = typeof process == "object" && process && process.platform === "win32";
var ce = oe ? { sep: "\\" } : { sep: "/" }, he = Mt;
function Mt(t, e, r) {
  t instanceof RegExp && (t = _t(t, r)), e instanceof RegExp && (e = _t(e, r));
  var n = Lt(t, e, r);
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
Mt.range = Lt;
function Lt(t, e, r) {
  var n, s, c, f, g, v = r.indexOf(t), b = r.indexOf(e, v + 1), E = v;
  if (v >= 0 && b > 0) {
    if (t === e)
      return [v, b];
    for (n = [], c = r.length; E >= 0 && !g; )
      E == v ? (n.push(E), v = r.indexOf(t, E + 1)) : n.length == 1 ? g = [n.pop(), b] : (s = n.pop(), s < c && (c = s, f = b), b = r.indexOf(e, E + 1)), E = v < b && v >= 0 ? v : b;
    n.length && (g = [c, f]);
  }
  return g;
}
var Nt = he, ue = pe, Pt = "\0SLASH" + Math.random() + "\0", Tt = "\0OPEN" + Math.random() + "\0", yt = "\0CLOSE" + Math.random() + "\0", Ct = "\0COMMA" + Math.random() + "\0", Gt = "\0PERIOD" + Math.random() + "\0";
function it(t) {
  return parseInt(t, 10) == t ? parseInt(t, 10) : t.charCodeAt(0);
}
function le(t) {
  return t.split("\\\\").join(Pt).split("\\{").join(Tt).split("\\}").join(yt).split("\\,").join(Ct).split("\\.").join(Gt);
}
function fe(t) {
  return t.split(Pt).join("\\").split(Tt).join("{").split(yt).join("}").split(Ct).join(",").split(Gt).join(".");
}
function Ft(t) {
  if (!t)
    return [""];
  var e = [], r = Nt("{", "}", t);
  if (!r)
    return t.split(",");
  var n = r.pre, s = r.body, c = r.post, f = n.split(",");
  f[f.length - 1] += "{" + s + "}";
  var g = Ft(c);
  return c.length && (f[f.length - 1] += g.shift(), f.push.apply(f, g)), e.push.apply(e, f), e;
}
function pe(t) {
  return t ? (t.substr(0, 2) === "{}" && (t = "\\{\\}" + t.substr(2)), Z(le(t), !0).map(fe)) : [];
}
function ve(t) {
  return "{" + t + "}";
}
function de(t) {
  return /^-?0\d/.test(t);
}
function ge(t, e) {
  return t <= e;
}
function me(t, e) {
  return t >= e;
}
function Z(t, e) {
  var r = [], n = Nt("{", "}", t);
  if (!n)
    return [t];
  var s = n.pre, c = n.post.length ? Z(n.post, !1) : [""];
  if (/\$$/.test(n.pre))
    for (var f = 0; f < c.length; f++) {
      var g = s + "{" + n.body + "}" + c[f];
      r.push(g);
    }
  else {
    var v = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(n.body), b = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(n.body), E = v || b, k = n.body.indexOf(",") >= 0;
    if (!E && !k)
      return n.post.match(/,.*\}/) ? (t = n.pre + "{" + n.body + yt + n.post, Z(t)) : [t];
    var o;
    if (E)
      o = n.body.split(/\.\./);
    else if (o = Ft(n.body), o.length === 1 && (o = Z(o[0], !1).map(ve), o.length === 1))
      return c.map(function(S) {
        return n.pre + o[0] + S;
      });
    var p;
    if (E) {
      var d = it(o[0]), m = it(o[1]), w = Math.max(o[0].length, o[1].length), A = o.length == 3 ? Math.abs(it(o[2])) : 1, _ = ge, I = m < d;
      I && (A *= -1, _ = me);
      var a = o.some(de);
      p = [];
      for (var i = d; _(i, m); i += A) {
        var u;
        if (b)
          u = String.fromCharCode(i), u === "\\" && (u = "");
        else if (u = String(i), a) {
          var l = w - u.length;
          if (l > 0) {
            var h = new Array(l + 1).join("0");
            i < 0 ? u = "-" + h + u.slice(1) : u = h + u;
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
      for (var f = 0; f < c.length; f++) {
        var g = s + p[y] + c[f];
        (!e || E || g) && r.push(g);
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
}, lt = "[^/]", st = lt + "*?", be = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", _e = "(?:(?!(?:\\/|^)\\.).)*?", Bt = (t) => t.split("").reduce((e, r) => (e[r] = !0, e), {}), Et = Bt("().*{}+?[]^$\\!"), we = Bt("[.("), Ot = /\/+/;
L.filter = (t, e = {}) => (r, n, s) => L(r, t, e);
const F = (t, e = {}) => {
  const r = {};
  return Object.keys(t).forEach((n) => r[n] = t[n]), Object.keys(e).forEach((n) => r[n] = e[n]), r;
};
L.defaults = (t) => {
  if (!t || typeof t != "object" || !Object.keys(t).length)
    return L;
  const e = L, r = (n, s, c) => e(n, s, F(t, c));
  return r.Minimatch = class extends e.Minimatch {
    constructor(s, c) {
      super(s, F(t, c));
    }
  }, r.Minimatch.defaults = (n) => e.defaults(F(t, n)).Minimatch, r.filter = (n, s) => e.filter(n, F(t, s)), r.defaults = (n) => e.defaults(F(t, n)), r.makeRe = (n, s) => e.makeRe(n, F(t, s)), r.braceExpand = (n, s) => e.braceExpand(n, F(t, s)), r.match = (n, s, c) => e.match(n, s, F(t, c)), r;
};
L.braceExpand = (t, e) => xt(t, e);
const xt = (t, e = {}) => (tt(t), e.nobrace || !/\{(?:(?!\{).)*\}/.test(t) ? [t] : ye(t)), Ee = 1024 * 64, tt = (t) => {
  if (typeof t != "string")
    throw new TypeError("invalid pattern");
  if (t.length > Ee)
    throw new TypeError("pattern is too long");
}, Y = Symbol("subparse");
L.makeRe = (t, e) => new rt(t, e || {}).makeRe();
L.match = (t, e, r = {}) => {
  const n = new rt(e, r);
  return t = t.filter((s) => n.match(s)), n.options.nonull && !t.length && t.push(e), t;
};
const Oe = (t) => t.replace(/\\(.)/g, "$1"), ke = (t) => t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
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
    r.debug && (this.debug = (...s) => console.error(...s)), this.debug(this.pattern, n), n = this.globParts = n.map((s) => s.split(Ot)), this.debug(this.pattern, n), n = n.map((s, c, f) => s.map(this.parse, this)), this.debug(this.pattern, n), n = n.filter((s) => s.indexOf(!1) === -1), this.debug(this.pattern, n), this.set = n;
  }
  parseNegate() {
    if (this.options.nonegate)
      return;
    const e = this.pattern;
    let r = !1, n = 0;
    for (let s = 0; s < e.length && e.charAt(s) === "!"; s++)
      r = !r, n++;
    n && (this.pattern = e.substr(n)), this.negate = r;
  }
  matchOne(e, r, n) {
    var s = this.options;
    this.debug("matchOne", { this: this, file: e, pattern: r }), this.debug("matchOne", e.length, r.length);
    for (var c = 0, f = 0, g = e.length, v = r.length; c < g && f < v; c++, f++) {
      this.debug("matchOne loop");
      var b = r[f], E = e[c];
      if (this.debug(r, b, E), b === !1)
        return !1;
      if (b === N) {
        this.debug("GLOBSTAR", [r, b, E]);
        var k = c, o = f + 1;
        if (o === v) {
          for (this.debug("** at the end"); c < g; c++)
            if (e[c] === "." || e[c] === ".." || !s.dot && e[c].charAt(0) === ".")
              return !1;
          return !0;
        }
        for (; k < g; ) {
          var p = e[k];
          if (this.debug(`
globstar while`, e, k, r, o, p), this.matchOne(e.slice(k), r.slice(o), n))
            return this.debug("globstar found match!", k, g, p), !0;
          if (p === "." || p === ".." || !s.dot && p.charAt(0) === ".") {
            this.debug("dot detected!", e, k, r, o);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), k++;
        }
        return !!(n && (this.debug(`
>>> no match, partial?`, e, k, r, o), k === g));
      }
      var d;
      if (typeof b == "string" ? (d = E === b, this.debug("string match", b, E, d)) : (d = E.match(b), this.debug("pattern match", b, E, d)), !d)
        return !1;
    }
    if (c === g && f === v)
      return !0;
    if (c === g)
      return n;
    if (f === v)
      return c === g - 1 && e[c] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return xt(this.pattern, this.options);
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
    let s = "", c = !!n.nocase, f = !1;
    const g = [], v = [];
    let b, E = !1, k = -1, o = -1, p, d, m;
    const w = e.charAt(0) === "." ? "" : n.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", A = () => {
      if (b) {
        switch (b) {
          case "*":
            s += st, c = !0;
            break;
          case "?":
            s += lt, c = !0;
            break;
          default:
            s += "\\" + b;
            break;
        }
        this.debug("clearStateChar %j %j", b, s), b = !1;
      }
    };
    for (let a = 0, i; a < e.length && (i = e.charAt(a)); a++) {
      if (this.debug("%s	%s %s %j", e, a, s, i), f) {
        if (i === "/")
          return !1;
        Et[i] && (s += "\\"), s += i, f = !1;
        continue;
      }
      switch (i) {
        case "/":
          return !1;
        case "\\":
          A(), f = !0;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", e, a, s, i), E) {
            this.debug("  in class"), i === "!" && a === o + 1 && (i = "^"), s += i;
            continue;
          }
          this.debug("call clearStateChar %j", b), A(), b = i, n.noext && A();
          continue;
        case "(":
          if (E) {
            s += "(";
            continue;
          }
          if (!b) {
            s += "\\(";
            continue;
          }
          g.push({
            type: b,
            start: a - 1,
            reStart: s.length,
            open: wt[b].open,
            close: wt[b].close
          }), s += b === "!" ? "(?:(?!(?:" : "(?:", this.debug("plType %j %j", b, s), b = !1;
          continue;
        case ")":
          if (E || !g.length) {
            s += "\\)";
            continue;
          }
          A(), c = !0, d = g.pop(), s += d.close, d.type === "!" && v.push(d), d.reEnd = s.length;
          continue;
        case "|":
          if (E || !g.length) {
            s += "\\|";
            continue;
          }
          A(), s += "|";
          continue;
        case "[":
          if (A(), E) {
            s += "\\" + i;
            continue;
          }
          E = !0, o = a, k = s.length, s += i;
          continue;
        case "]":
          if (a === o + 1 || !E) {
            s += "\\" + i;
            continue;
          }
          p = e.substring(o + 1, a);
          try {
            RegExp("[" + p + "]");
          } catch {
            m = this.parse(p, Y), s = s.substr(0, k) + "\\[" + m[0] + "\\]", c = c || m[1], E = !1;
            continue;
          }
          c = !0, E = !1, s += i;
          continue;
        default:
          A(), Et[i] && !(i === "^" && E) && (s += "\\"), s += i;
          break;
      }
    }
    for (E && (p = e.substr(o + 1), m = this.parse(p, Y), s = s.substr(0, k) + "\\[" + m[0], c = c || m[1]), d = g.pop(); d; d = g.pop()) {
      let a;
      a = s.slice(d.reStart + d.open.length), this.debug("setting tail", s, d), a = a.replace(/((?:\\{2}){0,64})(\\?)\|/g, (u, l, h) => (h || (h = "\\"), l + l + h + "|")), this.debug(`tail=%j
   %s`, a, a, d, s);
      const i = d.type === "*" ? st : d.type === "?" ? lt : "\\" + d.type;
      c = !0, s = s.slice(0, d.reStart) + i + "\\(" + a;
    }
    A(), f && (s += "\\\\");
    const _ = we[s.charAt(0)];
    for (let a = v.length - 1; a > -1; a--) {
      const i = v[a], u = s.slice(0, i.reStart), l = s.slice(i.reStart, i.reEnd - 8);
      let h = s.slice(i.reEnd);
      const y = s.slice(i.reEnd - 8, i.reEnd) + h, S = u.split("(").length - 1;
      let O = h;
      for (let D = 0; D < S; D++)
        O = O.replace(/\)[+*?]?/, "");
      h = O;
      const j = h === "" && r !== Y ? "$" : "";
      s = u + l + h + j + y;
    }
    if (s !== "" && c && (s = "(?=.)" + s), _ && (s = w + s), r === Y)
      return [s, c];
    if (!c)
      return Oe(e);
    const I = n.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + s + "$", I), {
        _glob: e,
        _src: s
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
    const r = this.options, n = r.noglobstar ? st : r.dot ? be : _e, s = r.nocase ? "i" : "";
    let c = e.map((f) => (f = f.map((g) => typeof g == "string" ? ke(g) : g === N ? N : g._src).reduce((g, v) => (g[g.length - 1] === N && v === N || g.push(v), g), []), f.forEach((g, v) => {
      g !== N || f[v - 1] === N || (v === 0 ? f.length > 1 ? f[v + 1] = "(?:\\/|" + n + "\\/)?" + f[v + 1] : f[v] = n : v === f.length - 1 ? f[v - 1] += "(?:\\/|" + n + ")?" : (f[v - 1] += "(?:\\/|\\/" + n + "\\/)" + f[v + 1], f[v + 1] = N));
    }), f.filter((g) => g !== N).join("/"))).join("|");
    c = "^(?:" + c + ")$", this.negate && (c = "^(?!" + c + ").*$");
    try {
      this.regexp = new RegExp(c, s);
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
    ut.sep !== "/" && (e = e.split(ut.sep).join("/")), e = e.split(Ot), this.debug(this.pattern, "split", e);
    const s = this.set;
    this.debug(this.pattern, "set", s);
    let c;
    for (let f = e.length - 1; f >= 0 && (c = e[f], !c); f--)
      ;
    for (let f = 0; f < s.length; f++) {
      const g = s[f];
      let v = e;
      if (n.matchBase && g.length === 1 && (v = [c]), this.matchOne(v, g, r))
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
C.setopts = De;
C.ownProp = Ut;
C.makeAbs = X;
C.finish = $e;
C.mark = Me;
C.isIgnored = Qt;
C.childrenIgnored = Le;
function Ut(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
var Se = M, W = M, Ae = et, Wt = M.isAbsolute, pt = Ae.Minimatch;
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
function De(t, e, r) {
  if (r || (r = {}), r.matchBase && e.indexOf("/") === -1) {
    if (r.noglobstar)
      throw new Error("base matching requires globstar");
    e = "**/" + e;
  }
  t.silent = !!r.silent, t.pattern = e, t.strict = r.strict !== !1, t.realpath = !!r.realpath, t.realpathCache = r.realpathCache || /* @__PURE__ */ Object.create(null), t.follow = !!r.follow, t.dot = !!r.dot, t.mark = !!r.mark, t.nodir = !!r.nodir, t.nodir && (t.mark = !0), t.sync = !!r.sync, t.nounique = !!r.nounique, t.nonull = !!r.nonull, t.nosort = !!r.nosort, t.nocase = !!r.nocase, t.stat = !!r.stat, t.noprocess = !!r.noprocess, t.absolute = !!r.absolute, t.fs = r.fs || Se, t.maxLength = r.maxLength || 1 / 0, t.cache = r.cache || /* @__PURE__ */ Object.create(null), t.statCache = r.statCache || /* @__PURE__ */ Object.create(null), t.symlinks = r.symlinks || /* @__PURE__ */ Object.create(null), Ie(t, r), t.changedCwd = !1;
  var n = process.cwd();
  Ut(r, "cwd") ? (t.cwd = W.resolve(r.cwd), t.changedCwd = t.cwd !== n) : t.cwd = W.resolve(n), t.root = r.root || W.resolve(t.cwd, "/"), t.root = W.resolve(t.root), t.cwdAbs = Wt(t.cwd) ? t.cwd : X(t, t.cwd), t.nomount = !!r.nomount, process.platform === "win32" && (t.root = t.root.replace(/\\/g, "/"), t.cwd = t.cwd.replace(/\\/g, "/"), t.cwdAbs = t.cwdAbs.replace(/\\/g, "/")), r.nonegate = !0, r.nocomment = !0, r.allowWindowsEscape = !0, t.minimatch = new pt(e, r), t.options = t.minimatch.options;
}
function $e(t) {
  for (var e = t.nounique, r = e ? [] : /* @__PURE__ */ Object.create(null), n = 0, s = t.matches.length; n < s; n++) {
    var c = t.matches[n];
    if (!c || Object.keys(c).length === 0) {
      if (t.nonull) {
        var f = t.minimatch.globSet[n];
        e ? r.push(f) : r[f] = !0;
      }
    } else {
      var g = Object.keys(c);
      e ? r.push.apply(r, g) : g.forEach(function(v) {
        r[v] = !0;
      });
    }
  }
  if (e || (r = Object.keys(r)), t.nosort || (r = r.sort(je)), t.mark) {
    for (var n = 0; n < r.length; n++)
      r[n] = t._mark(r[n]);
    t.nodir && (r = r.filter(function(v) {
      var b = !/\/$/.test(v), E = t.cache[v] || t.cache[X(t, v)];
      return b && E && (b = E !== "DIR" && !Array.isArray(E)), b;
    }));
  }
  t.ignore.length && (r = r.filter(function(v) {
    return !Qt(t, v);
  })), t.found = r;
}
function Me(t, e) {
  var r = X(t, e), n = t.cache[r], s = e;
  if (n) {
    var c = n === "DIR" || Array.isArray(n), f = e.slice(-1) === "/";
    if (c && !f ? s += "/" : !c && f && (s = s.slice(0, -1)), s !== e) {
      var g = X(t, s);
      t.statCache[g] = t.statCache[r], t.cache[g] = t.cache[r];
    }
  }
  return s;
}
function X(t, e) {
  var r = e;
  return e.charAt(0) === "/" ? r = W.join(t.root, e) : Wt(e) || e === "" ? r = e : t.changedCwd ? r = W.resolve(t.cwd, e) : r = W.resolve(e), process.platform === "win32" && (r = r.replace(/\\/g, "/")), r;
}
function Qt(t, e) {
  return t.ignore.length ? t.ignore.some(function(r) {
    return r.matcher.match(e) || !!(r.gmatcher && r.gmatcher.match(e));
  }) : !1;
}
function Le(t, e) {
  return t.ignore.length ? t.ignore.some(function(r) {
    return !!(r.gmatcher && r.gmatcher.match(e));
  }) : !1;
}
var at, kt;
function Ne() {
  if (kt)
    return at;
  kt = 1, at = E, E.GlobSync = k;
  var t = It, e = et;
  e.Minimatch, Zt().Glob;
  var r = M, n = M, s = M.isAbsolute, c = C, f = c.setopts, g = c.ownProp, v = c.childrenIgnored, b = c.isIgnored;
  function E(o, p) {
    if (typeof p == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    return new k(o, p).found;
  }
  function k(o, p) {
    if (!o)
      throw new Error("must provide pattern");
    if (typeof p == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    if (!(this instanceof k))
      return new k(o, p);
    if (f(this, o, p), this.noprocess)
      return this;
    var d = this.minimatch.set.length;
    this.matches = new Array(d);
    for (var m = 0; m < d; m++)
      this._process(this.minimatch.set[m], m, !1);
    this._finish();
  }
  return k.prototype._finish = function() {
    if (n.ok(this instanceof k), this.realpath) {
      var o = this;
      this.matches.forEach(function(p, d) {
        var m = o.matches[d] = /* @__PURE__ */ Object.create(null);
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
  }, k.prototype._process = function(o, p, d) {
    n.ok(this instanceof k);
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
    w === null ? _ = "." : ((s(w) || s(o.map(function(i) {
      return typeof i == "string" ? i : "[*]";
    }).join("/"))) && (!w || !s(w)) && (w = "/" + w), _ = w);
    var I = this._makeAbs(_);
    if (!v(this, _)) {
      var a = A[0] === e.GLOBSTAR;
      a ? this._processGlobStar(w, _, I, A, p, d) : this._processReaddir(w, _, I, A, p, d);
    }
  }, k.prototype._processReaddir = function(o, p, d, m, w, A) {
    var _ = this._readdir(d, A);
    if (!!_) {
      for (var I = m[0], a = !!this.minimatch.negate, i = I._glob, u = this.dot || i.charAt(0) === ".", l = [], h = 0; h < _.length; h++) {
        var y = _[h];
        if (y.charAt(0) !== "." || u) {
          var S;
          a && !o ? S = !y.match(I) : S = y.match(I), S && l.push(y);
        }
      }
      var O = l.length;
      if (O !== 0) {
        if (m.length === 1 && !this.mark && !this.stat) {
          this.matches[w] || (this.matches[w] = /* @__PURE__ */ Object.create(null));
          for (var h = 0; h < O; h++) {
            var y = l[h];
            o && (o.slice(-1) !== "/" ? y = o + "/" + y : y = o + y), y.charAt(0) === "/" && !this.nomount && (y = r.join(this.root, y)), this._emitMatch(w, y);
          }
          return;
        }
        m.shift();
        for (var h = 0; h < O; h++) {
          var y = l[h], j;
          o ? j = [o, y] : j = [y], this._process(j.concat(m), w, A);
        }
      }
    }
  }, k.prototype._emitMatch = function(o, p) {
    if (!b(this, p)) {
      var d = this._makeAbs(p);
      if (this.mark && (p = this._mark(p)), this.absolute && (p = d), !this.matches[o][p]) {
        if (this.nodir) {
          var m = this.cache[d];
          if (m === "DIR" || Array.isArray(m))
            return;
        }
        this.matches[o][p] = !0, this.stat && this._stat(p);
      }
    }
  }, k.prototype._readdirInGlobStar = function(o) {
    if (this.follow)
      return this._readdir(o, !1);
    var p, d;
    try {
      d = this.fs.lstatSync(o);
    } catch (w) {
      if (w.code === "ENOENT")
        return null;
    }
    var m = d && d.isSymbolicLink();
    return this.symlinks[o] = m, !m && d && !d.isDirectory() ? this.cache[o] = "FILE" : p = this._readdir(o, !1), p;
  }, k.prototype._readdir = function(o, p) {
    if (p && !g(this.symlinks, o))
      return this._readdirInGlobStar(o);
    if (g(this.cache, o)) {
      var d = this.cache[o];
      if (!d || d === "FILE")
        return null;
      if (Array.isArray(d))
        return d;
    }
    try {
      return this._readdirEntries(o, this.fs.readdirSync(o));
    } catch (m) {
      return this._readdirError(o, m), null;
    }
  }, k.prototype._readdirEntries = function(o, p) {
    if (!this.mark && !this.stat)
      for (var d = 0; d < p.length; d++) {
        var m = p[d];
        o === "/" ? m = o + m : m = o + "/" + m, this.cache[m] = !0;
      }
    return this.cache[o] = p, p;
  }, k.prototype._readdirError = function(o, p) {
    switch (p.code) {
      case "ENOTSUP":
      case "ENOTDIR":
        var d = this._makeAbs(o);
        if (this.cache[d] = "FILE", d === this.cwdAbs) {
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
  }, k.prototype._processGlobStar = function(o, p, d, m, w, A) {
    var _ = this._readdir(d, A);
    if (!!_) {
      var I = m.slice(1), a = o ? [o] : [], i = a.concat(I);
      this._process(i, w, !1);
      var u = _.length, l = this.symlinks[d];
      if (!(l && A))
        for (var h = 0; h < u; h++) {
          var y = _[h];
          if (!(y.charAt(0) === "." && !this.dot)) {
            var S = a.concat(_[h], I);
            this._process(S, w, !0);
            var O = a.concat(_[h], m);
            this._process(O, w, !0);
          }
        }
    }
  }, k.prototype._processSimple = function(o, p) {
    var d = this._stat(o);
    if (this.matches[p] || (this.matches[p] = /* @__PURE__ */ Object.create(null)), !!d) {
      if (o && s(o) && !this.nomount) {
        var m = /[\/\\]$/.test(o);
        o.charAt(0) === "/" ? o = r.join(this.root, o) : (o = r.resolve(this.root, o), m && (o += "/"));
      }
      process.platform === "win32" && (o = o.replace(/\\/g, "/")), this._emitMatch(p, o);
    }
  }, k.prototype._stat = function(o) {
    var p = this._makeAbs(o), d = o.slice(-1) === "/";
    if (o.length > this.maxLength)
      return !1;
    if (!this.stat && g(this.cache, p)) {
      var A = this.cache[p];
      if (Array.isArray(A) && (A = "DIR"), !d || A === "DIR")
        return A;
      if (d && A === "FILE")
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
    return m && (A = m.isDirectory() ? "DIR" : "FILE"), this.cache[p] = this.cache[p] || A, d && A === "FILE" ? !1 : A;
  }, k.prototype._mark = function(o) {
    return c.mark(this, o);
  }, k.prototype._makeAbs = function(o) {
    return c.makeAbs(this, o);
  }, at;
}
var Ht = qt;
function qt(t, e) {
  if (t && e)
    return qt(t)(e);
  if (typeof t != "function")
    throw new TypeError("need wrapper function");
  return Object.keys(t).forEach(function(n) {
    r[n] = t[n];
  }), r;
  function r() {
    for (var n = new Array(arguments.length), s = 0; s < n.length; s++)
      n[s] = arguments[s];
    var c = t.apply(this, n), f = n[n.length - 1];
    return typeof c == "function" && c !== f && Object.keys(f).forEach(function(g) {
      c[g] = f[g];
    }), c;
  }
}
var nt = { exports: {} }, zt = Ht;
nt.exports = zt(J);
nt.exports.strict = zt(Vt);
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
var Pe = Ht, K = /* @__PURE__ */ Object.create(null), Te = nt.exports, Ce = Pe(Ge);
function Ge(t, e) {
  return K[t] ? (K[t].push(e), null) : (K[t] = [e], Fe(t));
}
function Fe(t) {
  return Te(function e() {
    var r = K[t], n = r.length, s = Be(arguments);
    try {
      for (var c = 0; c < n; c++)
        r[c].apply(null, s);
    } finally {
      r.length > n ? (r.splice(0, n), process.nextTick(function() {
        e.apply(null, s);
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
function Zt() {
  if (St)
    return ot;
  St = 1, ot = m;
  var t = It, e = et;
  e.Minimatch;
  var r = ft.exports, n = M.EventEmitter, s = M, c = M, f = M.isAbsolute, g = Ne(), v = C, b = v.setopts, E = v.ownProp, k = Ce, o = v.childrenIgnored, p = v.isIgnored, d = nt.exports;
  function m(a, i, u) {
    if (typeof i == "function" && (u = i, i = {}), i || (i = {}), i.sync) {
      if (u)
        throw new TypeError("callback provided to sync glob");
      return g(a, i);
    }
    return new _(a, i, u);
  }
  m.sync = g;
  var w = m.GlobSync = g.GlobSync;
  m.glob = m;
  function A(a, i) {
    if (i === null || typeof i != "object")
      return a;
    for (var u = Object.keys(i), l = u.length; l--; )
      a[u[l]] = i[u[l]];
    return a;
  }
  m.hasMagic = function(a, i) {
    var u = A({}, i);
    u.noprocess = !0;
    var l = new _(a, u), h = l.minimatch.set;
    if (!a)
      return !1;
    if (h.length > 1)
      return !0;
    for (var y = 0; y < h[0].length; y++)
      if (typeof h[0][y] != "string")
        return !0;
    return !1;
  }, m.Glob = _, r(_, n);
  function _(a, i, u) {
    if (typeof i == "function" && (u = i, i = null), i && i.sync) {
      if (u)
        throw new TypeError("callback provided to sync glob");
      return new w(a, i);
    }
    if (!(this instanceof _))
      return new _(a, i, u);
    b(this, a, i), this._didRealPath = !1;
    var l = this.minimatch.set.length;
    this.matches = new Array(l), typeof u == "function" && (u = d(u), this.on("error", u), this.on("end", function(j) {
      u(null, j);
    }));
    var h = this;
    if (this._processing = 0, this._emitQueue = [], this._processQueue = [], this.paused = !1, this.noprocess)
      return this;
    if (l === 0)
      return O();
    for (var y = !0, S = 0; S < l; S++)
      this._process(this.minimatch.set[S], S, !1, O);
    y = !1;
    function O() {
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
    for (var i = this, u = 0; u < this.matches.length; u++)
      this._realpathSet(u, l);
    function l() {
      --a === 0 && i._finish();
    }
  }, _.prototype._realpathSet = function(a, i) {
    var u = this.matches[a];
    if (!u)
      return i();
    var l = Object.keys(u), h = this, y = l.length;
    if (y === 0)
      return i();
    var S = this.matches[a] = /* @__PURE__ */ Object.create(null);
    l.forEach(function(O, j) {
      O = h._makeAbs(O), t.realpath(O, h.realpathCache, function(D, P) {
        D ? D.syscall === "stat" ? S[O] = !0 : h.emit("error", D) : S[P] = !0, --y === 0 && (h.matches[a] = S, i());
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
        for (var i = 0; i < a.length; i++) {
          var u = a[i];
          this._emitMatch(u[0], u[1]);
        }
      }
      if (this._processQueue.length) {
        var l = this._processQueue.slice(0);
        this._processQueue.length = 0;
        for (var i = 0; i < l.length; i++) {
          var h = l[i];
          this._processing--, this._process(h[0], h[1], h[2], h[3]);
        }
      }
    }
  }, _.prototype._process = function(a, i, u, l) {
    if (c(this instanceof _), c(typeof l == "function"), !this.aborted) {
      if (this._processing++, this.paused) {
        this._processQueue.push([a, i, u, l]);
        return;
      }
      for (var h = 0; typeof a[h] == "string"; )
        h++;
      var y;
      switch (h) {
        case a.length:
          this._processSimple(a.join("/"), i, l);
          return;
        case 0:
          y = null;
          break;
        default:
          y = a.slice(0, h).join("/");
          break;
      }
      var S = a.slice(h), O;
      y === null ? O = "." : ((f(y) || f(a.map(function(P) {
        return typeof P == "string" ? P : "[*]";
      }).join("/"))) && (!y || !f(y)) && (y = "/" + y), O = y);
      var j = this._makeAbs(O);
      if (o(this, O))
        return l();
      var D = S[0] === e.GLOBSTAR;
      D ? this._processGlobStar(y, O, j, S, i, u, l) : this._processReaddir(y, O, j, S, i, u, l);
    }
  }, _.prototype._processReaddir = function(a, i, u, l, h, y, S) {
    var O = this;
    this._readdir(u, y, function(j, D) {
      return O._processReaddir2(a, i, u, l, h, y, D, S);
    });
  }, _.prototype._processReaddir2 = function(a, i, u, l, h, y, S, O) {
    if (!S)
      return O();
    for (var j = l[0], D = !!this.minimatch.negate, P = j._glob, G = this.dot || P.charAt(0) === ".", T = [], $ = 0; $ < S.length; $++) {
      var R = S[$];
      if (R.charAt(0) !== "." || G) {
        var z;
        D && !a ? z = !R.match(j) : z = R.match(j), z && T.push(R);
      }
    }
    var V = T.length;
    if (V === 0)
      return O();
    if (l.length === 1 && !this.mark && !this.stat) {
      this.matches[h] || (this.matches[h] = /* @__PURE__ */ Object.create(null));
      for (var $ = 0; $ < V; $++) {
        var R = T[$];
        a && (a !== "/" ? R = a + "/" + R : R = a + R), R.charAt(0) === "/" && !this.nomount && (R = s.join(this.root, R)), this._emitMatch(h, R);
      }
      return O();
    }
    l.shift();
    for (var $ = 0; $ < V; $++) {
      var R = T[$];
      a && (a !== "/" ? R = a + "/" + R : R = a + R), this._process([R].concat(l), h, y, O);
    }
    O();
  }, _.prototype._emitMatch = function(a, i) {
    if (!this.aborted && !p(this, i)) {
      if (this.paused) {
        this._emitQueue.push([a, i]);
        return;
      }
      var u = f(i) ? i : this._makeAbs(i);
      if (this.mark && (i = this._mark(i)), this.absolute && (i = u), !this.matches[a][i]) {
        if (this.nodir) {
          var l = this.cache[u];
          if (l === "DIR" || Array.isArray(l))
            return;
        }
        this.matches[a][i] = !0;
        var h = this.statCache[u];
        h && this.emit("stat", i, h), this.emit("match", i);
      }
    }
  }, _.prototype._readdirInGlobStar = function(a, i) {
    if (this.aborted)
      return;
    if (this.follow)
      return this._readdir(a, !1, i);
    var u = "lstat\0" + a, l = this, h = k(u, y);
    h && l.fs.lstat(a, h);
    function y(S, O) {
      if (S && S.code === "ENOENT")
        return i();
      var j = O && O.isSymbolicLink();
      l.symlinks[a] = j, !j && O && !O.isDirectory() ? (l.cache[a] = "FILE", i()) : l._readdir(a, !1, i);
    }
  }, _.prototype._readdir = function(a, i, u) {
    if (!this.aborted && (u = k("readdir\0" + a + "\0" + i, u), !!u)) {
      if (i && !E(this.symlinks, a))
        return this._readdirInGlobStar(a, u);
      if (E(this.cache, a)) {
        var l = this.cache[a];
        if (!l || l === "FILE")
          return u();
        if (Array.isArray(l))
          return u(null, l);
      }
      var h = this;
      h.fs.readdir(a, I(this, a, u));
    }
  };
  function I(a, i, u) {
    return function(l, h) {
      l ? a._readdirError(i, l, u) : a._readdirEntries(i, h, u);
    };
  }
  return _.prototype._readdirEntries = function(a, i, u) {
    if (!this.aborted) {
      if (!this.mark && !this.stat)
        for (var l = 0; l < i.length; l++) {
          var h = i[l];
          a === "/" ? h = a + h : h = a + "/" + h, this.cache[h] = !0;
        }
      return this.cache[a] = i, u(null, i);
    }
  }, _.prototype._readdirError = function(a, i, u) {
    if (!this.aborted) {
      switch (i.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var l = this._makeAbs(a);
          if (this.cache[l] = "FILE", l === this.cwdAbs) {
            var h = new Error(i.code + " invalid cwd " + this.cwd);
            h.path = this.cwd, h.code = i.code, this.emit("error", h), this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(a)] = !1;
          break;
        default:
          this.cache[this._makeAbs(a)] = !1, this.strict && (this.emit("error", i), this.abort()), this.silent || console.error("glob error", i);
          break;
      }
      return u();
    }
  }, _.prototype._processGlobStar = function(a, i, u, l, h, y, S) {
    var O = this;
    this._readdir(u, y, function(j, D) {
      O._processGlobStar2(a, i, u, l, h, y, D, S);
    });
  }, _.prototype._processGlobStar2 = function(a, i, u, l, h, y, S, O) {
    if (!S)
      return O();
    var j = l.slice(1), D = a ? [a] : [], P = D.concat(j);
    this._process(P, h, !1, O);
    var G = this.symlinks[u], T = S.length;
    if (G && y)
      return O();
    for (var $ = 0; $ < T; $++) {
      var R = S[$];
      if (!(R.charAt(0) === "." && !this.dot)) {
        var z = D.concat(S[$], j);
        this._process(z, h, !0, O);
        var V = D.concat(S[$], l);
        this._process(V, h, !0, O);
      }
    }
    O();
  }, _.prototype._processSimple = function(a, i, u) {
    var l = this;
    this._stat(a, function(h, y) {
      l._processSimple2(a, i, h, y, u);
    });
  }, _.prototype._processSimple2 = function(a, i, u, l, h) {
    if (this.matches[i] || (this.matches[i] = /* @__PURE__ */ Object.create(null)), !l)
      return h();
    if (a && f(a) && !this.nomount) {
      var y = /[\/\\]$/.test(a);
      a.charAt(0) === "/" ? a = s.join(this.root, a) : (a = s.resolve(this.root, a), y && (a += "/"));
    }
    process.platform === "win32" && (a = a.replace(/\\/g, "/")), this._emitMatch(i, a), h();
  }, _.prototype._stat = function(a, i) {
    var u = this._makeAbs(a), l = a.slice(-1) === "/";
    if (a.length > this.maxLength)
      return i();
    if (!this.stat && E(this.cache, u)) {
      var h = this.cache[u];
      if (Array.isArray(h) && (h = "DIR"), !l || h === "DIR")
        return i(null, h);
      if (l && h === "FILE")
        return i();
    }
    var y = this.statCache[u];
    if (y !== void 0) {
      if (y === !1)
        return i(null, y);
      var S = y.isDirectory() ? "DIR" : "FILE";
      return l && S === "FILE" ? i() : i(null, S, y);
    }
    var O = this, j = k("stat\0" + u, D);
    j && O.fs.lstat(u, j);
    function D(P, G) {
      if (G && G.isSymbolicLink())
        return O.fs.stat(u, function(T, $) {
          T ? O._stat2(a, u, null, G, i) : O._stat2(a, u, T, $, i);
        });
      O._stat2(a, u, P, G, i);
    }
  }, _.prototype._stat2 = function(a, i, u, l, h) {
    if (u && (u.code === "ENOENT" || u.code === "ENOTDIR"))
      return this.statCache[i] = !1, h();
    var y = a.slice(-1) === "/";
    if (this.statCache[i] = l, i.slice(-1) === "/" && l && !l.isDirectory())
      return h(null, !1, l);
    var S = !0;
    return l && (S = l.isDirectory() ? "DIR" : "FILE"), this.cache[i] = this.cache[i] || S, y && S === "FILE" ? h() : h(null, S, l);
  }, ot;
}
var vt = Zt();
jt.existsSync;
const bt = "(.*)", xe = "(.+)", Kt = "./routes";
function Ue() {
  return vt.sync("**/*/", { cwd: Kt }).map((t) => ({
    filename: t,
    path: `/${t.substr(0, t.length - 1)}`.replace(/\[?\[\.\.\.(.*?)\]\]?/g, bt).replace(/\[(.*?)\]/g, ":$1")
  }));
}
function ze() {
  return [Xt()];
}
function Xt({ route: t, path: e = "", parentPath: r = "" } = {}) {
  var k, o, p;
  const n = Ue(), s = ((k = e.match(/\//g)) == null ? void 0 : k.length) || 0, c = `${Kt}/${(t == null ? void 0 : t.filename) || ""}`, f = (o = vt.sync("page.{js,jsx,ts,tsx}", { cwd: c })) == null ? void 0 : o[0], g = (p = vt.sync("layout.{js,jsx,ts,tsx}", { cwd: c })) == null ? void 0 : p[0], v = f && `${c}${f}`, b = g && `${c}${g}`, E = We({ routes: n, parentPath: e, depth: s });
  if (v) {
    const d = E.findIndex(({ path: w }) => w === `/${bt}`);
    d !== -1 && (E[d].path = `/${xe}`), E.push({
      fullPath: e,
      path: "",
      moduleUrl: v,
      depth: s,
      children: []
    });
  }
  return {
    fullPath: e || "",
    path: (e == null ? void 0 : e.replace(r, "")) || "",
    moduleUrl: b,
    depth: s,
    children: E
  };
}
function We({ routes: t, parentPath: e, depth: r }) {
  return t.filter((n) => {
    var g;
    const c = ((g = n.path.match(/\//g)) == null ? void 0 : g.length) === r + 1, f = n.path.indexOf(e) !== -1;
    return c && f;
  }).map((n) => Xt({ route: n, path: n.path, parentPath: e })).sort((n, s) => n.path === `/${bt}` ? 1 : -1);
}
const At = process.env;
async function Ve(t, { packageVersion: e }) {
  if (!e)
    return console.warn("PackageVersion not found, you may need to deploy first"), null;
  const r = At.HOST_OVERRIDE ? { domainName: At.HOST_OVERRIDE } : { packageVersionId: e.id }, n = await Yt(r);
  return n || console.warn("Domain not found:", e.id), n;
}
export {
  Ve as getDomain,
  ze as getNestedRoutes
};
