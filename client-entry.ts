import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
// import { createBrowserHistory } from "https://npm.tfl.dev/history@5";
// TODO: use ^^, separate router package/util
import history from "https://npm.tfl.dev/history@5/browser";
import {
  getRouter,
  setRoutes,
} from "https://tfl.dev/@truffle/router@1.0.0/router.js";
import { addRouteAction } from "./router.ts";

globalContext.setGlobalValue({});

const routesWithActions = [addRouteAction(window._truffleRoutes)];
setRoutes(routesWithActions);
const router = getRouter();

// const history = createBrowserHistory();
let unlisten = history.listen(handleRoute);

async function handleRoute({ location, action = "" }) {
  const element = await router.resolve(location.pathname);
  document.getElementById("root").replaceChildren(element);
}

handleRoute({ location: window.location });
