import redis from "./redis.js";

export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /* =========================
     GET ORDER (Retrieve order)
  ==========================*/

  if (req.method === "GET") {

    try {

      const { orderId } = req.query;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "orderId parameter is required"
        });
      }

      const order = await redis.get(`order:${orderId}`);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
          orderId
        });
      }

      const orderData =
        typeof order === "string" ? JSON.parse(order) : order;

      return res.status(200).json({
        success: true,
        order: orderData
      });

    } catch (error) {

      console.error("Error retrieving order:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to retrieve order confirmation"
      });

    }

  }

  /* =========================
     POST (Confirm order)
  ==========================*/

  if (req.method === "POST") {

    try {

      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "orderId is required"
        });
      }

      const order = await redis.get(`order:${orderId}`);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found"
        });
      }

      const orderData =
        typeof order === "string" ? JSON.parse(order) : order;

      // Update status
      orderData.status = "confirmed";
      orderData.confirmedAt = new Date().toISOString();

      await redis.set(
        `order:${orderId}`,
        JSON.stringify(orderData),
        { ex: 7776000 } // 90 days
      );

      return res.status(200).json({
        success: true,
        message: "Order confirmed",
        order: orderData
      });

    } catch (error) {

      console.error("Error confirming order:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to confirm order"
      });

    }

  }

  return res.status(405).json({
    error: "Method not allowed"
  });

}