var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import vue from "@vitejs/plugin-vue";

// src/utils/sass.js
import jscodeshift from "jscodeshift";
import { applyTransform } from "jscodeshift/src/testUtils.js";
import sass from "sass";
var j = jscodeshift.withParser("tsx");
function isSassJsFile(filename) {
  return filename.match(/\.s(a|c)ss\.js$/);
}
__name(isSassJsFile, "isSassJsFile");
function viteSassToCss() {
  return {
    name: "sass-literal-to-css-literal",
    transform(src, id) {
      if (isSassJsFile(id)) {
        src = replaceSassLiteralWithCssLiteral(src);
        return {
          code: src,
          map: null
        };
      }
    }
  };
}
__name(viteSassToCss, "viteSassToCss");
function isSassTag(node) {
  return node.tag.name.match(/^s(a|c)ss$/);
}
__name(isSassTag, "isSassTag");
function transformSassLiteral(js) {
  jscodeshift;
  return j(js).find(j.TaggedTemplateExpression, isSassTag).replaceWith((node) => {
    if (node.value.quasi.quasis.length > 1) {
      throw new Error("Interpolations not supported atm");
    }
    const sassStr = node.value.quasi.quasis[0].value.raw;
    const result = sass.compileString(sassStr);
    node.value.quasi.quasis[0].value.raw = result.css;
    node.value.quasi.quasis[0].value.cooked = result.css;
    return node.value;
  }).toSource();
}
__name(transformSassLiteral, "transformSassLiteral");
function replaceSassLiteralWithCssLiteral(js) {
  return applyTransform(transformSassLiteral, {}, js);
}
__name(replaceSassLiteralWithCssLiteral, "replaceSassLiteralWithCssLiteral");

// server.ts
var PORT = process.env.SPOROCARP_PORT || 8e3;
async function startServer(options) {
  let vite;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      appType: "custom",
      logLevel: "silent",
      plugins: [
        viteSassToCss(),
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => tag.startsWith("tfl-")
            }
          }
        })
      ],
      ssr: { external: ["glob"] },
      server: {
        hmr: process.env.NODE_ENV !== "production",
        middlewareMode: true,
        fs: { strict: false }
      }
    });
  }
  const app = express();
  if (process.env.NODE_ENV === "production") {
    const dir = new URL(import.meta.url).toString().replace("file://", "");
    app.use(express.static(dir));
  } else {
    app.use(vite.middlewares);
  }
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    console.log(`Loading ${url}`);
    try {
      let render;
      if (process.env.NODE_ENV === "production") {
        ({ render } = await import("./server-entry.js"));
      } else {
        const entry = (await import.meta.resolve("./server-entry.js")).toString().replace(
          "file://",
          ""
        );
        ({ render } = await vite.ssrLoadModule(entry));
      }
      const appHtml = await render(req, res, options);
      const html = process.env.NODE_ENV === "production" ? appHtml : await vite.transformIndexHtml(url, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  listenForExit();
}
__name(startServer, "startServer");
function listenForExit() {
  ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM"].forEach((eventType) => {
    process.on(eventType, onExit.bind(null, { eventType }));
  });
}
__name(listenForExit, "listenForExit");
function onExit({ eventType }, err) {
  if (eventType === "uncaughtException") {
    return console.error("uncaughtException", err);
  }
  process.exit();
}
__name(onExit, "onExit");
export {
  isSassJsFile,
  replaceSassLiteralWithCssLiteral,
  startServer,
  transformSassLiteral,
  viteSassToCss
};
//# sourceMappingURL=server.mjs.map