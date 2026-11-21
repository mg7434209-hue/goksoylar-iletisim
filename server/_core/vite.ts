import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { injectSeo } from "./seoHtml";

/** İstek yolunu sorgu dizesi olmadan döndürür. */
function requestPath(originalUrl: string): string {
  return originalUrl.split(/[?#]/)[0] || "/";
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const transformed = await vite.transformIndexHtml(url, template);
      const { html, status } = injectSeo(transformed, requestPath(url));
      res.status(status).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // index:false → "/" isteği de aşağıdaki SEO enjeksiyonlu işleyiciden geçer;
  // aksi halde express.static ham index.html'i doğrudan servis eder.
  app.use(express.static(distPath, { index: false }));

  // Dosya yoksa SPA'nın index.html'ine düş; ancak her sayfa kendi title/meta/
  // JSON-LD'si ile gelir ve bilinmeyen yollar gerçek 404 döner (soft-404 yok).
  const indexPath = path.resolve(distPath, "index.html");
  let indexHtml: string | null = null;
  app.use("*", (req, res, next) => {
    try {
      indexHtml ??= fs.readFileSync(indexPath, "utf-8");
      const { html, status } = injectSeo(
        indexHtml,
        requestPath(req.originalUrl)
      );
      res
        .status(status)
        .set({ "Content-Type": "text/html; charset=utf-8" })
        .end(html);
    } catch (error) {
      next(error);
    }
  });
}
