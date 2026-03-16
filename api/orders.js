import redis from "./redis.js";

export default async function handler(req, res) {

  const adminKey = req.headers.authorization;

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {

    const keys = await redis.keys("order:*");

    const orders = [];

    for (const key of keys) {
      const order = await redis.get(key);
      orders.push(JSON.parse(order));
    }

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

}