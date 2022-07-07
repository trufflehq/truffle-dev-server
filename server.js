import express from "express";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

const vite = await createViteServer({
  appType: "custom",
  ssr: { external: ['glob'] }, // errors w/o this
  server: {
    middlewareMode: true,
    // FIXME: I think we might be able to disable when this package is installed via hosted github
    // (vs installed from local)
    fs: { strict: false }
  },
});

const app = express();
app.use(vite.middlewares)
app.use('*', async (req, res, next) => {
  const url = req.originalUrl
  console.log(`Loading ${url}`)

  try {
    // vite doesn't like file urls :(
    const entry = (await import.meta.resolve("./server-entry.ts")).toString().replace('file://', '')
    const { render } = await vite.ssrLoadModule(entry);
    const appHtml = await render(url);
    const html = await vite.transformIndexHtml(url, appHtml);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    // If an error is caught, let Vite fix the stracktrace so it maps back to
    // your actual source code.
    vite.ssrFixStacktrace(e)
    next(e)
  }
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
