import { getRedis } from "./redis.js";
import { ensureSeeded } from "./seed.js";

const MAX_ITEMS = 50;
const MAX_LINE_QUANTITY = 99;

// Strip HTML/script tags from strings to prevent stored XSS
function sanitize(str, maxLength = 500) {
  return String(str ?? "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, maxLength);
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function publicOrder(order) {
  return {
    orderId: order.orderId,
    email: order.email,
    phone: order.phone,
    fullname: order.fullname,
    country: order.country,
    items: Array.isArray(order.items) ? order.items : [],
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export default async function handler(req, res) {
  // CORS — must be explicitly configured in production (no wildcard fallback)
  const corsOrigin = process.env.FRONTEND_ORIGIN;
  if (corsOrigin) res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(200).end();

  /* =========================
     CREATE ORDER (POST)
  ==========================*/
  if (req.method === "POST") {
    try {
      const redis = await getRedis();
      await ensureSeeded(redis);

      const body = req.body || {};
      const { items, email, phone, fullname, country } = body;

      /* -------- Validation -------- */

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: "Cart is empty" });
      }
      if (items.length > MAX_ITEMS) {
        return res.status(400).json({ success: false, error: "Too many items in the cart" });
      }
      if (!email || !phone || !fullname) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (cleanEmail.length > 254 || !emailRegex.test(cleanEmail)) {
        return res.status(400).json({ success: false, error: "Invalid email" });
      }

      const cleanPhone = String(phone).replace(/\D/g, "");
      if (cleanPhone.length !== 8) {
        return res.status(400).json({ success: false, error: "Phone must be 8 digits" });
      }

      const cleanFullname = sanitize(fullname, 100);
      if (cleanFullname.length < 3) {
        return res.status(400).json({ success: false, error: "Name too short" });
      }

      const cleanCountry = sanitize(country || "TN", 50).toUpperCase() || "TN";

      /* -------- Normalize cart lines (server never trusts client prices) -------- */

      const requested = new Map();
      for (const item of items) {
        const id = Number(item?.id);
        if (!Number.isInteger(id) || id <= 0) {
          return res.status(400).json({ success: false, error: "Cart contains an invalid product" });
        }
        const quantity = Number(item?.quantity ?? 1);
        if (!Number.isFinite(quantity) || !Number.isInteger(quantity) || quantity < 1) {
          return res.status(400).json({ success: false, error: "Cart contains an invalid quantity" });
        }
        const merged = (requested.get(id) || 0) + quantity;
        if (merged > MAX_LINE_QUANTITY) {
          return res.status(400).json({ success: false, error: "Quantity per product cannot exceed 99" });
        }
        requested.set(id, merged);
      }

      /* -------- Fetch all products from Redis -------- */

      const productIds = [...requested.keys()];
      const rawProducts = await redis.mGet(productIds.map((id) => `product:${id}`));

      const productMap = new Map();
      for (let i = 0; i < productIds.length; i += 1) {
        if (!rawProducts[i]) {
          return res.status(400).json({
            success: false,
            error: `Product with ID ${productIds[i]} is no longer available. Please remove it from your cart and try again.`,
          });
        }
        try {
          const product = JSON.parse(rawProducts[i]);
          productMap.set(productIds[i], product);
        } catch {
          return res.status(400).json({ success: false, error: `Failed to read product ${productIds[i]}` });
        }
      }

      /* -------- Validate stock and calculate totals -------- */

      let subtotal = 0;
      const validatedItems = [];

      for (const [id, quantity] of requested) {
        const product = productMap.get(id);
        if (!product) {
          return res.status(400).json({ success: false, error: `Product ${id} not found` });
        }
        // Products created before the inStock flag existed must remain purchasable.
        if (product.inStock === false) {
          return res.status(400).json({ success: false, error: `${product.name} is out of stock` });
        }
        const price = Number(product.price);
        if (!Number.isFinite(price) || price < 0) {
          return res.status(400).json({ success: false, error: `${product.name} has an invalid price` });
        }

        subtotal += price * quantity;
        validatedItems.push({
          id: Number(product.id),
          name: String(product.name ?? ""),
          price,
          quantity,
        });
      }

      subtotal = roundMoney(subtotal);

      /* -------- Generate Order ID -------- */

      let orderId;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const candidate = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        if (!(await redis.exists(`order:${candidate}`))) { orderId = candidate; break; }
      }
      if (!orderId) {
        return res.status(500).json({ success: false, error: "Could not create an order ID. Please retry." });
      }

      /* -------- Order Object -------- */

      const now = new Date().toISOString();
      const orderRecord = {
        orderId,
        email: cleanEmail,
        phone: cleanPhone,
        fullname: cleanFullname,
        country: cleanCountry,
        items: validatedItems,
        subtotal,
        tax: 0,
        total: subtotal,
        status: "pending",
        paymentStatus: "pending",
        createdAt: now,
        updatedAt: now,
        ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null,
        userAgent: req.headers["user-agent"] || null,
      };

      /* -------- Save to Redis -------- */

      try {
        await redis.set(`order:${orderId}`, JSON.stringify(orderRecord));
      } catch (dbError) {
        // Never tell the customer an order succeeded when it was not persisted.
        console.error("Order save error:", dbError);
        return res.status(500).json({
          success: false,
          error: "We could not save your order. Please try again.",
        });
      }

      // Customer order index is a convenience; failure here must not fail the order.
      try {
        const customerKey = `customer:${cleanEmail}:orders`;
        const customerOrders = (await redis.get(customerKey)) || "[]";
        let orders = [];
        try { orders = JSON.parse(customerOrders); } catch { orders = []; }
        if (!Array.isArray(orders)) orders = [];
        orders.push(orderId);
        await redis.set(customerKey, JSON.stringify(orders));
      } catch (indexError) {
        console.error("Customer order index error:", indexError);
      }

      /* -------- Response -------- */

      return res.status(200).json({
        success: true,
        message: "Order placed successfully",
        orderId,
        email: cleanEmail,
        total: subtotal,
        savedToDatabase: true,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      return res.status(500).json({ success: false, error: "Checkout failed" });
    }
  }

  /* =========================
     GET ORDER
  ==========================*/
  if (req.method === "GET") {
    try {
      const orderId = String(req.query?.orderId ?? "").trim();
      if (!orderId) {
        return res.status(400).json({ success: false, error: "orderId query parameter is required" });
      }
      if (orderId.length > 120) {
        return res.status(400).json({ success: false, error: "Invalid order ID" });
      }

      const redis = await getRedis();
      const raw = await redis.get(`order:${orderId}`);
      if (!raw) return res.status(404).json({ success: false, error: "Order not found" });

      let order;
      try { order = JSON.parse(raw); } catch {
        return res.status(500).json({ success: false, error: "Stored order is corrupted" });
      }

      // Public lookup by (unguessable) order ID: expose only customer-facing data.
      return res.status(200).json(publicOrder(order));
    } catch (error) {
      console.error("Retrieve error:", error);
      return res.status(500).json({ success: false, error: "Failed to retrieve order" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
