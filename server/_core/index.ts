import "dotenv/config";
import express from "express";
import fs from "fs";
import { createServer } from "http";
import net from "net";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { initDatabase } from "../bootstrap";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";
import { ADMIN_COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Migration ve boş tablo seed işlemleri; hata olsa bile sunucu açılır.
  try {
    await initDatabase();
  } catch (error) {
    console.error("[Bootstrap] Veritabanı hazırlığı başarısız:", error);
  }

  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // ============ ADMIN AUTH REST ENDPOINTS ============
  const adminSecret = new TextEncoder().encode(ENV.cookieSecret);

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Kullanıcı adı ve şifre gereklidir" });
      }
      if (username !== ENV.adminUsername || password !== ENV.adminPassword) {
        return res.status(401).json({ error: "Kullanıcı adı veya şifre hatalı" });
      }
      // Create JWT token
      const token = await new SignJWT({ role: "admin", username })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000))
        .sign(adminSecret);

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(ADMIN_COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
      return res.json({ success: true, username });
    } catch (error) {
      console.error("[Admin Login] Error:", error);
      return res.status(500).json({ error: "Sunucu hatası" });
    }
  });

  app.get("/api/admin/verify", async (req, res) => {
    try {
      const cookieHeader = req.headers.cookie;
      if (!cookieHeader) {
        return res.status(401).json({ authenticated: false });
      }
      const { parse: parseCookie } = await import("cookie");
      const cookies = parseCookie(cookieHeader);
      const token = cookies[ADMIN_COOKIE_NAME];
      if (!token) {
        return res.status(401).json({ authenticated: false });
      }
      const { payload } = await jwtVerify(token, adminSecret, { algorithms: ["HS256"] });
      if (payload.role !== "admin") {
        return res.status(403).json({ authenticated: false });
      }
      return res.json({ authenticated: true, username: payload.username });
    } catch (error) {
      return res.status(401).json({ authenticated: false });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(ADMIN_COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return res.json({ success: true });
  });
  // ============ STATIC SEO FILES ============
  app.get("/sitemap.xml", (_req, res) => {
    const sitemapPath = path.resolve(import.meta.dirname, "../../client/public/sitemap.xml");
    const distSitemapPath = process.env.NODE_ENV === "production"
      ? path.resolve(import.meta.dirname, "public/sitemap.xml")
      : sitemapPath;
    const filePath = fs.existsSync(distSitemapPath) ? distSitemapPath : sitemapPath;
    if (fs.existsSync(filePath)) {
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.send(fs.readFileSync(filePath, "utf-8"));
    } else {
      res.status(404).send("Sitemap not found");
    }
  });

  app.get("/robots.txt", (_req, res) => {
    const robotsPath = path.resolve(import.meta.dirname, "../../client/public/robots.txt");
    const distRobotsPath = process.env.NODE_ENV === "production"
      ? path.resolve(import.meta.dirname, "public/robots.txt")
      : robotsPath;
    const filePath = fs.existsSync(distRobotsPath) ? distRobotsPath : robotsPath;
    if (fs.existsSync(filePath)) {
      res.set("Content-Type", "text/plain; charset=utf-8");
      res.send(fs.readFileSync(filePath, "utf-8"));
    } else {
      res.status(404).send("Robots.txt not found");
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
