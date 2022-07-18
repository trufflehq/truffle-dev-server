import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import fastSSR from "https://npm.tfl.dev/@microsoft/fast-ssr@1.0.0-beta.4";
import { html } from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import UniversalRouter from "https://npm.tfl.dev/universal-router@9";
import { setConfig } from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import { AsyncLocalStorage } from "node:async_hooks";
// NOTE: importing cjs will fail in this file (eg express for types)

// import { html, unsafeStatic } from "https://npm.tfl.dev/lit-html@2/static";

// fails with Cannot access 'LitElementRenderer' before initialization in node_modules/@lit-labs/ssr/lib/render-lit-html.js
// on skypack: [Package Error] \"module\" does not exist. (Imported by \"@lit-labs/ssr\")
// on npm.tfl.dev [ERR_NETWORK_IMPORT_DISALLOWED]: import of 'undefined'
// import { LitElementRenderer } from "@lit-labs/ssr/lib/lit-element-renderer.js";

import { addRouteAction } from "./router.ts";
import { clientConfig, getInitialClientData, serverConfig } from "./setup.ts";

const { templateRenderer, defaultRenderInfo, elementRenderer } = fastSSR();

// url imports can't import non-url imports, so we have to pass this in...
globalContext._PRIVATE_setInstance(new AsyncLocalStorage());

setConfig(serverConfig);

export function render(req, res, options) {
  const url = req.originalUrl;
  const initialServerContext = { ssr: { req, res } };

  return new Promise((resolve) => {
    globalContext.run(initialServerContext, async () => {
      const context = globalContext.getStore();
      // grabs org, packageVersion, etc... to store in context
      // context technically needs to be set to empty object before this is called
      let initialClientData;
      try {
        initialClientData = await getInitialClientData({
          req,
          res,
          options,
          clientConfig,
        });
        Object.assign(context, initialClientData);
      } catch (err) {
        console.error("Initial context error", err);
      }

      let htmlStr = await getHtmlStr(url, initialClientData);
      try {
        const result = templateRenderer.render(htmlStr, {
          ...defaultRenderInfo,
          // elementRenderers: [elementRenderer, LitElementRenderer],
        });
        htmlStr = "";
        for (const value of result) {
          htmlStr += value;
        }
        resolve(htmlStr);
      } catch (err) {
        console.error("Render error", err);
        // FIXME: this should return actual html, not tagged template
        resolve(htmlStr);
      }
    });
  });
}

async function getHtmlStr(url: string, initialClientData) {
  let componentTemplate;
  try {
    const router = new UniversalRouter(
      initialClientData.routes.map(addRouteAction),
    );
    componentTemplate = await router.resolve(url);
  } catch (err) {
    console.log("Base HTML error", err.message);
    componentTemplate = "";
  }

  const { default: themeTemplate } = await import(
    "https://tfl.dev/@truffle/ui@~0.0.3/components/theme/theme-template.ts"
  );

  const clientEntrySrc = process.env.NODE_ENV === "production"
    ? "/client-entry.js"
    : new URL("./client-entry.ts", import.meta.url)
      .toString()
      .replace("file://", "");

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
      <script async src="https://unpkg.com/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.js"></script>
    </head>
    <body>
      ${themeTemplate || ""}
      <div id="root">${componentTemplate || ""}</div>
      <script type="module" src="${clientEntrySrc}"></script>
      <script>window._truffleInitialData = ${
    JSON.stringify(initialClientData || "{}")
  }</script>
    </body>
    </html>`;
}
