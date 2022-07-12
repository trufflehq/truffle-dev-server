import { gql, getClient } from "https://tfl.dev/@truffle/api@^0.1.0/client.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
var fs$3 = {};
var __viteBrowserExternal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": fs$3
}, Symbol.toStringTag, { value: "Module" }));
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var a = Object.defineProperty({}, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var require$$9 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal);
var old$1 = {};
var pathModule = require$$9;
var isWindows$1 = process.platform === "win32";
var fs$2 = require$$9;
var DEBUG = {}.NODE_DEBUG && /fs/.test({}.NODE_DEBUG);
function rethrow() {
  var callback;
  if (DEBUG) {
    var backtrace = new Error();
    callback = debugCallback;
  } else
    callback = missingCallback;
  return callback;
  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }
  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;
      else if (!process.noDeprecation) {
        var msg = "fs: missing callback " + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}
function maybeCallback(cb) {
  return typeof cb === "function" ? cb : rethrow();
}
pathModule.normalize;
if (isWindows$1) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}
if (isWindows$1) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}
old$1.realpathSync = function realpathSync(p, cache) {
  p = pathModule.resolve(p);
  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }
  var original = p, seenLinks = {}, knownHard = {};
  var pos;
  var current;
  var base;
  var previous;
  start();
  function start() {
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = "";
    if (isWindows$1 && !knownHard[base]) {
      fs$2.lstatSync(base);
      knownHard[base] = true;
    }
  }
  while (pos < p.length) {
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;
    if (knownHard[base] || cache && cache[base] === base) {
      continue;
    }
    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      resolvedLink = cache[base];
    } else {
      var stat = fs$2.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache)
          cache[base] = base;
        continue;
      }
      var linkTarget = null;
      if (!isWindows$1) {
        var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs$2.statSync(base);
        linkTarget = fs$2.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      if (cache)
        cache[base] = resolvedLink;
      if (!isWindows$1)
        seenLinks[id] = linkTarget;
    }
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
  if (cache)
    cache[original] = p;
  return p;
};
old$1.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== "function") {
    cb = maybeCallback(cache);
    cache = null;
  }
  p = pathModule.resolve(p);
  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }
  var original = p, seenLinks = {}, knownHard = {};
  var pos;
  var current;
  var base;
  var previous;
  start();
  function start() {
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = "";
    if (isWindows$1 && !knownHard[base]) {
      fs$2.lstat(base, function(err) {
        if (err)
          return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }
  function LOOP() {
    if (pos >= p.length) {
      if (cache)
        cache[original] = p;
      return cb(null, p);
    }
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;
    if (knownHard[base] || cache && cache[base] === base) {
      return process.nextTick(LOOP);
    }
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      return gotResolvedLink(cache[base]);
    }
    return fs$2.lstat(base, gotStat);
  }
  function gotStat(err, stat) {
    if (err)
      return cb(err);
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache)
        cache[base] = base;
      return process.nextTick(LOOP);
    }
    if (!isWindows$1) {
      var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs$2.stat(base, function(err2) {
      if (err2)
        return cb(err2);
      fs$2.readlink(base, function(err3, target) {
        if (!isWindows$1)
          seenLinks[id] = target;
        gotTarget(err3, target);
      });
    });
  }
  function gotTarget(err, target, base2) {
    if (err)
      return cb(err);
    var resolvedLink = pathModule.resolve(previous, target);
    if (cache)
      cache[base2] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }
  function gotResolvedLink(resolvedLink) {
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};
var fs_realpath = realpath2;
realpath2.realpath = realpath2;
realpath2.sync = realpathSync2;
realpath2.realpathSync = realpathSync2;
realpath2.monkeypatch = monkeypatch;
realpath2.unmonkeypatch = unmonkeypatch;
var fs$1 = require$$9;
var origRealpath = fs$1.realpath;
var origRealpathSync = fs$1.realpathSync;
var version = process.version;
var ok = /^v[0-5]\./.test(version);
var old = old$1;
function newError(er) {
  return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
}
function realpath2(p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb);
  }
  if (typeof cache === "function") {
    cb = cache;
    cache = null;
  }
  origRealpath(p, cache, function(er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb);
    } else {
      cb(er, result);
    }
  });
}
function realpathSync2(p, cache) {
  if (ok) {
    return origRealpathSync(p, cache);
  }
  try {
    return origRealpathSync(p, cache);
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache);
    } else {
      throw er;
    }
  }
}
function monkeypatch() {
  fs$1.realpath = realpath2;
  fs$1.realpathSync = realpathSync2;
}
function unmonkeypatch() {
  fs$1.realpath = origRealpath;
  fs$1.realpathSync = origRealpathSync;
}
const isWindows = typeof process === "object" && process && process.platform === "win32";
var path$4 = isWindows ? { sep: "\\" } : { sep: "/" };
var balancedMatch = balanced$1;
function balanced$1(a, b, str) {
  if (a instanceof RegExp)
    a = maybeMatch(a, str);
  if (b instanceof RegExp)
    b = maybeMatch(b, str);
  var r = range(a, b, str);
  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}
