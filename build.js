
  import { build } from "vite";
  
  await build({
    build: {
      lib: {
        entry: "./src/server-entry.ts",
        name: "server",
        formats: ["es"],
        fileName: () => `server-entry.js`
      },
      rollupOptions: {
        external: ['node:async_hooks'],
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
        }
      },
    },
  });
  
  await build({
    build: {
      emptyOutDir: false,
      lib: {
        entry: "./src/client-entry.ts",
        name: "client",
        formats: ["es"],
        fileName: () => `client-entry.js`,
      },
      rollupOptions: {
        external: ['node:async_hooks'],
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
        }
      },
    },
  });