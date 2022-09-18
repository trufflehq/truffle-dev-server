import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import R from "https://npm.tfl.dev/@microsoft/fast-ssr@1.0.0-beta.4";
import m from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import Z from "https://npm.tfl.dev/universal-router@9";
import { setConfig as h } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import { AsyncLocalStorage as v } from "node:async_hooks";
import { setParams as f } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
var b, I;
const L = typeof document > "u" || ((I = (b = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : b.release) == null ? void 0 : I.name) === "node";
function C(t) {
  return {
    ...t,
    path: t.path === "/*" ? "" : t.path,
    action: L ? E : y,
    children: t.path === "/*" ? [] : t.children.map(C)
  };
}
async function y(t) {
  const { route: n, params: s } = t;
  f(s);
  const o = await t.next();
  let r;
  if (n.moduleUrl) {
    const { default: c } = await import(
      /* @vite-ignore */
      n.moduleUrl.replace(/^\./, "")
    ) || {};
    return r = document.querySelector(`${c.tagName}#${g(n)}`) || document.createElement(c.tagName), r.id = g(n), o && r.replaceChildren(o), r;
  }
  return o;
}
async function E(t) {
  var i;
  const { route: n, params: s } = t;
  f(s);
  let o = "", r;
  n.moduleUrl && (r = (i = await import(
    /* @vite-ignore */
    n.moduleUrl.replace(/^\./, "")
  )) == null ? void 0 : i.default, o += `<${r.tagName} id="${g(n)}">`);
  const c = await t.next();
  return c && (o += c), r && (o += `</${r.tagName}>`), o || null;
}
function G(t = "") {
  return (t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function g(t) {
  return `module-${G(t.moduleUrl)}`;
}
const l = process.env, u = "https://mycelium.staging.bio", V = {
  IS_DEV_ENV: l.NODE_ENV !== "production",
  IS_STAGING_ENV: l.NODE_ENV === "staging",
  IS_PROD_ENV: l.NODE_ENV === "production",
  PUBLIC_API_URL: l.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: l.PUBLIC_MYCELIUM_API_URL || u,
  HOST: l.SPOROCARP_HOST || "dev.sporocarp.dev"
}, N = {
  PUBLIC_API_URL: l.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: l.MYCELIUM_API_URL || u
};
async function S({ req: t, res: n, options: s, clientConfig: o }) {
  const r = m.getStore(), c = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging", { getDomain: i, getNestedRoutes: d } = await (c ? import("./setup.hosted.js") : import("./setup.local.js")), e = await i(t, s), a = {
    orgId: e == null ? void 0 : e.orgId,
    packageVersionId: e == null ? void 0 : e.packageVersionId,
    packageId: e == null ? void 0 : e.packageId
  };
  Object.assign(r, a);
  const p = await d({ domain: e });
  return {
    clientConfig: o,
    routes: p,
    clientContext: a
  };
}
const { templateRenderer: _, defaultRenderInfo: w, elementRenderer: P } = R();
m._PRIVATE_setInstance(new v());
h(N);
function O(t, n, s) {
  const o = t.originalUrl, r = { ssr: { req: t, res: n } };
  return o === "/.well-known/ping" ? "pong" : new Promise((c) => {
    m.run(r, async () => {
      const i = m.getStore();
      let d;
      try {
        d = await S({
          req: t,
          res: n,
          options: s,
          clientConfig: V
        }), Object.assign(i, d);
      } catch (a) {
        console.error("Initial context error", a);
      }
      let e = await U(o, d);
      try {
        const a = _.render(e, {
          ...w
        });
        e = "";
        for (const p of a)
          e += p;
        c(e);
      } catch (a) {
        console.error("Render error", a), c(e);
      }
    });
  });
}
async function U(t, n) {
  let s;
  try {
    s = await new Z(n.routes.map(C)).resolve(t);
  } catch (i) {
    i.message.indexOf("setAttribute is not a function") === -1 && console.log("Base HTML error", i.message), s = "";
  }
  const { default: o } = await import("https://tfl.dev/@truffle/ui@~0.1.0/components/theme/theme-template.ts"), c = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging" ? "/client-entry.js" : new URL("data:video/mp2t;base64,aW1wb3J0IGdsb2JhbENvbnRleHQgZnJvbSAiaHR0cHM6Ly90ZmwuZGV2L0B0cnVmZmxlL2dsb2JhbC1jb250ZXh0QF4xLjAuMC9pbmRleC50cyI7CmltcG9ydCB7IHNldENvbmZpZyB9IGZyb20gImh0dHBzOi8vdGZsLmRldi9AdHJ1ZmZsZS9jb25maWdAXjEuMC4wL2luZGV4LnRzIjsKaW1wb3J0IGhpc3RvcnkgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi9oaXN0b3J5QDUvYnJvd3NlciI7CmltcG9ydCBVbml2ZXJzYWxSb3V0ZXIgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi91bml2ZXJzYWwtcm91dGVyQDkiOwoKaW1wb3J0IHsgYWRkUm91dGVBY3Rpb24gfSBmcm9tICIuL3JvdXRlci50cyI7Cgpjb25zdCB7IGNsaWVudENvbmZpZywgY2xpZW50Q29udGV4dCwgcm91dGVzIH0gPSB3aW5kb3cuX3RydWZmbGVJbml0aWFsRGF0YTsKCmdsb2JhbENvbnRleHQuc2V0R2xvYmFsVmFsdWUoY2xpZW50Q29udGV4dCB8fCB7fSk7CnNldENvbmZpZyhjbGllbnRDb25maWcgfHwge30pOwoKY29uc3Qgcm91dGVyID0gbmV3IFVuaXZlcnNhbFJvdXRlcihyb3V0ZXMubWFwKGFkZFJvdXRlQWN0aW9uKSk7CgpoaXN0b3J5Lmxpc3RlbihoYW5kbGVSb3V0ZSk7Cgphc3luYyBmdW5jdGlvbiBoYW5kbGVSb3V0ZSh7IGxvY2F0aW9uLCBhY3Rpb24gPSAiIiB9KSB7CiAgY29uc3QgZWxlbWVudCA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKGxvY2F0aW9uLnBhdGhuYW1lKTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTsKfQoKaGFuZGxlUm91dGUoeyBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pOwo=", self.location).toString().replace("file://", "");
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
      <script async src="https://unpkg.com/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.js"><\/script>
    </head>
    <body>
      ${o || ""}
      <div id="root">${s || ""}</div>
      <script type="module" src="${c}"><\/script>
      <script>window._truffleInitialData = ${JSON.stringify(n || "{}")}<\/script>
    </body>
    </html>`;
}
export {
  O as render
};
