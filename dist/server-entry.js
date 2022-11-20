import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import h from "https://npm.tfl.dev/@microsoft/fast-ssr@1.0.0-beta.4";
import m from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import f from "https://npm.tfl.dev/universal-router@9";
import { setConfig as L } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import { AsyncLocalStorage as y } from "node:async_hooks";
import { setParams as R } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
var I, g;
const G = typeof document > "u" || ((g = (I = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : I.release) == null ? void 0 : g.name) === "node";
function Z(t) {
  return {
    ...t,
    path: t.path === "/*" ? "" : t.path,
    action: G ? _ : E,
    children: t.path === "/*" ? [] : t.children.map(Z)
  };
}
async function E(t) {
  const { route: n, params: a } = t;
  R(a);
  const e = await t.next();
  let o;
  if (n.moduleUrl) {
    const { default: r } = await import(
      /* @vite-ignore */
      n.moduleUrl.replace(/^\./, "")
    ) || {};
    return o = document.querySelector(`${r.tagName}#${p(n)}`) || document.createElement(r.tagName), o.id = p(n), e && o.replaceChildren(e), o;
  }
  return e;
}
async function _(t) {
  var d;
  const { route: n, params: a } = t;
  R(a);
  let e = "", o;
  n.moduleUrl && (o = (d = await import(
    /* @vite-ignore */
    n.moduleUrl.replace(/^\./, "")
  )) == null ? void 0 : d.default, e += `<${o.tagName} id="${p(n)}">`);
  const r = await t.next();
  return r && (e += r), o && (e += `</${o.tagName}>`), e || null;
}
function S(t = "") {
  return (t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function p(t) {
  return `module-${S(t.moduleUrl)}`;
}
const i = process.env, u = "https://mycelium.staging.bio", v = {
  IS_DEV_ENV: i.NODE_ENV !== "production",
  IS_STAGING_ENV: i.IS_STAGING === "1",
  IS_PROD_ENV: i.NODE_ENV === "production",
  PUBLIC_API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  HOST: i.SPOROCARP_HOST || "dev.sporocarp.dev"
}, N = {
  PUBLIC_API_URL: i.PUBLIC_MYCELIUM_API_URL || u,
  API_URL: i.MYCELIUM_API_URL || u
};
async function V({ req: t, res: n, options: a, clientConfig: e }) {
  const o = m.getStore(), { getDomain: r, getNestedRoutes: d } = await (i.NODE_ENV === "production" ? import("./setup.hosted.js") : import("./setup.local.js")), c = await r(t, a), l = {
    orgId: c == null ? void 0 : c.orgId,
    packageVersionId: c == null ? void 0 : c.packageVersionId,
    packageId: c == null ? void 0 : c.packageId
  };
  Object.assign(o, l);
  const s = await d({ domain: c });
  return {
    clientConfig: e,
    routes: s,
    clientContext: l
  };
}
const { templateRenderer: w, defaultRenderInfo: B, elementRenderer: T } = h(), U = 60 * 1e3, W = 100;
m._PRIVATE_setInstance(new y());
L(N);
let b = 0;
setInterval(() => {
  b = 0;
}, U);
function M(t, n, a) {
  const e = t.originalUrl, o = { ssr: { req: t, res: n } };
  if (e === "/.well-known/ping")
    return "pong";
  if (e === "/.well-known/healthcheck") {
    if (b > W)
      throw new Error("Imports are in a bad state");
    return "ok";
  }
  return new Promise((r) => {
    m.run(o, async () => {
      const d = m.getStore();
      let c;
      try {
        c = await V({
          req: t,
          res: n,
          options: a,
          clientConfig: v
        }), Object.assign(d, c);
      } catch (s) {
        s.code === "ERR_NETWORK_IMPORT_DISALLOWED" && (b += 1), console.error("Initial context error", s);
      }
      let l = await A(e, c);
      try {
        const s = w.render(l, {
          ...B
        });
        l = "";
        for (const C of s)
          l += C;
        r(l);
      } catch (s) {
        console.error("Render error", s), r(l);
      }
    });
  });
}
async function A(t, n) {
  let a;
  try {
    a = await new f(n.routes.map(Z)).resolve(t);
  } catch (r) {
    r.message.indexOf("setAttribute is not a function") === -1 && console.log("Base HTML error", r.message), a = "";
  }
  const { default: e } = await import("https://tfl.dev/@truffle/ui@~0.1.0/components/theme/theme-template.ts"), o = process.env.NODE_ENV === "production" ? "/client-entry.js" : new URL("data:video/mp2t;base64,aW1wb3J0IGdsb2JhbENvbnRleHQgZnJvbSAiaHR0cHM6Ly90ZmwuZGV2L0B0cnVmZmxlL2dsb2JhbC1jb250ZXh0QF4xLjAuMC9pbmRleC50cyI7CmltcG9ydCB7IHNldENvbmZpZyB9IGZyb20gImh0dHBzOi8vdGZsLmRldi9AdHJ1ZmZsZS9jb25maWdAXjEuMC4wL2luZGV4LnRzIjsKaW1wb3J0IGhpc3RvcnkgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi9oaXN0b3J5QDUvYnJvd3NlciI7CmltcG9ydCBVbml2ZXJzYWxSb3V0ZXIgZnJvbSAiaHR0cHM6Ly9ucG0udGZsLmRldi91bml2ZXJzYWwtcm91dGVyQDkiOwoKaW1wb3J0IHsgYWRkUm91dGVBY3Rpb24gfSBmcm9tICIuL3JvdXRlci50cyI7CgovLyBUT0RPOiBpZiBfdHJ1ZmZsZUluaXRpYWxEYXRhLnJvdXRlcyBpcyBlbXB0eSAoc3NyIGZhaWxlZCBvbiBhbiBpbXBvcnQpCi8vIHdlIHNob3VsZCBydW4gc29tZSB2YXJpYXRpb24gb2YgZ2V0SW5pdGlhbENsaWVudERhdGEgaGVyZSB0byBnZXQgdGhlIHJvdXRlcwpjb25zdCB7IGNsaWVudENvbmZpZywgY2xpZW50Q29udGV4dCwgcm91dGVzIH0gPSB3aW5kb3cuX3RydWZmbGVJbml0aWFsRGF0YTsKCmdsb2JhbENvbnRleHQuc2V0R2xvYmFsVmFsdWUoY2xpZW50Q29udGV4dCB8fCB7fSk7CnNldENvbmZpZyhjbGllbnRDb25maWcgfHwge30pOwoKY29uc3Qgcm91dGVyID0gbmV3IFVuaXZlcnNhbFJvdXRlcihyb3V0ZXMubWFwKGFkZFJvdXRlQWN0aW9uKSk7CgpoaXN0b3J5Lmxpc3RlbihoYW5kbGVSb3V0ZSk7Cgphc3luYyBmdW5jdGlvbiBoYW5kbGVSb3V0ZSh7IGxvY2F0aW9uLCBhY3Rpb24gPSAiIiB9KSB7CiAgY29uc3QgZWxlbWVudCA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKGxvY2F0aW9uLnBhdGhuYW1lKTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpLnJlcGxhY2VDaGlsZHJlbihlbGVtZW50KTsKfQoKaGFuZGxlUm91dGUoeyBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pOwo=", self.location).toString().replace("file://", "");
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
      <script async src="https://unpkg.com/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.js"><\/script>
    </head>
    <body>
      ${e || ""}
      <div id="root">${a || ""}</div>
      <script type="module" src="${o}"><\/script>
      <script>window._truffleInitialData = ${JSON.stringify(n || "{}")}<\/script>
    </body>
    </html>`;
}
export {
  M as render
};
