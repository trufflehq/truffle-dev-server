var _a, _b;
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.js";
import { setRoutes, getRouter } from "https://tfl.dev/@truffle/router@^1.0.0/index.js";
import { listen } from "https://tfl.dev/@truffle/router@^1.0.0/history.js";
const isSsr = typeof document === "undefined" || ((_b = (_a = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : _a.release) == null ? void 0 : _b.name) === "node";
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
  var _a2;
  const { route } = context;
  let template = ``;
  let wc;
  if (route.moduleUrl) {
    wc = (_a2 = await import(
      /* @vite-ignore */
      route.moduleUrl.replace(/^\./, "")
    )) == null ? void 0 : _a2.default;
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
globalContext.setGlobalValue(window._truffleInitialContext || {});
const routesWithActions = window._truffleInitialContext._routes.map(addRouteAction);
console.log("context", window._truffleInitialContext);
setRoutes(routesWithActions);
const router = getRouter();
listen(handleRoute);
async function handleRoute({ location, action = "" }) {
  const element = await router.resolve(location.pathname);
  document.getElementById("root").replaceChildren(element);
}
handleRoute({ location: window.location });
