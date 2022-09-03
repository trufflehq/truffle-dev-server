"use strict";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  isSassJsFile: () => isSassJsFile,
  replaceSassLiteralWithCssLiteral: () => replaceSassLiteralWithCssLiteral,
  startServer: () => startServer,
  transformSassLiteral: () => transformSassLiteral,
  viteSassToCss: () => viteSassToCss
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"));
var import_vite = require("vite");
var import_plugin_vue = __toESM(require("@vitejs/plugin-vue"));

// src/utils/sass.js
var import_jscodeshift = __toESM(require("jscodeshift"));
var import_testUtils = require("jscodeshift/src/testUtils.js");
var import_sass = __toESM(require("sass"));
var j = import_jscodeshift.default.withParser("tsx");
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
  import_jscodeshift.default;
  return j(js).find(j.TaggedTemplateExpression, isSassTag).replaceWith((node) => {
    if (node.value.quasi.quasis.length > 1) {
      throw new Error("Interpolations not supported atm");
    }
    const sassStr = node.value.quasi.quasis[0].value.raw;
    const result = import_sass.default.compileString(sassStr);
    node.value.quasi.quasis[0].value.raw = result.css;
    node.value.quasi.quasis[0].value.cooked = result.css;
    return node.value;
  }).toSource();
}
__name(transformSassLiteral, "transformSassLiteral");
function replaceSassLiteralWithCssLiteral(js) {
  return (0, import_testUtils.applyTransform)(transformSassLiteral, {}, js);
}
__name(replaceSassLiteralWithCssLiteral, "replaceSassLiteralWithCssLiteral");

// server.ts
var import_meta = {};
var PORT = process.env.SPOROCARP_PORT || 8e3;
async function startServer(options) {
  let vite;
  if (process.env.NODE_ENV !== "production") {
    vite = await (0, import_vite.createServer)({
      appType: "custom",
      logLevel: "silent",
      plugins: [
        viteSassToCss(),
        (0, import_plugin_vue.default)({
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
  const app = (0, import_express.default)();
  if (process.env.NODE_ENV === "production") {
    const dir = new URL(import_meta.url).toString().replace("file://", "");
    app.use(import_express.default.static(dir));
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
        const entry = (await import_meta.resolve("./server-entry.js")).toString().replace(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isSassJsFile,
  replaceSassLiteralWithCssLiteral,
  startServer,
  transformSassLiteral,
  viteSassToCss
});
//# sourceMappingURL=server.js.map