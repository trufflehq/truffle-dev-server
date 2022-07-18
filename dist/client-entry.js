import f from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { setConfig as p } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import h from "https://npm.tfl.dev/history@5/browser";
import w from "https://npm.tfl.dev/universal-router@9";
import { setParams as s } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
var c, m;
const g = typeof document > "u" || ((m = (c = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : c.release) == null ? void 0 : m.name) === "node";
function u(e) {
  return {
    ...e,
    path: e.path === "/*" ? "" : e.path,
    action: g ? C : y,
    children: e.path === "/*" ? [] : e.children.map(u)
  };
}
async function y(e) {
  const { route: t, params: a } = e;
  s(a);
  const o = await e.next();
  let n;
  if (t.moduleUrl) {
    const { default: i } = await import(
      /* @vite-ignore */
      t.moduleUrl.replace(/^\./, "")
    ) || {};
    return n = document.querySelector(`${i.tagName}#${r(t)}`) || document.createElement(i.tagName), n.id = r(t), o && n.replaceChildren(o), n;
  }
  return o;
}
async function C(e) {
  var l;
  const { route: t, params: a } = e;
  s(a);
  let o = "", n;
  t.moduleUrl && (n = (l = await import(
    /* @vite-ignore */
    t.moduleUrl.replace(/^\./, "")
  )) == null ? void 0 : l.default, o += `<${n.tagName} id="${r(t)}">`);
  const i = await e.next();
  return i && (o += i), n && (o += `</${n.tagName}>`), o || null;
}
function A(e = "") {
  return (e.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function r(e) {
  return `module-${A(e.moduleUrl)}`;
}
const { clientConfig: b, clientContext: E, routes: U } = window._truffleInitialData;
f.setGlobalValue(E || {});
p(b || {});
const $ = new w(U.map(u));
h.listen(d);
async function d({ location: e, action: t = "" }) {
  const a = await $.resolve(e.pathname);
  document.getElementById("root").replaceChildren(a);
}
d({ location: window.location });
