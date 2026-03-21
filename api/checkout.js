import { getRedis } from "./redis.js";

// Strip HTML/script tags from strings to prevent stored XSS
function sanitize(str) {
  return String(str ?? "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, 500);
}

export default async function handler(req, res) {

  // CORS — must be explicitly configured in production (no wildcard fallback)
  const corsOrigin = process.env.FRONTEND_ORIGIN;
  if (corsOrigin) {
    res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /* =========================
     CREATE ORDER (POST)
  ==========================*/

  if (req.method === "POST") {
    const redis = await getRedis();
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

      /* -------- Fetch all products in parallel (Promise.all + redis.get) -------- */

      const productIds = [...new Set(items.map(item => item.id))];
      const rawProducts = await Promise.all(
        productIds.map(id => redis.get(`product:${id}`))
      );

      const productMap = {};
      for (let i = 0; i < productIds.length; i++) {
        if (!rawProducts[i]) {
          return res.status(400).json({
            success: false,
            error: `Product ${productIds[i]} not found`
          });
        }
        try {
          productMap[productIds[i]] = JSON.parse(rawProducts[i]);
        } catch {
          return res.status(400).json({
            success: false,
            error: `Failed to read product ${productIds[i]}`
          });
        }
      }

      /* -------- Validate stock and calculate totals -------- */

      let subtotal = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = productMap[item.id];
        if (!product) {
          return res.status(400).json({
            success: false,
            error: `Product ${item.id} not found`
          });
        }

        if (!product.inStock) {
          return res.status(400).json({
            success: false,
            error: `${product.name} is out of stock`
          });
        }

        const quantity = Number(item.quantity) || 1;
        subtotal += product.price * quantity;

        validatedItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity
        });
      }

      /* -------- Order Object -------- */



      const orderRecord = {
  orderId,
  email: email.toLowerCase(),
  phone: cleanPhone,
  fullname: fullname.trim(),
  country: country || "TN",

  items: validatedItems, // ✅ USE THIS (NOT frontend items)

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

        // Orders are stored permanently (no expiry) to preserve full history
        await redis.set(
          `order:${orderId}`,
          JSON.stringify(orderRecord)
        );

        const customerOrders =
          await redis.get(`customer:${email}:orders`) || "[]";

        const orders = JSON.parse(customerOrders);
        orders.push(orderId);

        // Customer order index is also stored permanently
        await redis.set(
          `customer:${email}:orders`,
          JSON.stringify(orders)
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
        error: "Checkout failed"
      });

    }
  }

  /* =========================
     GET ORDER
  ==========================*/

  if (req.method === "GET") {
    const redis = await getRedis();
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
