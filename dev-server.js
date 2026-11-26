#!/usr/bin/env node
// ============================================================================
// Zero-dependency local development server for DIMA Deals
// ----------------------------------------------------------------------------
// Serves the static site and runs the real Vercel handlers in api/ with a
// Vercel-like req/res shim. No `vercel` CLI, no Redis, and no npm install are
// required: when REDIS_URL is absent the API uses an in-memory store that is
// seeded with the starter catalog.
//
// Usage: npm run dev   (or: node dev-server.js)
// ============================================================================

import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

// ── .env loader (no dependency) ─────────────────────────────────────────────
async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") console.warn("Could not read .env:", error.message);
  }
}

await loadEnv();

if (!process.env.ADMIN_KEY) {
  process.env.ADMIN_KEY = "dev-admin-key";
  console.log("ℹ️  ADMIN_KEY not set — using local demo key: dev-admin-key");
}

// ── Constants ───────────────────────────────────────────────────────────────
const CLEAN_ROUTES = {
  "/": "/index.html",
  "/index": "/index.html",
  "/browse": "/browse.html",
  "/product": "/product.html",
  "/cart": "/cart.html",
  "/checkout": "/checkout.html",
  "/confirmation": "/confirmation.html",
  "/search": "/search.html",
  "/admin": "/admin.html",
  "/about": "/about.html",
  "/contact": "/contact.html",
  "/faq": "/faq.html",
  "/help": "/help.html",
  "/privacy": "/privacy.html",
  "/terms": "/terms.html",
};

const API_HANDLERS = {
  products: "./api/products.js",
  categories: "./api/categories.js",
  checkout: "./api/checkout.js",
  orders: "./api/orders.js",
  messages: "./api/messages.js",
  health: "./api/health.js",
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const handlerCache = new Map();

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
}

async function readRequestBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1_000_000) throw new Error("Request body too large");
    chunks.push(chunk);
  }
  if (chunks.length === 0) return undefined;

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return undefined;

  const contentType = String(req.headers["content-type"] || "");
  if (contentType.includes("application/json") || contentType === "") {
    try { return JSON.parse(raw); } catch { throw new Error("Invalid JSON body"); }
  }
  return raw;
}

async function getHandler(name) {
  if (!handlerCache.has(name)) {
    const modulePath = API_HANDLERS[name];
    const promise = import(new URL(modulePath, import.meta.url).href);
    handlerCache.set(name, promise);
    // Do not cache a failed import forever.
    promise.catch(() => handlerCache.delete(name));
  }
  return handlerCache.get(name);
}

async function handleApi(req, res, url) {
  const name = url.pathname.slice("/api/".length).split("/")[0];
  if (!API_HANDLERS[name]) {
    return sendJson(res, 404, { success: false, error: "API endpoint not found" });
  }

  try {
    const mod = await getHandler(name);
    const handler = mod.default;
    if (typeof handler !== "function") throw new Error(`Handler ${name} has no default export`);

    req.query = Object.fromEntries(url.searchParams.entries());
    req.body = req.method === "GET" || req.method === "HEAD" ? undefined : await readRequestBody(req);
    req.cookies = {};

    // Vercel-style response helpers
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (payload) => {
      const body = JSON.stringify(payload);
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Length", Buffer.byteLength(body));
      res.end(body);
      return res;
    };
    res.send = (payload) => {
      if (payload && typeof payload === "object") return res.json(payload);
      res.end(String(payload ?? ""));
      return res;
    };

    await handler(req, res);
    if (!res.writableEnded) res.end();
  } catch (error) {
    console.error(`[api/${name}]`, error);
    if (!res.headersSent) sendJson(res, 500, { success: false, error: "Internal server error" });
    else res.end();
  }
}

async function resolveStaticPath(url) {
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return null; }

  if (pathname.endsWith("/")) pathname += "index.html";
  if (CLEAN_ROUTES[pathname]) pathname = CLEAN_ROUTES[pathname];

  // Block dotfiles and traversal
  const segments = pathname.split("/").filter(Boolean);
  if (segments.some((segment) => segment.startsWith("."))) return null;

  const absolute = path.resolve(ROOT, `.${pathname}`);
  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) return null;

  try {
    const info = await stat(absolute);
    if (info.isFile()) return absolute;
    if (info.isDirectory()) {
      const indexPath = path.join(absolute, "index.html");
      const indexInfo = await stat(indexPath);
      if (indexInfo.isFile()) return indexPath;
    }
  } catch { /* fall through */ }

  // Allow extension-less files such as /browse -> /browse.html
  if (!path.extname(absolute)) {
    const htmlPath = `${absolute}.html`;
    try {
      const info = await stat(htmlPath);
      if (info.isFile()) return htmlPath;
    } catch { /* not found */ }
  }
  return null;
}

async function serveStatic(req, res, url) {
  const filePath = await resolveStaticPath(url);
  if (!filePath) {
    return sendJson(res, 404, { success: false, error: "Not found" });
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const isHtml = ext === ".html";

  try {
    const info = await stat(filePath);
    res.statusCode = 200;
    res.setHeader("Content-Type", type);
    res.setHeader("Content-Length", info.size);
    res.setHeader("Cache-Control", isHtml ? "no-cache" : "public, max-age=3600");

    if (req.method === "HEAD") return res.end();
    createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Static file error:", error);
    sendJson(res, 500, { success: false, error: "Failed to read file" });
  }
}

// ── Server ──────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  setSecurityHeaders(res);
  let url;
  try { url = new URL(req.url, "http://localhost"); } catch {
    return sendJson(res, 400, { success: false, error: "Bad request" });
  }

  if (url.pathname.startsWith("/api/")) {
    return handleApi(req, res, url);
  }
  return serveStatic(req, res, url);
});

function listen(port, attemptsLeft) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
      console.log(`Port ${port} is busy, trying ${port + 1}…`);
      setImmediate(() => listen(port + 1, attemptsLeft - 1));
      return;
    }
    console.error("Server error:", error);
    process.exitCode = 1;
  });

  server.listen(port, "127.0.0.1", () => {
    const production = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
    const store = process.env.REDIS_URL
      ? "Redis"
      : production
        ? "unavailable (REDIS_URL is required in production)"
        : "in-memory (seeded catalog)";
    console.log("");
    console.log("  DIMA Deals dev server");
    console.log(`  → http://127.0.0.1:${port}`);
    console.log(`  → admin: http://127.0.0.1:${port}/admin`);
    console.log(`  → store: ${store}`);
    if (!process.env.REDIS_URL && !production) {
      console.log(`  → admin key: ${process.env.ADMIN_KEY}`);
    }
    console.log("");
  });
}

const startPort = Number(process.env.PORT) || 3000;
listen(startPort, 10);
