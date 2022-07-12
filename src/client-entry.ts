import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { setConfig } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import history from "https://npm.tfl.dev/history@5/browser";
import UniversalRouter from "https://npm.tfl.dev/universal-router@9";

import { addRouteAction } from "./router.ts";

const { clientConfig, clientContext, routes } = window._truffleInitialData;

globalContext.setGlobalValue(clientContext || {});
setConfig(clientConfig || {});

const router = new UniversalRouter(routes.map(addRouteAction));

history.listen(handleRoute);

async function handleRoute({ location, action = "" }) {
  const element = await router.resolve(location.pathname);
  document.getElementById("root").replaceChildren(element);
}

handleRoute({ location: window.location });
