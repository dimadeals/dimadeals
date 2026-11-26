import { MemoryStore } from "./memory-store.js";

// A single client per serverless instance. Storing the *promise* (not just the
// client) prevents concurrent cold-start requests from opening several
// connections at the same time.
let globalClientPromise = null;
let memoryStore = null;

async function connectRedis() {
  const { createClient } = await import("redis");
  const client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (err) => {
    console.error("❌ Redis Error:", err);
  });
  client.on("end", () => {
    globalClientPromise = null;
  });

  await client.connect();
  console.log("✅ Redis connected");
  return client;
}

export async function getRedis() {
  if (process.env.REDIS_URL) {
    if (!globalClientPromise) {
      globalClientPromise = connectRedis().catch((err) => {
        // Do not cache a failed connection; the next request can retry.
        globalClientPromise = null;
        throw new Error(`Redis connection failed: ${err.message}`);
      });
    }
    return globalClientPromise;
  }

  // No Redis configured. In production this would silently split orders across
  // ephemeral lambda instances, so fail loudly unless explicitly overridden.
  const isProduction = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
  if (isProduction && String(process.env.ALLOW_MEMORY_STORE).toLowerCase() !== "true") {
    throw new Error("REDIS_URL is required in production (set ALLOW_MEMORY_STORE=true to override)");
  }

  // Local development / demo: use the in-memory store so the whole shop,
  // checkout, and admin dashboard still work without external services.
  if (!memoryStore) {
    memoryStore = new MemoryStore();
    console.log("ℹ️  REDIS_URL not set — using in-memory store (data resets on restart)");
  }
  return memoryStore;
}

export default getRedis;
