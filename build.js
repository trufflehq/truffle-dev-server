
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
      },
    },
  });