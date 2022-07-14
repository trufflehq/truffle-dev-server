// ideally this file stays as pure js so we don't have to compile.
// vite handles compiling all other files
import express from "express";
import { createServer as createViteServer } from "vite";
// TODO: add .vue file support (will need to do same in oscar)
// atm the plugin imports from 'vue' and doesn't let us specify url instead
// so would need that fixed. until then have to use a package.json
import vue from '@vitejs/plugin-vue'

const PORT = process.env.SPOROCARP_PORT || 8000;

// truffle-cli passes in { packageVersion } (for getting org, etc... with setup.lcal)
export async function startServer(options) {
  const vite = await createViteServer({
    appType: "custom",
    logLevel: "silent",
    plugins: [vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('tfl-')
        }
      }
    })],
    ssr: { external: ['glob'] }, // errors w/o this
    server: {
      hmr: process.env.NODE_ENV !== "production",
      middlewareMode: true,
      // FIXME: I think we might be able to disable when this package is installed via hosted github
      // (vs installed from local)
      fs: { strict: false }
    },
  });

  const app = express();

  if (process.env.NODE_ENV === 'production') {
    const dir = new URL("./dist", import.meta.url)
      .toString()
      .replace("file://", "");
    app.use(express.static(dir))
  } else {
    app.use(vite.middlewares)
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    console.log(`Loading ${url}`)

    try {
      let render
      if (process.env.NODE_ENV === 'production') {
        ({ render } = await import('./dist/server-entry.js'));
      } else {
        // vite doesn't like file urls :(
        const entry = (await import.meta.resolve("./src/server-entry.ts")).toString().replace('file://', '')
        ;({ render } = await vite.ssrLoadModule(entry));
      }
      const appHtml = await render(req, res, options);
      const html = process.env.NODE_ENV === "production"
        ? appHtml
        : await vite.transformIndexHtml(url, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stracktrace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  });
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  listenForExit()
}

function listenForExit () {
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onExit.bind(null, { eventType }))
  })
}

function onExit ({ eventType }, err) {
  if (eventType === 'uncaughtException') {
    return console.error('uncaughtException', err)
  }
  process.exit()
}
