// ideally this file stays as pure js so we don't have to compile.
// vite handles compiling all other files
import express from "express";
import { createServer as createViteServer } from "vite";

const PORT = process.env.SPOROCARP_PORT || 8000;

// truffle-cli passes in { packageVersion } (for getting org, etc... with setup.lcal)
export async function startServer(options) {
  const vite = await createViteServer({
    appType: "custom",
    logLevel: "silent",
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
    const dir = new URL("../dist", import.meta.url)
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
      // TODO: import('./server-entry.js') for prod
      // plus compile the frontend code (.ts files in this repo)
      // plus use <script> with the compiled .js file in server-entry.ts

      // vite doesn't like file urls :(
      const entry = (await import.meta.resolve("./server-entry.ts")).toString().replace('file://', '')
      const { render } = await vite.ssrLoadModule(entry);
      const appHtml = await render(req, res, options);
      const html = process.env.NODE_ENV !== "production"
        ? await vite.transformIndexHtml(url, appHtml)
        : appHtml;
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
