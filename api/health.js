import { getRedis } from "./redis.js";

export default async function handler(req, res) {

  try {
    const redis = await getRedis();

    // write test
    await redis.set("test-key", "connected");

    // read test
    const value = await redis.get("test-key");

    return res.status(200).json({
      status: "ok",
      redis: value
    });

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    });

  }

}