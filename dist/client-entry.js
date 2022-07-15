import f from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { setConfig as p } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import h from "https://npm.tfl.dev/history@5/browser";
import w from "https://npm.tfl.dev/universal-router@9";
import { setParams as s } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
var c, m;
const g = typeof document > "u" || ((m = (c = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : c.release) == null ? void 0 : m.name) === "node";
function u(t) {
  return {
    ...t,
    path: t.path === "/*" ? "" : t.path,
    action: g ? C : y,
    children: t.path === "/*" ? [] : t.children.map(u)
  };
}
async function y(t) {
  const { route: e, params: a } = t;
  s(a);
  const o = await t.next();
  let n;
  if (e.moduleUrl) {
    const { default: i } = await import(
      /* @vite-ignore */
      e.moduleUrl.replace(/^\./, "")
    ) || {};
    return n = document.querySelector(`${i.tagName}#${r(e)}`) || document.createElement(i.tagName), n.id = r(e), o && n.replaceChildren(o), n;
  }
  return o;
}
async function C(t) {
  var l;
  const { route: e, params: a } = t;
  s(a);
  let o = "", n;
  e.moduleUrl && (n = (l = await import(
    /* @vite-ignore */
    e.moduleUrl.replace(/^\./, "")
  )) == null ? void 0 : l.default, o += `<${n.tagName} id="${r(e)}">`);
  const i = await t.next();
  return i && (o += i), n && (o += `</${n.tagName}>`), o || null;
}
function A(t = "") {
  return (t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function r(t) {
  return `module-${A(t.fullPath)}`;
}
const { clientConfig: b, clientContext: E, routes: $ } = window._truffleInitialData;
f.setGlobalValue(E || {});
p(b || {});
const U = new w($.map(u));
h.listen(d);
async function d({ location: t, action: e = "" }) {
  const a = await U.resolve(t.pathname);
  document.getElementById("root").replaceChildren(a);
}
d({ location: window.location });
