import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.js";
import {
  getRouter,
  setRoutes,
} from "https://tfl.dev/@truffle/router@^1.0.0/index.js";
import { listen } from "https://tfl.dev/@truffle/router@^1.0.0/history.js";
import { addRouteAction } from "./router.ts";

globalContext.setGlobalValue(window._truffleInitialContext || {});

const routesWithActions = window._truffleInitialContext._routes.map(
  addRouteAction,
);
console.log("context", window._truffleInitialContext);

setRoutes(routesWithActions);
const router = getRouter();

let unlisten = listen(handleRoute);

async function handleRoute({ location, action = "" }) {
  const element = await router.resolve(location.pathname);
  document.getElementById("root").replaceChildren(element);
}

handleRoute({ location: window.location });