function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}
balanced$1.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;
  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;
    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [begs.pop(), bi];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai < bi && ai >= 0 ? ai : bi;
    }
    if (begs.length) {
      result = [left, right];
    }
  }
  return result;
}
var balanced = balancedMatch;
var braceExpansion = expandTop;
var escSlash = "\0SLASH" + Math.random() + "\0";
var escOpen = "\0OPEN" + Math.random() + "\0";
var escClose = "\0CLOSE" + Math.random() + "\0";
var escComma = "\0COMMA" + Math.random() + "\0";
var escPeriod = "\0PERIOD" + Math.random() + "\0";
function numeric(str) {
  return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
  return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
}
function unescapeBraces(str) {
  return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
}
function parseCommaParts(str) {
  if (!str)
    return [""];
  var parts = [];
  var m = balanced("{", "}", str);
  if (!m)
    return str.split(",");
  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(",");
  p[p.length - 1] += "{" + body + "}";
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }
  parts.push.apply(parts, p);
  return parts;
}
function expandTop(str) {
  if (!str)
    return [];
  if (str.substr(0, 2) === "{}") {
    str = "\\{\\}" + str.substr(2);
  }
  return expand$1(escapeBraces(str), true).map(unescapeBraces);
}
function embrace(str) {
  return "{" + str + "}";
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}
function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}
function expand$1(str, isTop) {
  var expansions = [];
  var m = balanced("{", "}", str);
  if (!m)
    return [str];
  var pre = m.pre;
  var post = m.post.length ? expand$1(m.post, false) : [""];
  if (/\$$/.test(m.pre)) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + "{" + m.body + "}" + post[k];
      expansions.push(expansion);
    }
  } else {
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,.*\}/)) {
        str = m.pre + "{" + m.body + escClose + m.post;
        return expand$1(str);
      }
      return [str];
    }
    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        n = expand$1(n[0], false).map(embrace);
        if (n.length === 1) {
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }
    var N;
    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length);
      var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);
      N = [];
      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\")
            c = "";
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join("0");
              if (i < 0)
                c = "-" + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];
      for (var j = 0; j < n.length; j++) {
        N.push.apply(N, expand$1(n[j], false));
      }
    }
    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
  }
  return expansions;
}
const minimatch$3 = minimatch_1 = (p, pattern, options = {}) => {
  assertValidPattern(pattern);
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return new Minimatch$1(pattern, options).match(p);
};
var minimatch_1 = minimatch$3;
const path$3 = path$4;
minimatch$3.sep = path$3.sep;
const GLOBSTAR = Symbol("globstar **");
minimatch$3.GLOBSTAR = GLOBSTAR;
const expand = braceExpansion;
const plTypes = {
  "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
  "?": { open: "(?:", close: ")?" },
  "+": { open: "(?:", close: ")+" },
  "*": { open: "(?:", close: ")*" },
  "@": { open: "(?:", close: ")" }
};
const qmark = "[^/]";
const star = qmark + "*?";
const twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
const twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
const charSet = (s) => s.split("").reduce((set, c) => {
  set[c] = true;
  return set;
}, {});
const reSpecials = charSet("().*{}+?[]^$\\!");
const addPatternStartSet = charSet("[.(");
const slashSplit = /\/+/;
minimatch$3.filter = (pattern, options = {}) => (p, i, list) => minimatch$3(p, pattern, options);
const ext = (a, b = {}) => {
  const t = {};
  Object.keys(a).forEach((k) => t[k] = a[k]);
  Object.keys(b).forEach((k) => t[k] = b[k]);
  return t;
};
minimatch$3.defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch$3;
  }
  const orig = minimatch$3;
  const m = (p, pattern, options) => orig(p, pattern, ext(def, options));
  m.Minimatch = class Minimatch extends orig.Minimatch {
    constructor(pattern, options) {
      super(pattern, ext(def, options));
    }
  };
  m.Minimatch.defaults = (options) => orig.defaults(ext(def, options)).Minimatch;
  m.filter = (pattern, options) => orig.filter(pattern, ext(def, options));
  m.defaults = (options) => orig.defaults(ext(def, options));
  m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options));
  m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options));
  m.match = (list, pattern, options) => orig.match(list, pattern, ext(def, options));
  return m;
};
minimatch$3.braceExpand = (pattern, options) => braceExpand(pattern, options);
const braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [pattern];
  }
  return expand(pattern);
};
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
};
const SUBPARSE = Symbol("subparse");
minimatch$3.makeRe = (pattern, options) => new Minimatch$1(pattern, options || {}).makeRe();
minimatch$3.match = (list, pattern, options = {}) => {
  const mm = new Minimatch$1(pattern, options);
  list = list.filter((f) => mm.match(f));
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list;
};
const globUnescape = (s) => s.replace(/\\(.)/g, "$1");
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
class Minimatch$1 {
  constructor(pattern, options) {
    assertValidPattern(pattern);
    if (!options)
      options = {};
    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.make();
  }
  debug() {
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    let set = this.globSet = this.braceExpand();
    if (options.debug)
      this.debug = (...args) => console.error(...args);
    this.debug(this.pattern, set);
    set = this.globParts = set.map((s) => s.split(slashSplit));
    this.debug(this.pattern, set);
    set = set.map((s, si, set2) => s.map(this.parse, this));
    this.debug(this.pattern, set);
    set = set.filter((s) => s.indexOf(false) === -1);
    this.debug(this.pattern, set);
    this.set = set;
  }
  parseNegate() {
    if (this.options.nonegate)
      return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.substr(negateOffset);
    this.negate = negate;
  }
  matchOne(file, pattern, partial) {
    var options = this.options;
    this.debug("matchOne", { "this": this, file, pattern });
    this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false)
        return false;
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (; fi < fl; fi++) {
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
              return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
          if (fr === fl)
            return true;
        }
        return false;
      }
      var hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = f.match(p);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    }
    throw new Error("wtf?");
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  parse(pattern, isSub) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**") {
      if (!options.noglobstar)
        return GLOBSTAR;
      else
        pattern = "*";
    }
    if (pattern === "")
      return "";
    let re = "";
    let hasMagic = !!options.nocase;
    let escaping = false;
    const patternListStack = [];
    const negativeLists = [];
    let stateChar;
    let inClass = false;
    let reClassStart = -1;
    let classStart = -1;
    let cs;
    let pl;
    let sp;
    const patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
    const clearStateChar = () => {
      if (stateChar) {
        switch (stateChar) {
          case "*":
            re += star;
            hasMagic = true;
            break;
          case "?":
            re += qmark;
            hasMagic = true;
            break;
          default:
            re += "\\" + stateChar;
            break;
        }
        this.debug("clearStateChar %j %j", stateChar, re);
        stateChar = false;
      }
    };
    for (let i = 0, c; i < pattern.length && (c = pattern.charAt(i)); i++) {
      this.debug("%s	%s %s %j", pattern, i, re, c);
      if (escaping) {
        if (c === "/") {
          return false;
        }
        if (reSpecials[c]) {
          re += "\\";
        }
        re += c;
        escaping = false;
        continue;
      }
      switch (c) {
        case "/": {
          return false;
        }
        case "\\":
          clearStateChar();
          escaping = true;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
          if (inClass) {
            this.debug("  in class");
            if (c === "!" && i === classStart + 1)
              c = "^";
            re += c;
            continue;
          }
          this.debug("call clearStateChar %j", stateChar);
          clearStateChar();
          stateChar = c;
          if (options.noext)
            clearStateChar();
          continue;
        case "(":
          if (inClass) {
            re += "(";
            continue;
          }
          if (!stateChar) {
            re += "\\(";
            continue;
          }
          patternListStack.push({
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          });
          re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
          this.debug("plType %j %j", stateChar, re);
          stateChar = false;
          continue;
        case ")":
          if (inClass || !patternListStack.length) {
            re += "\\)";
            continue;
          }
          clearStateChar();
          hasMagic = true;
          pl = patternListStack.pop();
          re += pl.close;
          if (pl.type === "!") {
            negativeLists.push(pl);
          }
          pl.reEnd = re.length;
          continue;
        case "|":
          if (inClass || !patternListStack.length) {
            re += "\\|";
            continue;
          }
          clearStateChar();
          re += "|";
          continue;
        case "[":
          clearStateChar();
          if (inClass) {
            re += "\\" + c;
            continue;
          }
          inClass = true;
          classStart = i;
          reClassStart = re.length;
          re += c;
          continue;
        case "]":
          if (i === classStart + 1 || !inClass) {
            re += "\\" + c;
            continue;
          }
          cs = pattern.substring(classStart + 1, i);
          try {
            RegExp("[" + cs + "]");
          } catch (er) {
            sp = this.parse(cs, SUBPARSE);
            re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
            hasMagic = hasMagic || sp[1];
            inClass = false;
            continue;
          }
          hasMagic = true;
          inClass = false;
          re += c;
          continue;
        default:
          clearStateChar();
          if (reSpecials[c] && !(c === "^" && inClass)) {
            re += "\\";
          }
          re += c;
          break;
      }
    }
    if (inClass) {
      cs = pattern.substr(classStart + 1);
      sp = this.parse(cs, SUBPARSE);
      re = re.substr(0, reClassStart) + "\\[" + sp[0];
      hasMagic = hasMagic || sp[1];
    }
    for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
      let tail;
      tail = re.slice(pl.reStart + pl.open.length);
      this.debug("setting tail", re, pl);
      tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_, $1, $2) => {
        if (!$2) {
          $2 = "\\";
        }
        return $1 + $1 + $2 + "|";
      });
      this.debug("tail=%j\n   %s", tail, tail, pl, re);
      const t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
      hasMagic = true;
      re = re.slice(0, pl.reStart) + t + "\\(" + tail;
    }
    clearStateChar();
    if (escaping) {
      re += "\\\\";
    }
    const addPatternStart = addPatternStartSet[re.charAt(0)];
    for (let n = negativeLists.length - 1; n > -1; n--) {
      const nl = negativeLists[n];
      const nlBefore = re.slice(0, nl.reStart);
      const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
      let nlAfter = re.slice(nl.reEnd);
      const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;
      const openParensBefore = nlBefore.split("(").length - 1;
      let cleanAfter = nlAfter;
      for (let i = 0; i < openParensBefore; i++) {
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
      }
      nlAfter = cleanAfter;
      const dollar = nlAfter === "" && isSub !== SUBPARSE ? "$" : "";
      re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
    }
    if (re !== "" && hasMagic) {
      re = "(?=.)" + re;
    }
    if (addPatternStart) {
      re = patternStart + re;
    }
    if (isSub === SUBPARSE) {
      return [re, hasMagic];
    }
    if (!hasMagic) {
      return globUnescape(pattern);
    }
    const flags = options.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + re + "$", flags), {
        _glob: pattern,
        _src: re
      });
    } catch (er) {
      return new RegExp("$.");
    }
  }
  makeRe() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    const set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
    const flags = options.nocase ? "i" : "";
    let re = set.map((pattern) => {
      pattern = pattern.map((p) => typeof p === "string" ? regExpEscape(p) : p === GLOBSTAR ? GLOBSTAR : p._src).reduce((set2, p) => {
        if (!(set2[set2.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
          set2.push(p);
        }
        return set2;
      }, []);
      pattern.forEach((p, i) => {
        if (p !== GLOBSTAR || pattern[i - 1] === GLOBSTAR) {
          return;
        }
        if (i === 0) {
          if (pattern.length > 1) {
            pattern[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + pattern[i + 1];
          } else {
            pattern[i] = twoStar;
          }
        } else if (i === pattern.length - 1) {
          pattern[i - 1] += "(?:\\/|" + twoStar + ")?";
        } else {
          pattern[i - 1] += "(?:\\/|\\/" + twoStar + "\\/)" + pattern[i + 1];
          pattern[i + 1] = GLOBSTAR;
        }
      });
      return pattern.filter((p) => p !== GLOBSTAR).join("/");
    }).join("|");
    re = "^(?:" + re + ")$";
    if (this.negate)
      re = "^(?!" + re + ").*$";
    try {
      this.regexp = new RegExp(re, flags);
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  match(f, partial = this.partial) {
    this.debug("match", f, this.pattern);
    if (this.comment)
      return false;
    if (this.empty)
      return f === "";
    if (f === "/" && partial)
      return true;
    const options = this.options;
    if (path$3.sep !== "/") {
      f = f.split(path$3.sep).join("/");
    }
    f = f.split(slashSplit);
    this.debug(this.pattern, "split", f);
    const set = this.set;
    this.debug(this.pattern, "set", set);
    let filename;
    for (let i = f.length - 1; i >= 0; i--) {
      filename = f[i];
      if (filename)
        break;
    }
    for (let i = 0; i < set.length; i++) {
      const pattern = set[i];
      let file = f;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      const hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate)
          return true;
        return !this.negate;
      }
    }
    if (options.flipNegate)
      return false;
    return this.negate;
  }
  static defaults(def) {
    return minimatch$3.defaults(def).Minimatch;
  }
}
minimatch$3.Minimatch = Minimatch$1;
var inherits_browser = { exports: {} };
if (typeof Object.create === "function") {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
var common$2 = {};
common$2.setopts = setopts$2;
common$2.ownProp = ownProp$2;
common$2.makeAbs = makeAbs;
common$2.finish = finish;
common$2.mark = mark;
common$2.isIgnored = isIgnored$2;
common$2.childrenIgnored = childrenIgnored$2;
function ownProp$2(obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field);
}
var fs = require$$9;
var path$2 = require$$9;
var minimatch$2 = minimatch_1;
var isAbsolute$2 = require$$9.isAbsolute;
var Minimatch = minimatch$2.Minimatch;
function alphasort(a, b) {
  return a.localeCompare(b, "en");
}
function setupIgnores(self, options) {
  self.ignore = options.ignore || [];
  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore];
  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap);
  }
}
function ignoreMap(pattern) {
  var gmatcher = null;
  if (pattern.slice(-3) === "/**") {
    var gpattern = pattern.replace(/(\/\*\*)+$/, "");
    gmatcher = new Minimatch(gpattern, { dot: true });
  }
  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher
  };
}
function setopts$2(self, pattern, options) {
  if (!options)
    options = {};
  if (options.matchBase && pattern.indexOf("/") === -1) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar");
    }
    pattern = "**/" + pattern;
  }
  self.silent = !!options.silent;
  self.pattern = pattern;
  self.strict = options.strict !== false;
  self.realpath = !!options.realpath;
  self.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
  self.follow = !!options.follow;
  self.dot = !!options.dot;
  self.mark = !!options.mark;
  self.nodir = !!options.nodir;
  if (self.nodir)
    self.mark = true;
  self.sync = !!options.sync;
  self.nounique = !!options.nounique;
  self.nonull = !!options.nonull;
  self.nosort = !!options.nosort;
  self.nocase = !!options.nocase;
  self.stat = !!options.stat;
  self.noprocess = !!options.noprocess;
  self.absolute = !!options.absolute;
  self.fs = options.fs || fs;
  self.maxLength = options.maxLength || Infinity;
  self.cache = options.cache || /* @__PURE__ */ Object.create(null);
  self.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
  self.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
  setupIgnores(self, options);
  self.changedCwd = false;
  var cwd = process.cwd();
  if (!ownProp$2(options, "cwd"))
    self.cwd = path$2.resolve(cwd);
  else {
    self.cwd = path$2.resolve(options.cwd);
    self.changedCwd = self.cwd !== cwd;
  }
  self.root = options.root || path$2.resolve(self.cwd, "/");
  self.root = path$2.resolve(self.root);
  self.cwdAbs = isAbsolute$2(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
  self.nomount = !!options.nomount;
  if (process.platform === "win32") {
    self.root = self.root.replace(/\\/g, "/");
    self.cwd = self.cwd.replace(/\\/g, "/");
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
  }
  options.nonegate = true;
  options.nocomment = true;
  options.allowWindowsEscape = true;
  self.minimatch = new Minimatch(pattern, options);
  self.options = self.minimatch.options;
}
function finish(self) {
  var nou = self.nounique;
  var all = nou ? [] : /* @__PURE__ */ Object.create(null);
  for (var i = 0, l = self.matches.length; i < l; i++) {
    var matches = self.matches[i];
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        var literal = self.minimatch.globSet[i];
        if (nou)
          all.push(literal);
        else
          all[literal] = true;
      }
    } else {
      var m = Object.keys(matches);
      if (nou)
        all.push.apply(all, m);
      else
        m.forEach(function(m2) {
          all[m2] = true;
        });
    }
  }
  if (!nou)
    all = Object.keys(all);
  if (!self.nosort)
    all = all.sort(alphasort);
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i]);
    }
    if (self.nodir) {
      all = all.filter(function(e) {
        var notDir = !/\/$/.test(e);
        var c = self.cache[e] || self.cache[makeAbs(self, e)];
        if (notDir && c)
          notDir = c !== "DIR" && !Array.isArray(c);
        return notDir;
      });
    }
  }
  if (self.ignore.length)
    all = all.filter(function(m2) {
      return !isIgnored$2(self, m2);
    });
  self.found = all;
}
function mark(self, p) {
  var abs = makeAbs(self, p);
  var c = self.cache[abs];
  var m = p;
  if (c) {
    var isDir = c === "DIR" || Array.isArray(c);
    var slash = p.slice(-1) === "/";
    if (isDir && !slash)
      m += "/";
    else if (!isDir && slash)
      m = m.slice(0, -1);
    if (m !== p) {
      var mabs = makeAbs(self, m);
      self.statCache[mabs] = self.statCache[abs];
      self.cache[mabs] = self.cache[abs];
    }
  }
  return m;
}
function makeAbs(self, f) {
  var abs = f;
  if (f.charAt(0) === "/") {
    abs = path$2.join(self.root, f);
  } else if (isAbsolute$2(f) || f === "") {
    abs = f;
  } else if (self.changedCwd) {
    abs = path$2.resolve(self.cwd, f);
  } else {
    abs = path$2.resolve(f);
  }
  if (process.platform === "win32")
    abs = abs.replace(/\\/g, "/");
  return abs;
}
function isIgnored$2(self, path2) {
  if (!self.ignore.length)
    return false;
  return self.ignore.some(function(item) {
    return item.matcher.match(path2) || !!(item.gmatcher && item.gmatcher.match(path2));
  });
}
function childrenIgnored$2(self, path2) {
  if (!self.ignore.length)
    return false;
  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path2));
  });
}
var sync = globSync$1;
globSync$1.GlobSync = GlobSync$1;
var rp$1 = fs_realpath;
var minimatch$1 = minimatch_1;
minimatch$1.Minimatch;
glob_1.Glob;
var path$1 = require$$9;
var assert$1 = require$$9;
var isAbsolute$1 = require$$9.isAbsolute;
var common$1 = common$2;
var setopts$1 = common$1.setopts;
var ownProp$1 = common$1.ownProp;
var childrenIgnored$1 = common$1.childrenIgnored;
var isIgnored$1 = common$1.isIgnored;
function globSync$1(pattern, options) {
  if (typeof options === "function" || arguments.length === 3)
    throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
  return new GlobSync$1(pattern, options).found;
}
function GlobSync$1(pattern, options) {
  if (!pattern)
    throw new Error("must provide pattern");
  if (typeof options === "function" || arguments.length === 3)
    throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
  if (!(this instanceof GlobSync$1))
    return new GlobSync$1(pattern, options);
  setopts$1(this, pattern, options);
  if (this.noprocess)
    return this;
  var n = this.minimatch.set.length;
  this.matches = new Array(n);
  for (var i = 0; i < n; i++) {
    this._process(this.minimatch.set[i], i, false);
  }
  this._finish();
}
GlobSync$1.prototype._finish = function() {
  assert$1.ok(this instanceof GlobSync$1);
  if (this.realpath) {
    var self = this;
    this.matches.forEach(function(matchset, index) {
      var set = self.matches[index] = /* @__PURE__ */ Object.create(null);
      for (var p in matchset) {
        try {
          p = self._makeAbs(p);
          var real = rp$1.realpathSync(p, self.realpathCache);
          set[real] = true;
        } catch (er) {
          if (er.syscall === "stat")
            set[self._makeAbs(p)] = true;
          else
            throw er;
        }
      }
    });
  }
  common$1.finish(this);
};
GlobSync$1.prototype._process = function(pattern, index, inGlobStar) {
  assert$1.ok(this instanceof GlobSync$1);
  var n = 0;
  while (typeof pattern[n] === "string") {
    n++;
  }
  var prefix;
  switch (n) {
    case pattern.length:
      this._processSimple(pattern.join("/"), index);
      return;
    case 0:
      prefix = null;
      break;
    default:
      prefix = pattern.slice(0, n).join("/");
      break;
  }
  var remain = pattern.slice(n);
  var read;
  if (prefix === null)
    read = ".";
  else if (isAbsolute$1(prefix) || isAbsolute$1(pattern.map(function(p) {
    return typeof p === "string" ? p : "[*]";
  }).join("/"))) {
    if (!prefix || !isAbsolute$1(prefix))
      prefix = "/" + prefix;
    read = prefix;
  } else
    read = prefix;
  var abs = this._makeAbs(read);
  if (childrenIgnored$1(this, read))
    return;
  var isGlobStar = remain[0] === minimatch$1.GLOBSTAR;
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
};
GlobSync$1.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar);
  if (!entries)
    return;
  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === ".";
  var matchedEntries = [];
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.charAt(0) !== "." || dotOk) {
      var m;
      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }
      if (m)
        matchedEntries.push(e);
    }
  }
  var len = matchedEntries.length;
  if (len === 0)
    return;
  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = /* @__PURE__ */ Object.create(null);
    for (var i = 0; i < len; i++) {
      var e = matchedEntries[i];
      if (prefix) {
        if (prefix.slice(-1) !== "/")
          e = prefix + "/" + e;
        else
          e = prefix + e;
      }
      if (e.charAt(0) === "/" && !this.nomount) {
        e = path$1.join(this.root, e);
      }
      this._emitMatch(index, e);
    }
    return;
  }
  remain.shift();
  for (var i = 0; i < len; i++) {
    var e = matchedEntries[i];
    var newPattern;
    if (prefix)
      newPattern = [prefix, e];
    else
      newPattern = [e];
    this._process(newPattern.concat(remain), index, inGlobStar);
  }
};
GlobSync$1.prototype._emitMatch = function(index, e) {
  if (isIgnored$1(this, e))
    return;
  var abs = this._makeAbs(e);
  if (this.mark)
    e = this._mark(e);
  if (this.absolute) {
    e = abs;
  }
  if (this.matches[index][e])
    return;
  if (this.nodir) {
    var c = this.cache[abs];
    if (c === "DIR" || Array.isArray(c))
      return;
  }
  this.matches[index][e] = true;
  if (this.stat)
    this._stat(e);
};
GlobSync$1.prototype._readdirInGlobStar = function(abs) {
  if (this.follow)
    return this._readdir(abs, false);
  var entries;
  var lstat;
  try {
    lstat = this.fs.lstatSync(abs);
  } catch (er) {
    if (er.code === "ENOENT") {
      return null;
    }
  }
  var isSym = lstat && lstat.isSymbolicLink();
  this.symlinks[abs] = isSym;
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = "FILE";
  else
    entries = this._readdir(abs, false);
  return entries;
};
GlobSync$1.prototype._readdir = function(abs, inGlobStar) {
  if (inGlobStar && !ownProp$1(this.symlinks, abs))
    return this._readdirInGlobStar(abs);
  if (ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === "FILE")
      return null;
    if (Array.isArray(c))
      return c;
  }
  try {
    return this._readdirEntries(abs, this.fs.readdirSync(abs));
  } catch (er) {
    this._readdirError(abs, er);
    return null;
  }
};
GlobSync$1.prototype._readdirEntries = function(abs, entries) {
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (abs === "/")
        e = abs + e;
      else
        e = abs + "/" + e;
      this.cache[e] = true;
    }
  }
  this.cache[abs] = entries;
  return entries;
};
GlobSync$1.prototype._readdirError = function(f, er) {
  switch (er.code) {
    case "ENOTSUP":
    case "ENOTDIR":
      var abs = this._makeAbs(f);
      this.cache[abs] = "FILE";
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + " invalid cwd " + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        throw error;
      }
      break;
    case "ENOENT":
    case "ELOOP":
    case "ENAMETOOLONG":
    case "UNKNOWN":
      this.cache[this._makeAbs(f)] = false;
      break;
    default:
      this.cache[this._makeAbs(f)] = false;
      if (this.strict)
        throw er;
      if (!this.silent)
        console.error("glob error", er);
      break;
  }
};
GlobSync$1.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar);
  if (!entries)
    return;
  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [prefix] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar);
  this._process(noGlobStar, index, false);
  var len = entries.length;
  var isSym = this.symlinks[abs];
  if (isSym && inGlobStar)
    return;
  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === "." && !this.dot)
      continue;
    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    this._process(instead, index, true);
    var below = gspref.concat(entries[i], remain);
    this._process(below, index, true);
  }
};
GlobSync$1.prototype._processSimple = function(prefix, index) {
  var exists = this._stat(prefix);
  if (!this.matches[index])
    this.matches[index] = /* @__PURE__ */ Object.create(null);
  if (!exists)
    return;
  if (prefix && isAbsolute$1(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);
    if (prefix.charAt(0) === "/") {
      prefix = path$1.join(this.root, prefix);
    } else {
      prefix = path$1.resolve(this.root, prefix);
      if (trail)
        prefix += "/";
    }
  }
  if (process.platform === "win32")
    prefix = prefix.replace(/\\/g, "/");
  this._emitMatch(index, prefix);
};
GlobSync$1.prototype._stat = function(f) {
  var abs = this._makeAbs(f);
  var needDir = f.slice(-1) === "/";
  if (f.length > this.maxLength)
    return false;
  if (!this.stat && ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];
    if (Array.isArray(c))
      c = "DIR";
    if (!needDir || c === "DIR")
      return c;
    if (needDir && c === "FILE")
      return false;
  }
  var stat = this.statCache[abs];
  if (!stat) {
    var lstat;
    try {
      lstat = this.fs.lstatSync(abs);
    } catch (er) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return false;
      }
    }
    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = this.fs.statSync(abs);
      } catch (er) {
        stat = lstat;
      }
    } else {
      stat = lstat;
    }
  }
  this.statCache[abs] = stat;
  var c = true;
  if (stat)
    c = stat.isDirectory() ? "DIR" : "FILE";
  this.cache[abs] = this.cache[abs] || c;
  if (needDir && c === "FILE")
    return false;
  return c;
};
GlobSync$1.prototype._mark = function(p) {
  return common$1.mark(this, p);
};
GlobSync$1.prototype._makeAbs = function(f) {
  return common$1.makeAbs(this, f);
};
var wrappy_1 = wrappy$2;
function wrappy$2(fn, cb) {
  if (fn && cb)
    return wrappy$2(fn)(cb);
  if (typeof fn !== "function")
    throw new TypeError("need wrapper function");
  Object.keys(fn).forEach(function(k) {
    wrapper[k] = fn[k];
  });
  return wrapper;
  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb2 = args[args.length - 1];
    if (typeof ret === "function" && ret !== cb2) {
      Object.keys(cb2).forEach(function(k) {
        ret[k] = cb2[k];
      });
    }
    return ret;
  }
}
var once$3 = { exports: {} };
var wrappy$1 = wrappy_1;
once$3.exports = wrappy$1(once$2);
once$3.exports.strict = wrappy$1(onceStrict);
once$2.proto = once$2(function() {
  Object.defineProperty(Function.prototype, "once", {
    value: function() {
      return once$2(this);
    },
    configurable: true
  });
  Object.defineProperty(Function.prototype, "onceStrict", {
    value: function() {
      return onceStrict(this);
    },
    configurable: true
  });
});
function once$2(fn) {
  var f = function() {
    if (f.called)
      return f.value;
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };
  f.called = false;
  return f;
}
function onceStrict(fn) {
  var f = function() {
    if (f.called)
      throw new Error(f.onceError);
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };
  var name = fn.name || "Function wrapped with `once`";
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f;
}
var wrappy = wrappy_1;
var reqs = /* @__PURE__ */ Object.create(null);
var once$1 = once$3.exports;
var inflight_1 = wrappy(inflight$1);
function inflight$1(key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb);
    return null;
  } else {
    reqs[key] = [cb];
    return makeres(key);
  }
}
function makeres(key) {
  return once$1(function RES() {
    var cbs = reqs[key];
    var len = cbs.length;
    var args = slice(arguments);
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args);
      }
    } finally {
      if (cbs.length > len) {
        cbs.splice(0, len);
        process.nextTick(function() {
          RES.apply(null, args);
        });
      } else {
        delete reqs[key];
      }
    }
  });
}
function slice(args) {
  var length = args.length;
  var array = [];
  for (var i = 0; i < length; i++)
    array[i] = args[i];
  return array;
}
var glob_1 = glob;
var rp = fs_realpath;
var minimatch = minimatch_1;
minimatch.Minimatch;
var inherits = inherits_browser.exports;
var EE = require$$9.EventEmitter;
var path = require$$9;
var assert = require$$9;
var isAbsolute = require$$9.isAbsolute;
var globSync = sync;
var common = common$2;
var setopts = common.setopts;
var ownProp = common.ownProp;
var inflight = inflight_1;
var childrenIgnored = common.childrenIgnored;
var isIgnored = common.isIgnored;
var once = once$3.exports;
function glob(pattern, options, cb) {
  if (typeof options === "function")
    cb = options, options = {};
  if (!options)
    options = {};
  if (options.sync) {
    if (cb)
      throw new TypeError("callback provided to sync glob");
    return globSync(pattern, options);
  }
  return new Glob(pattern, options, cb);
}
glob.sync = globSync;
var GlobSync = glob.GlobSync = globSync.GlobSync;
glob.glob = glob;
function extend(origin, add) {
  if (add === null || typeof add !== "object") {
    return origin;
  }
  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
glob.hasMagic = function(pattern, options_) {
  var options = extend({}, options_);
  options.noprocess = true;
  var g = new Glob(pattern, options);
  var set = g.minimatch.set;
  if (!pattern)
    return false;
  if (set.length > 1)
    return true;
  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== "string")
      return true;
  }
  return false;
};
glob.Glob = Glob;
inherits(Glob, EE);
function Glob(pattern, options, cb) {
  if (typeof options === "function") {
    cb = options;
    options = null;
  }
  if (options && options.sync) {
    if (cb)
      throw new TypeError("callback provided to sync glob");
    return new GlobSync(pattern, options);
  }
  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb);
  setopts(this, pattern, options);
  this._didRealPath = false;
  var n = this.minimatch.set.length;
  this.matches = new Array(n);
  if (typeof cb === "function") {
    cb = once(cb);
    this.on("error", cb);
    this.on("end", function(matches) {
      cb(null, matches);
    });
  }
  var self = this;
  this._processing = 0;
  this._emitQueue = [];
  this._processQueue = [];
  this.paused = false;
  if (this.noprocess)
    return this;
  if (n === 0)
    return done();
  var sync2 = true;
  for (var i = 0; i < n; i++) {
    this._process(this.minimatch.set[i], i, false, done);
  }
  sync2 = false;
  function done() {
    --self._processing;
    if (self._processing <= 0) {
      if (sync2) {
        process.nextTick(function() {
          self._finish();
        });
      } else {
        self._finish();
      }
    }
  }
}
Glob.prototype._finish = function() {
  assert(this instanceof Glob);
  if (this.aborted)
    return;
  if (this.realpath && !this._didRealpath)
    return this._realpath();
  common.finish(this);
  this.emit("end", this.found);
};
Glob.prototype._realpath = function() {
  if (this._didRealpath)
    return;
  this._didRealpath = true;
  var n = this.matches.length;
  if (n === 0)
    return this._finish();
  var self = this;
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next);
  function next() {
    if (--n === 0)
      self._finish();
  }
};
Glob.prototype._realpathSet = function(index, cb) {
  var matchset = this.matches[index];
  if (!matchset)
    return cb();
  var found = Object.keys(matchset);
  var self = this;
  var n = found.length;
  if (n === 0)
    return cb();
  var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
  found.forEach(function(p, i) {
    p = self._makeAbs(p);
    rp.realpath(p, self.realpathCache, function(er, real) {
      if (!er)
        set[real] = true;
      else if (er.syscall === "stat")
        set[p] = true;
      else
        self.emit("error", er);
      if (--n === 0) {
        self.matches[index] = set;
        cb();
      }
    });
  });
};
Glob.prototype._mark = function(p) {
  return common.mark(this, p);
};
Glob.prototype._makeAbs = function(f) {
  return common.makeAbs(this, f);
};
Glob.prototype.abort = function() {
  this.aborted = true;
  this.emit("abort");
};
Glob.prototype.pause = function() {
  if (!this.paused) {
    this.paused = true;
    this.emit("pause");
  }
};
Glob.prototype.resume = function() {
  if (this.paused) {
    this.emit("resume");
    this.paused = false;
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0);
      this._emitQueue.length = 0;
      for (var i = 0; i < eq.length; i++) {
        var e = eq[i];
        this._emitMatch(e[0], e[1]);
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0);
      this._processQueue.length = 0;
      for (var i = 0; i < pq.length; i++) {
        var p = pq[i];
        this._processing--;
        this._process(p[0], p[1], p[2], p[3]);
      }
    }
  }
};
Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob);
  assert(typeof cb === "function");
  if (this.aborted)
    return;
  this._processing++;
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb]);
    return;
  }
  var n = 0;
  while (typeof pattern[n] === "string") {
    n++;
  }
  var prefix;
  switch (n) {
    case pattern.length:
      this._processSimple(pattern.join("/"), index, cb);
      return;
    case 0:
      prefix = null;
      break;
    default:
      prefix = pattern.slice(0, n).join("/");
      break;
  }
  var remain = pattern.slice(n);
  var read;
  if (prefix === null)
    read = ".";
  else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
    return typeof p === "string" ? p : "[*]";
  }).join("/"))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = "/" + prefix;
    read = prefix;
  } else
    read = prefix;
  var abs = this._makeAbs(read);
  if (childrenIgnored(this, read))
    return cb();
  var isGlobStar = remain[0] === minimatch.GLOBSTAR;
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
};
Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;
  this._readdir(abs, inGlobStar, function(er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
  });
};
Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  if (!entries)
    return cb();
  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === ".";
  var matchedEntries = [];
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.charAt(0) !== "." || dotOk) {
      var m;
      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }
      if (m)
        matchedEntries.push(e);
    }
  }
  var len = matchedEntries.length;
  if (len === 0)
    return cb();
  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = /* @__PURE__ */ Object.create(null);
    for (var i = 0; i < len; i++) {
      var e = matchedEntries[i];
      if (prefix) {
        if (prefix !== "/")
          e = prefix + "/" + e;
        else
          e = prefix + e;
      }
      if (e.charAt(0) === "/" && !this.nomount) {
        e = path.join(this.root, e);
      }
      this._emitMatch(index, e);
    }
    return cb();
  }
  remain.shift();
  for (var i = 0; i < len; i++) {
    var e = matchedEntries[i];
    if (prefix) {
      if (prefix !== "/")
        e = prefix + "/" + e;
      else
        e = prefix + e;
    }
    this._process([e].concat(remain), index, inGlobStar, cb);
  }
  cb();
};
Glob.prototype._emitMatch = function(index, e) {
  if (this.aborted)
    return;
  if (isIgnored(this, e))
    return;
  if (this.paused) {
    this._emitQueue.push([index, e]);
    return;
  }
  var abs = isAbsolute(e) ? e : this._makeAbs(e);
  if (this.mark)
    e = this._mark(e);
  if (this.absolute)
    e = abs;
  if (this.matches[index][e])
    return;
  if (this.nodir) {
    var c = this.cache[abs];
    if (c === "DIR" || Array.isArray(c))
      return;
  }
  this.matches[index][e] = true;
  var st = this.statCache[abs];
  if (st)
    this.emit("stat", e, st);
  this.emit("match", e);
};
Glob.prototype._readdirInGlobStar = function(abs, cb) {
  if (this.aborted)
    return;
  if (this.follow)
    return this._readdir(abs, false, cb);
  var lstatkey = "lstat\0" + abs;
  var self = this;
  var lstatcb = inflight(lstatkey, lstatcb_);
  if (lstatcb)
    self.fs.lstat(abs, lstatcb);
  function lstatcb_(er, lstat) {
    if (er && er.code === "ENOENT")
      return cb();
    var isSym = lstat && lstat.isSymbolicLink();
    self.symlinks[abs] = isSym;
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = "FILE";
      cb();
    } else
      self._readdir(abs, false, cb);
  }
};
Glob.prototype._readdir = function(abs, inGlobStar, cb) {
  if (this.aborted)
    return;
  cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
  if (!cb)
    return;
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb);
  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === "FILE")
      return cb();
    if (Array.isArray(c))
      return cb(null, c);
  }
  var self = this;
  self.fs.readdir(abs, readdirCb(this, abs, cb));
};
function readdirCb(self, abs, cb) {
  return function(er, entries) {
    if (er)
      self._readdirError(abs, er, cb);
    else
      self._readdirEntries(abs, entries, cb);
  };
}
Glob.prototype._readdirEntries = function(abs, entries, cb) {
  if (this.aborted)
    return;
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (abs === "/")
        e = abs + e;
      else
        e = abs + "/" + e;
      this.cache[e] = true;
    }
  }
  this.cache[abs] = entries;
  return cb(null, entries);
};
Glob.prototype._readdirError = function(f, er, cb) {
  if (this.aborted)
    return;
  switch (er.code) {
    case "ENOTSUP":
    case "ENOTDIR":
      var abs = this._makeAbs(f);
      this.cache[abs] = "FILE";
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + " invalid cwd " + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        this.emit("error", error);
        this.abort();
      }
      break;
    case "ENOENT":
    case "ELOOP":
    case "ENAMETOOLONG":
    case "UNKNOWN":
      this.cache[this._makeAbs(f)] = false;
      break;
    default:
      this.cache[this._makeAbs(f)] = false;
      if (this.strict) {
        this.emit("error", er);
        this.abort();
      }
      if (!this.silent)
        console.error("glob error", er);
      break;
  }
  return cb();
};
Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;
  this._readdir(abs, inGlobStar, function(er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
  });
};
Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  if (!entries)
    return cb();
  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [prefix] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar);
  this._process(noGlobStar, index, false, cb);
  var isSym = this.symlinks[abs];
  var len = entries.length;
  if (isSym && inGlobStar)
    return cb();
  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === "." && !this.dot)
      continue;
    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    this._process(instead, index, true, cb);
    var below = gspref.concat(entries[i], remain);
    this._process(below, index, true, cb);
  }
  cb();
};
Glob.prototype._processSimple = function(prefix, index, cb) {
  var self = this;
  this._stat(prefix, function(er, exists) {
    self._processSimple2(prefix, index, er, exists, cb);
  });
};
Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
  if (!this.matches[index])
    this.matches[index] = /* @__PURE__ */ Object.create(null);
  if (!exists)
    return cb();
  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);
    if (prefix.charAt(0) === "/") {
      prefix = path.join(this.root, prefix);
    } else {
      prefix = path.resolve(this.root, prefix);
      if (trail)
        prefix += "/";
    }
  }
  if (process.platform === "win32")
    prefix = prefix.replace(/\\/g, "/");
  this._emitMatch(index, prefix);
  cb();
};
Glob.prototype._stat = function(f, cb) {
  var abs = this._makeAbs(f);
  var needDir = f.slice(-1) === "/";
  if (f.length > this.maxLength)
    return cb();
  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs];
    if (Array.isArray(c))
      c = "DIR";
    if (!needDir || c === "DIR")
      return cb(null, c);
    if (needDir && c === "FILE")
      return cb();
  }
  var stat = this.statCache[abs];
  if (stat !== void 0) {
    if (stat === false)
      return cb(null, stat);
    else {
      var type = stat.isDirectory() ? "DIR" : "FILE";
      if (needDir && type === "FILE")
        return cb();
      else
        return cb(null, type, stat);
    }
  }
  var self = this;
  var statcb = inflight("stat\0" + abs, lstatcb_);
  if (statcb)
    self.fs.lstat(abs, statcb);
  function lstatcb_(er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      return self.fs.stat(abs, function(er2, stat2) {
        if (er2)
          self._stat2(f, abs, null, lstat, cb);
        else
          self._stat2(f, abs, er2, stat2, cb);
      });
    } else {
      self._stat2(f, abs, er, lstat, cb);
    }
  }
};
Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
  if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
    this.statCache[abs] = false;
    return cb();
  }
  var needDir = f.slice(-1) === "/";
  this.statCache[abs] = stat;
  if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
    return cb(null, false, stat);
  var c = true;
  if (stat)
    c = stat.isDirectory() ? "DIR" : "FILE";
  this.cache[abs] = this.cache[abs] || c;
  if (needDir && c === "FILE")
    return cb();
  return cb(null, c, stat);
};
const existsSync = fs$3.existsSync;
const WILDCARD_PATH = "(.*)";
const WILDCARD_PATH_NOT_EMPTY = "(.+)";
const DIR = "./routes";
function getRoutes() {
  return glob_1.sync(`**/*/`, { cwd: DIR }).map((filename) => ({
    filename,
    path: `/${filename.substr(0, filename.length - 1)}`.replace(/\[?\[\.\.\.(.*?)\]\]?/g, WILDCARD_PATH).replace(/\[(.*?)\]/g, ":$1")
  }));
}
function getNestedRoutes() {
  return [getNestedRoute()];
}
function getNestedRoute({ route, path: path2 = "", parentPath = "" } = {}) {
  var _a;
  const routes = getRoutes();
  const depth = ((_a = path2.match(/\//g)) == null ? void 0 : _a.length) || 0;
  const pageModuleUrl = existsSync(`${DIR}/${(route == null ? void 0 : route.filename) || ""}page.tsx`) && `${DIR}/${(route == null ? void 0 : route.filename) || ""}page.tsx`;
  const layoutModuleUrl = existsSync(`${DIR}/${(route == null ? void 0 : route.filename) || ""}layout.tsx`) && `${DIR}/${(route == null ? void 0 : route.filename) || ""}layout.tsx`;
  const children = getChildren({ routes, parentPath: path2, depth });
  if (pageModuleUrl) {
    const wildcardRouteIndex = children.findIndex(({ path: path22 }) => path22 === `/${WILDCARD_PATH}`);
    const hasWildcard = wildcardRouteIndex !== -1;
    if (hasWildcard) {
      children[wildcardRouteIndex].path = `/${WILDCARD_PATH_NOT_EMPTY}`;
    }
    children.push({
      fullPath: path2,
      path: "",
      moduleUrl: pageModuleUrl,
      depth,
      children: []
    });
  }
  return {
    fullPath: path2 || "",
    path: (path2 == null ? void 0 : path2.replace(parentPath, "")) || "",
    moduleUrl: layoutModuleUrl,
    depth,
    children
  };
}
function getChildren({ routes, parentPath, depth }) {
  return routes.filter((childRoute) => {
    var _a;
    const childDepth = (_a = childRoute.path.match(/\//g)) == null ? void 0 : _a.length;
    const isNextDepth = childDepth === depth + 1;
    const isSubroute = childRoute.path.indexOf(parentPath) !== -1;
    return isNextDepth && isSubroute;
  }).map((childRoute) => getNestedRoute({ route: childRoute, path: childRoute.path, parentPath })).sort((a, b) => a.path === `/${WILDCARD_PATH}` ? 1 : -1);
}
const GET_DOMAIN_QUERY = gql`query DomainGetConnection($packageVersionId: ID) {
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
async function getDomain(req, { packageVersion }) {
  var _a, _b;
  if (!packageVersion) {
    console.warn("PackageVersion not found, you may need to deploy first");
    return null;
  }
  const query = GET_DOMAIN_QUERY;
  const variables = { packageVersionId: packageVersion.id };
  const response = await getClient().query(query, variables).toPromise();
  const domain = (_a = response.data) == null ? void 0 : _a.domainConnection.nodes[0];
  if (!domain) {
    const context = globalContext.getStore();
    console.warn("Domain not found:", packageVersion.id, JSON.stringify(context.config, null, 2), (_b = response.error) == null ? void 0 : _b.message);
  }
  return domain;
}
export { getDomain, getNestedRoutes };
