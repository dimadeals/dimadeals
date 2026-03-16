import { kv } from "@vercel/kv";

export default async function handler(req, res) {

  try {

    // write test
    await kv.set("test-key", "connected");

    // read test
    const value = await kv.get("test-key");

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