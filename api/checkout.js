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
     CREATE ORDER (POST)
  ==========================*/

  if (req.method === "POST") {
    try {

      const { items, email, phone, fullname, country } = req.body;

      /* -------- Validation -------- */

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Cart is empty"
        });
      }

      if (!email || !phone || !fullname) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields"
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email"
        });
      }

      const cleanPhone = phone.replace(/\D/g, "");

      if (cleanPhone.length !== 8) {
        return res.status(400).json({
          success: false,
          error: "Phone must be 8 digits"
        });
      }

      if (fullname.trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: "Name too short"
        });
      }

      /* -------- Generate Order ID -------- */

      const orderId =
        `ORD-${Date.now()}-${Math.random().toString(36).substring(2,9).toUpperCase()}`;

      /* -------- Calculate totals -------- */

      const subtotal = items.reduce(
        (sum, item) => sum + (item.price * (item.quantity || 1)),
        0
      );

      /* -------- Order Object -------- */

      const orderRecord = {
        orderId,
        email: email.toLowerCase(),
        phone: cleanPhone,
        fullname: fullname.trim(),
        country: country || "TN",

        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        })),

        subtotal,
        tax: 0,
        total: subtotal,

        status: "completed",
        paymentStatus: "pending",

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"]
      };

      console.log("Processing order:", orderId);

      /* -------- Save to Redis -------- */

      let savedToDatabase = false;

      try {

        await redis.set(
          `order:${orderId}`,
          JSON.stringify(orderRecord),
          { ex: 7776000 } // 90 days
        );

        const customerOrders =
          await redis.get(`customer:${email}:orders`) || "[]";

        const orders = JSON.parse(customerOrders);

        orders.push(orderId);

        await redis.set(
          `customer:${email}:orders`,
          JSON.stringify(orders),
          { ex: 31536000 }
        );

        savedToDatabase = true;

      } catch (dbError) {

        console.error("Database error:", dbError);

      }

      /* -------- Response -------- */

      return res.status(200).json({
        success: true,
        message: "Order placed successfully",
        orderId,
        email,
        savedToDatabase
      });

    } catch (error) {

      console.error("Checkout error:", error);

      return res.status(500).json({
        success: false,
        error: "Checkout failed",
        message: error.message
      });

    }
  }

  /* =========================
     GET ORDER
  ==========================*/

  if (req.method === "GET") {

    try {

      const { orderId } = req.query;

      if (!orderId) {
        return res.status(400).json({
          error: "orderId query parameter is required"
        });
      }

      const order = await redis.get(`order:${orderId}`);

      if (!order) {
        return res.status(404).json({
          error: "Order not found"
        });
      }

      return res.status(200).json(
        typeof order === "string" ? JSON.parse(order) : order
      );

    } catch (error) {

      console.error("Retrieve error:", error);

      return res.status(500).json({
        error: "Failed to retrieve order"
      });

    }

  }

  return res.status(405).json({
    error: "Method not allowed"
  });

}