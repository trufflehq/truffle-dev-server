import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import R from "https://npm.tfl.dev/@microsoft/fast-ssr@1.0.0-beta.4";
import m from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import Z from "https://npm.tfl.dev/universal-router@9";
import { setConfig as h } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import { AsyncLocalStorage as L } from "node:async_hooks";
import { setParams as I } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
var b, g;
const y = typeof document > "u" || ((g = (b = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : b.release) == null ? void 0 : g.name) === "node";
function C(t) {
  return {
    ...t,
    path: t.path === "/*" ? "" : t.path,
    action: y ? V : G,
    children: t.path === "/*" ? [] : t.children.map(C)
  };
}
async function G(t) {
  const { route: e, params: a } = t;
  I(a);
  const o = await t.next();
  let n;
  if (e.moduleUrl) {
    const { default: c } = await import(
      /* @vite-ignore */
      e.moduleUrl.replace(/^\./, "")
    ) || {};
    return n = document.querySelector(`${c.tagName}#${p(e)}`) || document.createElement(c.tagName), n.id = p(e), o && n.replaceChildren(o), n;
  }
  return o;
}
async function V(t) {
  var s;
  const { route: e, params: a } = t;
  I(a);
  let o = "", n;
  e.moduleUrl && (n = (s = await import(
    /* @vite-ignore */
    e.moduleUrl.replace(/^\./, "")
  )) == null ? void 0 : s.default, o += `<${n.tagName} id="${p(e)}">`);
  const c = await t.next();
  return c && (o += c), n && (o += `</${n.tagName}>`), o || null;
}
function v(t = "") {
  return (t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function p(t) {
  return `module-${v(t.fullPath)}`;
}
const i = process.env, u = "https://mycelium.staging.bio", S = {
  IS_DEV_ENV: i.NODE_ENV !== "production",
  IS_STAGING_ENV: !1,
  IS_PROD_ENV: i.NODE_ENV === "production",
  PUBLIC_API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  HOST: i.SPOROCARP_HOST || "dev.sporocarp.dev"
}, w = {
  PUBLIC_API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: i.MYCELIUM_API_URL || u
};
async function N({ req: t, res: e, options: a, clientConfig: o }) {
  const n = m.getStore(), { getDomain: c, getNestedRoutes: s } = await (i.NODE_ENV === "production" ? import("./setup.hosted.js") : import("./setup.local.js")), r = await c(t, a), l = {
    orgId: r == null ? void 0 : r.orgId,
    packageVersionId: r == null ? void 0 : r.packageVersionId,
    packageId: r == null ? void 0 : r.packageId
  };
  Object.assign(n, l);
  const d = await s({ domain: r });
  return {
    clientConfig: o,
    routes: d,
    clientContext: l
  };
}
const { templateRenderer: _, defaultRenderInfo: E, elementRenderer: H } = R();
m._PRIVATE_setInstance(new L());
h(w);
function F(t, e, a) {
  const o = t.originalUrl, n = { ssr: { req: t, res: e } };
  return new Promise((c) => {
    m.run(n, async () => {
      const s = m.getStore();
      let r;
      try {
        r = await N({
          req: t,
          res: e,
          options: a,
          clientConfig: S
        }), Object.assign(s, r);
      } catch (d) {
        console.error("Initial context error", d);
      }
      let l = await U(o, r);
      try {
        const d = _.render(l, {
          ...E
        });
        l = "";
        for (const f of d)
          l += f;
        c(l);
      } catch (d) {
        console.error("Render error", d), c(l);
      }
    });
  });
}
async function U(t, e) {
  let a;
  try {
    a = await new Z(e.routes.map(C)).resolve(t);
  } catch (c) {
    console.log("Base HTML error", c.message), a = "";
  }
  const { default: o } = await import("https://tfl.dev/@truffle/ui@~0.1.0/components/theme/theme-template.ts"), n = process.env.NODE_ENV === "production" ? "/client-entry.js" : new URL("data:video/mp2t;base64,aW1wb3J0IGdsb2JhbENvbnRleHQgZnJvbSAiaHR0cHM6Ly90ZmwuZGV2L0B0cnVmZmxlL2dsb2JhbC1jb250ZXh0QF4xLjAuMC9pbmRleC50cyI7CmltcG9ydCB7IHNldENvbmZpZyB9IGZyb20gImh0dHBzOi8vdGZsLmRldi9AdHJ1ZmZsZS9jb25maWdAXjEuMC4wL2luZGV4LnRzIjsKaW1wb3J0IGhpc3RvcnkgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi9oaXN0b3J5QDUvYnJvd3NlciI7CmltcG9ydCBVbml2ZXJzYWxSb3V0ZXIgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi91bml2ZXJzYWwtcm91dGVyQDkiOwoKaW1wb3J0IHsgYWRkUm91dGVBY3Rpb24gfSBmcm9tICIuL3JvdXRlci50cyI7Cgpjb25zdCB7IGNsaWVudENvbmZpZywgY2xpZW50Q29udGV4dCwgcm91dGVzIH0gPSB3aW5kb3cuX3RydWZmbGVJbml0aWFsRGF0YTsKCmdsb2JhbENvbnRleHQuc2V0R2xvYmFsVmFsdWUoY2xpZW50Q29udGV4dCB8fCB7fSk7CnNldENvbmZpZyhjbGllbnRDb25maWcgfHwge30pOwoKY29uc3Qgcm91dGVyID0gbmV3IFVuaXZlcnNhbFJvdXRlcihyb3V0ZXMubWFwKGFkZFJvdXRlQWN0aW9uKSk7CgpoaXN0b3J5Lmxpc3RlbihoYW5kbGVSb3V0ZSk7Cgphc3luYyBmdW5jdGlvbiBoYW5kbGVSb3V0ZSh7IGxvY2F0aW9uLCBhY3Rpb24gPSAiIiB9KSB7CiAgY29uc3QgZWxlbWVudCA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKGxvY2F0aW9uLnBhdGhuYW1lKTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTsKfQoKaGFuZGxlUm91dGUoeyBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pOwo=", self.location).toString().replace("file://", "");
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
      <script async src="https://unpkg.com/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.js"><\/script>
    </head>
    <body>
      ${o || ""}
      <div id="root">${a || ""}</div>
      <script type="module" src="${n}"><\/script>
      <script>window._truffleInitialData = ${JSON.stringify(e || "{}")}<\/script>
    </body>
    </html>`;
}
export {
  F as render
};
