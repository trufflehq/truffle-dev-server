import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
import {
  getRouter,
  setRoutes,
} from "https://tfl.dev/@truffle/router@1.0.0/index.js";
import { listen } from "https://tfl.dev/@truffle/router@1.0.0/history.js";
import { addRouteAction } from "./router.ts";

globalContext.setGlobalValue({});

const routesWithActions = [addRouteAction(window._truffleRoutes)];
console.log('r', routesWithActions);

setRoutes(routesWithActions);
const router = getRouter();

// const history = createBrowserHistory();
let unlisten = listen(handleRoute);

async function handleRoute({ location, action = "" }) {
  const element = await router.resolve(location.pathname);
  document.getElementById("root").replaceChildren(element);
}

handleRoute({ location: window.location });
