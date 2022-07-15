import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import y from "https://npm.tfl.dev/@microsoft/fast-ssr";
import { html as L } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import d from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import v from "https://npm.tfl.dev/universal-router@9";
import { setConfig as G } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import { AsyncLocalStorage as _ } from "node:async_hooks";
import { setParams as h } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
var f, C;
const V = typeof document > "u" || ((C = (f = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : f.release) == null ? void 0 : C.name) === "node";
function R(t) {
  return {
    ...t,
    path: t.path === "/*" ? "" : t.path,
    action: V ? w : S,
    children: t.path === "/*" ? [] : t.children.map(R)
  };
}
async function S(t) {
  const { route: e, params: c } = t;
  h(c);
  const r = await t.next();
  let n;
  if (e.moduleUrl) {
    const { default: a } = await import(
      /* @vite-ignore */
      e.moduleUrl.replace(/^\./, "")
    ) || {};
    return n = document.querySelector(`${a.tagName}#${p(e)}`) || document.createElement(a.tagName), n.id = p(e), r && n.replaceChildren(r), n;
  }
  return r;
}
async function w(t) {
  var i;
  const { route: e, params: c } = t;
  h(c);
  let r = "", n;
  e.moduleUrl && (n = (i = await import(
    /* @vite-ignore */
    e.moduleUrl.replace(/^\./, "")
  )) == null ? void 0 : i.default, r += `<${n.tagName} id="${p(e)}">`);
  const a = await t.next();
  return a && (r += a), n && (r += `</${n.tagName}>`), r || null;
}
function N(t = "") {
  return (t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function p(t) {
  return `module-${N(t.fullPath)}`;
}
const l = process.env, u = "https://mycelium.staging.bio", E = {
  IS_DEV_ENV: l.NODE_ENV !== "production",
  IS_STAGING_ENV: !1,
  IS_PROD_ENV: l.NODE_ENV === "production",
  PUBLIC_API_URL: l.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: l.PUBLIC_MYCELIUM_API_URL || u,
  HOST: l.SPOROCARP_HOST || "dev.sporocarp.dev"
}, U = {
  PUBLIC_API_URL: l.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: l.MYCELIUM_API_URL || u
};
async function W({ req: t, res: e, options: c, clientConfig: r }) {
  const n = d.getStore(), { getDomain: a, getNestedRoutes: i } = await (l.NODE_ENV === "production" ? import("./setup.hosted.b019efc0.js") : import("./setup.local.0a93d76c.js")), o = await a(t, c), m = {
    orgId: o == null ? void 0 : o.orgId,
    packageVersionId: o == null ? void 0 : o.packageVersionId,
    packageId: o == null ? void 0 : o.packageId
  };
  Object.assign(n, m);
  const s = await i({ domain: o });
  return {
    clientConfig: r,
    routes: s,
    clientContext: m
  };
}
var g = Object.freeze, A = Object.defineProperty, Y = (t, e) => g(A(t, "raw", { value: g(e || t.slice()) })), I;
const { templateRenderer: P, defaultRenderInfo: B, elementRenderer: X } = y();
d._PRIVATE_setInstance(new _());
G(U);
function T(t, e, c) {
  const r = t.originalUrl, n = { ssr: { req: t, res: e } };
  return new Promise((a) => {
    d.run(n, async () => {
      const i = d.getStore();
      let o;
      try {
        o = await W({
          req: t,
          res: e,
          options: c,
          clientConfig: E
        }), Object.assign(i, o);
      } catch (s) {
        console.error("Initial context error", s);
      }
      const m = await J(r, o);
      try {
        const s = P.render(m, {
          ...B
        });
        let b = "";
        for (const Z of s)
          b += Z;
        a(b);
      } catch (s) {
        console.error("Render error", s), a(m);
      }
    });
  });
}
async function J(t, e) {
  let c;
  try {
    c = await new v(e.routes.map(R)).resolve(t);
  } catch (a) {
    console.log("Base HTML error", a.message), c = "";
  }
  const { default: r } = await import("https://tfl.dev/@truffle/ui@~0.0.3/components/theme/theme-template.ts"), n = process.env.NODE_ENV === "production" ? "/client-entry.js" : new URL("data:video/mp2t;base64,aW1wb3J0IGdsb2JhbENvbnRleHQgZnJvbSAiaHR0cHM6Ly90ZmwuZGV2L0B0cnVmZmxlL2dsb2JhbC1jb250ZXh0QF4xLjAuMC9pbmRleC50cyI7CmltcG9ydCB7IHNldENvbmZpZyB9IGZyb20gImh0dHBzOi8vdGZsLmRldi9AdHJ1ZmZsZS9jb25maWdAXjEuMC4wL2luZGV4LnRzIjsKaW1wb3J0IGhpc3RvcnkgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi9oaXN0b3J5QDUvYnJvd3NlciI7CmltcG9ydCBVbml2ZXJzYWxSb3V0ZXIgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi91bml2ZXJzYWwtcm91dGVyQDkiOwoKaW1wb3J0IHsgYWRkUm91dGVBY3Rpb24gfSBmcm9tICIuL3JvdXRlci50cyI7Cgpjb25zdCB7IGNsaWVudENvbmZpZywgY2xpZW50Q29udGV4dCwgcm91dGVzIH0gPSB3aW5kb3cuX3RydWZmbGVJbml0aWFsRGF0YTsKCmdsb2JhbENvbnRleHQuc2V0R2xvYmFsVmFsdWUoY2xpZW50Q29udGV4dCB8fCB7fSk7CnNldENvbmZpZyhjbGllbnRDb25maWcgfHwge30pOwoKY29uc3Qgcm91dGVyID0gbmV3IFVuaXZlcnNhbFJvdXRlcihyb3V0ZXMubWFwKGFkZFJvdXRlQWN0aW9uKSk7CgpoaXN0b3J5Lmxpc3RlbihoYW5kbGVSb3V0ZSk7Cgphc3luYyBmdW5jdGlvbiBoYW5kbGVSb3V0ZSh7IGxvY2F0aW9uLCBhY3Rpb24gPSAiIiB9KSB7CiAgY29uc3QgZWxlbWVudCA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKGxvY2F0aW9uLnBhdGhuYW1lKTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTsKfQoKaGFuZGxlUm91dGUoeyBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pOwo=", self.location).toString().replace("file://", "");
  return L(I || (I = Y([`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
      <script async src="https://unpkg.com/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.js"><\/script>
    </head>
    <body>
      `, `
      <div id="root">`, `</div>
      <script type="module" src="`, `"><\/script>
      <script>window._truffleInitialData = `, `<\/script>
    </body>
    </html>`])), r || "", c || "", n, JSON.stringify(e || "{}"));
}
export {
  T as render
};
