import { getRedis } from "./redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    const redis = await getRedis();
    await redis.ping();

    return res.status(200).json({
      status: "ok",
      redis: process.env.REDIS_URL ? "connected" : "in-memory",
    });
  } catch (error) {
    console.error("[health] Redis check failed:", error);
    return res.status(500).json({
      status: "error",
      redis: "failed",
    });
  }
}
