import { getRedis } from "./redis.js";

export default async function handler(req, res) {

  try {
    const redis = await getRedis();

    // PING is read-only — verifies connectivity without writing any data
    await redis.ping();

    return res.status(200).json({
      status: "ok",
      redis: "connected"
    });

  } catch (error) {

    return res.status(500).json({
      status: "error",
      redis: "failed"
    });

  }

}