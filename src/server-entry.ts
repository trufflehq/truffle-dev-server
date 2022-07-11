import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import fastSSR from "https://npm.tfl.dev/@microsoft/fast-ssr";
import { html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
import { AsyncLocalStorage } from "node:async_hooks";
// NOTE: importing cjs will fail in this file (eg express for types)

// import { html, unsafeStatic } from "https://npm.tfl.dev/lit-html@2/static";

// fails with Cannot access 'LitElementRenderer' before initialization in node_modules/@lit-labs/ssr/lib/render-lit-html.js
// on skypack: [Package Error] \"module\" does not exist. (Imported by \"@lit-labs/ssr\")
// on npm.tfl.dev [ERR_NETWORK_IMPORT_DISALLOWED]: import of 'undefined'
// import { LitElementRenderer } from "@lit-labs/ssr/lib/lit-element-renderer.js";

import {
  getRouter,
  setRoutes,
} from "https://tfl.dev/@truffle/router@1.0.0/index.js";
import { addRouteAction } from "./router.ts";
import {
  clientConfig,
  getInitialClientContext,
  serverConfig,
} from "./setup.ts";

const { templateRenderer, defaultRenderInfo, elementRenderer } = fastSSR();

// url imports can't import non-url imports, so we have to pass this in...
globalContext._PRIVATE_setInstance(new AsyncLocalStorage());

export function render(req, res, options) {
  const url = req.originalUrl;
  const initialServerContext = {
    config: { ...clientConfig, ...serverConfig },
    ssr: { req, res },
  };

  return new Promise((resolve) => {
    globalContext.run(initialServerContext, async () => {
      const context = globalContext.getStore();
      // grabs org, packageVersion, etc... to store in context
      // context technically needs to be set to empty object before this is called
      let initialClientContext;
      try {
        initialClientContext = await getInitialClientContext({
          req,
          res,
          options,
          clientConfig,
        });
        Object.assign(context, initialClientContext);
      } catch (err) {
        console.error("Initial context error", err);
      }

      const html = await getHtml(url, initialClientContext);
      try {
        const result = templateRenderer.render(html, {
          ...defaultRenderInfo,
          // elementRenderers: [elementRenderer, LitElementRenderer],
        });
        let htmlStr = "";
        for (const value of result) {
          htmlStr += value;
        }
        resolve(htmlStr);
      } catch (err) {
        console.error("Render error", err);
        resolve(html);
      }
    });
  });
}

async function getHtml(url: string, initialClientContext) {
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

  const { default: themeTemplate } = await import(
    "https://tfl.dev/@truffle/ui@0.0.3/components/theme/theme-template.js"
  );

  const clientEntrySrc = process.env.NODE_ENV === "production"
    ? "/client-entry.js"
    : new URL("./client-entry.ts", import.meta.url)
      .toString()
      .replace("file://", "");

  return html`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
    </head>
    <body>
      ${themeTemplate || ""}
      <div id="root">${componentTemplate || ""}</div>
      <script type="module" src="${clientEntrySrc}"></script>
      <script>window._truffleInitialContext = ${
    JSON.stringify(initialClientContext || "{}")
  }</script>
    </body>
    </html>`;
}
