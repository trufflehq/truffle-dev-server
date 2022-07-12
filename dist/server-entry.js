var _a2, _b;
import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import fastSSR from "https://npm.tfl.dev/@microsoft/fast-ssr";
import { html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { setRoutes, getRouter } from "https://tfl.dev/@truffle/router@^1.0.0/index.js";
const isSsr = typeof document === "undefined" || ((_b = (_a2 = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : _a2.release) == null ? void 0 : _b.name) === "node";
function addRouteAction(route) {
  return {
    ...route,
    path: route.path === "/*" ? "" : route.path,
    action: isSsr ? ssrAction : clientAction,
    children: route.path === "/*" ? [] : route.children.map(addRouteAction)
  };
}
async function clientAction(context) {
  const { route } = context;
  const childElement = await context.next();
  let wcElement;
  if (route.moduleUrl) {
    const { default: wc } = await import(
      /* @vite-ignore */
      route.moduleUrl.replace(/^\./, "")
    ) || {};
    const existingLayoutElement = document.querySelector(`${wc.tagName}#${getDomId(route)}`);
    wcElement = existingLayoutElement || document.createElement(wc.tagName);
    wcElement.id = getDomId(route);
    if (childElement) {
      wcElement.replaceChildren(childElement);
    }
    return wcElement;
  }
  return childElement;
}
async function ssrAction(context) {
  var _a3;
  const { route } = context;
  let template = ``;
  let wc;
  if (route.moduleUrl) {
    wc = (_a3 = await import(
      /* @vite-ignore */
      route.moduleUrl.replace(/^\./, "")
    )) == null ? void 0 : _a3.default;
    template += `<${wc.tagName} id="${getDomId(route)}">`;
  }
  const child = await context.next();
  if (child) {
    template += child;
  }
  if (wc) {
    template += `</${wc.tagName}>`;
  }
  return template || null;
}
function kebabCase(str = "") {
  return (str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).join("-").toLowerCase();
}
function getDomId(route) {
  return `module-${kebabCase(route.fullPath)}`;
}
const serverEnv = process.env;
const clientConfig = {
  IS_DEV_ENV: serverEnv.NODE_ENV === "development",
  IS_STAGING_ENV: false,
  IS_PROD_ENV: serverEnv.NODE_ENV !== "development",
  PUBLIC_API_URL: serverEnv.PUBLIC_MYCELIUM_API_URL,
  API_URL: serverEnv.PUBLIC_MYCELIUM_API_URL,
  HOST: serverEnv.SPOROCARP_HOST || "dev.sporocarp.dev"
};
const serverConfig = {
  PUBLIC_API_URL: serverEnv.PUBLIC_MYCELIUM_API_URL,
  API_URL: serverEnv.MYCELIUM_API_URL
};
async function getInitialClientContext({ req, res, options, clientConfig: clientConfig2 }) {
  const context = globalContext.getStore();
  const { getDomain, getNestedRoutes } = await (serverEnv.NODE_ENV === "development" ? import("./setup.local.js") : import("./setup.hosted.js"));
  const domain = await getDomain(req, options);
  const nowServerContext = {
    orgId: domain == null ? void 0 : domain.orgId,
    packageVersionId: domain == null ? void 0 : domain.packageVersionId,
    packageId: domain == null ? void 0 : domain.packageId
  };
  Object.assign(context, nowServerContext);
  const routes = await getNestedRoutes({ domain });
  return {
    config: clientConfig2,
    _routes: routes,
    ...nowServerContext
  };
}
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const { templateRenderer, defaultRenderInfo, elementRenderer } = fastSSR();
globalContext._PRIVATE_setInstance(new AsyncLocalStorage());
function render(req, res, options) {
  const url = req.originalUrl;
  const initialServerContext = {
    config: { ...clientConfig, ...serverConfig },
    ssr: { req, res }
  };
  return new Promise((resolve) => {
    globalContext.run(initialServerContext, async () => {
      const context = globalContext.getStore();
      let initialClientContext;
      try {
        initialClientContext = await getInitialClientContext({
          req,
          res,
          options,
          clientConfig
        });
        Object.assign(context, initialClientContext);
      } catch (err) {
        console.error("Initial context error", err);
      }
      const html2 = await getHtml(url, initialClientContext);
      try {
        const result = templateRenderer.render(html2, {
          ...defaultRenderInfo
        });
        let htmlStr = "";
        for (const value of result) {
          htmlStr += value;
        }
        resolve(htmlStr);
      } catch (err) {
        console.error("Render error", err);
        resolve(html2);
      }
    });
  });
}
async function getHtml(url, initialClientContext) {
  const context = globalContext.getStore();
  let componentTemplate;
  try {
    setRoutes(context._routes.map(addRouteAction));
    const router = getRouter();
    componentTemplate = await router.resolve(url);
  } catch (err) {
    console.log("Base HTML error", err.message);
    componentTemplate = "";
  }
  const { default: themeTemplate } = await import("https://tfl.dev/@truffle/ui@~0.0.3/components/theme/theme-template.js");
  const clientEntrySrc = "/client-entry.js";
  return html(_a || (_a = __template(['<!DOCTYPE html>\n    <html lang="en">\n    <head>\n      <meta charset="UTF-8">\n      <title></title>\n    </head>\n    <body>\n      ', '\n      <div id="root">', '</div>\n      <script type="module" src="', '"><\/script>\n      <script>window._truffleInitialContext = ', "<\/script>\n    </body>\n    </html>"])), themeTemplate || "", componentTemplate || "", clientEntrySrc, JSON.stringify(initialClientContext || "{}"));
}
export { render };
