import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import R from "https://npm.tfl.dev/@microsoft/fast-ssr@1.0.0-beta.4";
import m from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import Z from "https://npm.tfl.dev/universal-router@9";
import { setConfig as h } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import { AsyncLocalStorage as G } from "node:async_hooks";
import { setParams as I } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
var b, g;
const L = typeof document > "u" || ((g = (b = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : b.release) == null ? void 0 : g.name) === "node";
function f(t) {
  return {
    ...t,
    path: t.path === "/*" ? "" : t.path,
    action: L ? S : y,
    children: t.path === "/*" ? [] : t.children.map(f)
  };
}
async function y(t) {
  const { route: e, params: a } = t;
  I(a);
  const n = await t.next();
  let o;
  if (e.moduleUrl) {
    const { default: r } = await import(
      /* @vite-ignore */
      e.moduleUrl.replace(/^\./, "")
    ) || {};
    return o = document.querySelector(`${r.tagName}#${p(e)}`) || document.createElement(r.tagName), o.id = p(e), n && o.replaceChildren(n), o;
  }
  return n;
}
async function S(t) {
  var s;
  const { route: e, params: a } = t;
  I(a);
  let n = "", o;
  e.moduleUrl && (o = (s = await import(
    /* @vite-ignore */
    e.moduleUrl.replace(/^\./, "")
  )) == null ? void 0 : s.default, n += `<${o.tagName} id="${p(e)}">`);
  const r = await t.next();
  return r && (n += r), o && (n += `</${o.tagName}>`), n || null;
}
function V(t = "") {
  return (t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function p(t) {
  return `module-${V(t.moduleUrl)}`;
}
const i = process.env, u = "https://mycelium.staging.bio", v = {
  IS_DEV_ENV: i.NODE_ENV !== "production",
  IS_STAGING_ENV: i.IS_STAGING === "1",
  IS_PROD_ENV: i.NODE_ENV === "production",
  PUBLIC_API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  HOST: i.SPOROCARP_HOST || "dev.sporocarp.dev"
}, w = {
  PUBLIC_API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: i.MYCELIUM_API_URL || u
};
async function N({ req: t, res: e, options: a, clientConfig: n }) {
  const o = m.getStore(), { getDomain: r, getNestedRoutes: s } = await (i.NODE_ENV === "production" ? import("./setup.hosted.js") : import("./setup.local.js")), c = await r(t, a), l = {
    orgId: c == null ? void 0 : c.orgId,
    packageVersionId: c == null ? void 0 : c.packageVersionId,
    packageId: c == null ? void 0 : c.packageId
  };
  Object.assign(o, l);
  const d = await s({ domain: c });
  return {
    clientConfig: n,
    routes: d,
    clientContext: l
  };
}
const { templateRenderer: _, defaultRenderInfo: U, elementRenderer: H } = R();
m._PRIVATE_setInstance(new G());
h(w);
function k(t, e, a) {
  const n = t.originalUrl, o = { ssr: { req: t, res: e } };
  return n === "/.well-known/ping" ? "pong" : new Promise((r) => {
    m.run(o, async () => {
      const s = m.getStore();
      let c;
      try {
        c = await N({
          req: t,
          res: e,
          options: a,
          clientConfig: v
        }), Object.assign(s, c);
      } catch (d) {
        console.error("Initial context error", d);
      }
      let l = await E(n, c);
      try {
        const d = _.render(l, {
          ...U
        });
        l = "";
        for (const C of d)
          l += C;
        r(l);
      } catch (d) {
        console.error("Render error", d), r(l);
      }
    });
  });
}
async function E(t, e) {
  let a;
  try {
    a = await new Z(e.routes.map(f)).resolve(t);
  } catch (r) {
    r.message.indexOf("setAttribute is not a function") === -1 && console.log("Base HTML error", r.message), a = "";
  }
  const { default: n } = await import("https://tfl.dev/@truffle/ui@~0.1.0/components/theme/theme-template.ts"), o = process.env.NODE_ENV === "production" ? "/client-entry.js" : new URL("data:video/mp2t;base64,aW1wb3J0IGdsb2JhbENvbnRleHQgZnJvbSAiaHR0cHM6Ly90ZmwuZGV2L0B0cnVmZmxlL2dsb2JhbC1jb250ZXh0QF4xLjAuMC9pbmRleC50cyI7CmltcG9ydCB7IHNldENvbmZpZyB9IGZyb20gImh0dHBzOi8vdGZsLmRldi9AdHJ1ZmZsZS9jb25maWdAXjEuMC4wL2luZGV4LnRzIjsKaW1wb3J0IGhpc3RvcnkgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi9oaXN0b3J5QDUvYnJvd3NlciI7CmltcG9ydCBVbml2ZXJzYWxSb3V0ZXIgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi91bml2ZXJzYWwtcm91dGVyQDkiOwoKaW1wb3J0IHsgYWRkUm91dGVBY3Rpb24gfSBmcm9tICIuL3JvdXRlci50cyI7Cgpjb25zdCB7IGNsaWVudENvbmZpZywgY2xpZW50Q29udGV4dCwgcm91dGVzIH0gPSB3aW5kb3cuX3RydWZmbGVJbml0aWFsRGF0YTsKCmdsb2JhbENvbnRleHQuc2V0R2xvYmFsVmFsdWUoY2xpZW50Q29udGV4dCB8fCB7fSk7CnNldENvbmZpZyhjbGllbnRDb25maWcgfHwge30pOwoKY29uc3Qgcm91dGVyID0gbmV3IFVuaXZlcnNhbFJvdXRlcihyb3V0ZXMubWFwKGFkZFJvdXRlQWN0aW9uKSk7CgpoaXN0b3J5Lmxpc3RlbihoYW5kbGVSb3V0ZSk7Cgphc3luYyBmdW5jdGlvbiBoYW5kbGVSb3V0ZSh7IGxvY2F0aW9uLCBhY3Rpb24gPSAiIiB9KSB7CiAgY29uc3QgZWxlbWVudCA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKGxvY2F0aW9uLnBhdGhuYW1lKTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTsKfQoKaGFuZGxlUm91dGUoeyBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pOwo=", self.location).toString().replace("file://", "");
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
      <script async src="https://unpkg.com/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.js"><\/script>
    </head>
    <body>
      ${n || ""}
      <div id="root">${a || ""}</div>
      <script type="module" src="${o}"><\/script>
      <script>window._truffleInitialData = ${JSON.stringify(e || "{}")}<\/script>
    </body>
    </html>`;
}
export {
  k as render
};
