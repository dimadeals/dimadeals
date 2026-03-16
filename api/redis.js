import { createClient } from "redis";

let client = null;

/**
 * Returns a connected Redis client, creating one if needed.
 * Safe to call on every request (serverless-friendly singleton).
 */
export async function getRedis() {
  if (client?.isReady) return client;

  client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
    // Mark client as unusable so the next request reconnects cleanly
    client = null;
  });

  await client.connect();
  return client;
}

export default getRedis;