import { relative, resolve as resolveDir } from "path";
import { defineConfig } from "tsup";

export default defineConfig({
  clean: false,
  dts: true,
  entry: ["./server.ts"],
  format: ["esm", "cjs"],
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: "es2021",
  tsconfig: relative(
    __dirname,
    resolveDir(process.cwd(), "tsconfig.json"),
  ),
  keepNames: true,
  globalName: "TruffleCLI",
  outDir: "dist",
  esbuildOptions: (options, context) => {
    if (context.format === "cjs") {
      options.banner = {
        js: '"use strict";',
      };
    }
  },
});
