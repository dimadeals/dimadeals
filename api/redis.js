import { createClient } from "redis";

let globalClient;

export async function getRedis() {
  // 1. If already connected → reuse
  if (globalClient && globalClient.isOpen) {
    return globalClient;
  }

  // 2. Create new client
  const client = createClient({
    url: process.env.REDIS_URL
  });

  // 3. Handle errors properly
  client.on("error", (err) => {
    console.error("❌ Redis Error:", err);
  });

  // 4. Connect safely
  try {
    await client.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
    throw new Error("Redis connection failed");
  }

  // 5. Store globally (IMPORTANT)
  globalClient = client;

  return client;
}

export default getRedis;