import { getRedis, isAdminRequest } from "./redis.js";

const VALID_STATUSES = ["pending", "processing", "completed", "delivered", "cancelled"];

function setCommonHeaders(res) {
  const corsOrigin = process.env.ADMIN_ORIGIN;
  if (corsOrigin) res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");
}

function time(value) {
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
}

async function scanKeys(redis, match) {
  const keys = [];
  let cursor = "0";
  do {
    const result = await redis.scan(cursor, { MATCH: match, COUNT: 200 });
    cursor = String(result.cursor || "0");
    keys.push(...result.keys);
  } while (cursor !== "0");
  return keys;
}

async function removeFromCustomerIndex(redis, order) {
  if (!order || !order.email) return;
  try {
    const key = `customer:${order.email}:orders`;
    const raw = await redis.get(key);
    if (!raw) return;
    let ids;
    try { ids = JSON.parse(raw); } catch { return; }
    if (!Array.isArray(ids)) return;
    const filtered = ids.filter((id) => id !== order.orderId);
    await redis.set(key, JSON.stringify(filtered));
  } catch (error) {
    console.error("[orders] Could not update customer index:", error);
  }
}

export default async function handler(req, res) {
  setCommonHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  // Auth check — constant-time comparison, fails closed without ADMIN_KEY
  if (!isAdminRequest(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  let redis;
  try {
    redis = await getRedis();
  } catch (error) {
    console.error("[orders] Store unavailable:", error);
    return res.status(503).json({ success: false, error: "Order store is unavailable" });
  }

  /* =========================
     GET — list orders
  ==========================*/
  if (req.method === "GET") {
    try {
      const query = req.query || {};
      const pageNum = Math.max(1, parseInt(query.page, 10) || 1);
      const limitNum = Math.min(200, Math.max(1, parseInt(query.limit, 10) || 50));
      const status = query.status ? String(query.status) : "";
      const search = query.search ? String(query.search).toLowerCase().trim() : "";

      const allKeys = await scanKeys(redis, "order:*");

      if (allKeys.length === 0) {
        return res.status(200).json({
          success: true,
          orders: [],
          total: 0,
          page: pageNum,
          pages: 0,
          stats: { revenue: 0, pending: 0, completed: 0, cancelled: 0, today: 0, total: 0 },
        });
      }

      // MGET — single round-trip instead of N individual GETs
      const raw = await redis.mGet(allKeys);
      let orders = raw
        .filter(Boolean)
        .map((item) => {
          try { return JSON.parse(item); } catch (error) {
            console.error("Failed to parse order:", error);
            return null;
          }
        })
        .filter((order) => order && order.orderId)
        .sort((a, b) => time(b.createdAt) - time(a.createdAt));

      // Stats are computed from the full dataset, before list filters.
      const today = new Date().toDateString();
      const stats = {
        total: orders.length,
        // Cancelled orders should not count towards revenue.
        revenue: Math.round(
          orders
            .filter((o) => o.status !== "cancelled")
            .reduce((sum, o) => sum + (Number(o.total) || 0), 0) * 100
        ) / 100,
        pending: orders.filter((o) => o.status === "pending").length,
        completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
        today: orders.filter((o) => new Date(o.createdAt).toDateString() === today).length,
      };

      if (status && status !== "all") {
        orders = orders.filter((o) => o.status === status);
      }
      if (search) {
        orders = orders.filter(
          (o) =>
            String(o.orderId || "").toLowerCase().includes(search) ||
            String(o.email || "").toLowerCase().includes(search) ||
            String(o.fullname || "").toLowerCase().includes(search)
        );
      }

      const total = orders.length;
      const pages = Math.ceil(total / limitNum);
      const start = (pageNum - 1) * limitNum;
      const pageOrders = orders.slice(start, start + limitNum);

      return res.status(200).json({
        success: true,
        orders: pageOrders,
        total,
        page: pageNum,
        pages,
        stats,
      });
    } catch (error) {
      console.error("Orders fetch error:", error);
      return res.status(500).json({ success: false, error: "Failed to load orders" });
    }
  }

  /* =========================
     PATCH — update order status
  ==========================*/
  if (req.method === "PATCH") {
    try {
      const body = req.body || {};
      const orderId = String(body.orderId ?? "").trim();
      const status = String(body.status ?? "").trim();

      if (!orderId || !status) {
        return res.status(400).json({ success: false, error: "orderId and status are required" });
      }
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        });
      }

      const raw = await redis.get(`order:${orderId}`);
      if (!raw) return res.status(404).json({ success: false, error: "Order not found" });

      let order;
      try { order = JSON.parse(raw); } catch {
        return res.status(500).json({ success: false, error: "Stored order is corrupted" });
      }

      order.status = status;
      order.updatedAt = new Date().toISOString();
      await redis.set(`order:${orderId}`, JSON.stringify(order));

      console.log(`[orders/PATCH] Order ${orderId} status updated to "${status}"`);
      return res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Order update error:", error);
      return res.status(500).json({ success: false, error: "Failed to update order" });
    }
  }

  /* =========================
     DELETE — remove an order
  ==========================*/
  if (req.method === "DELETE") {
    try {
      const body = req.body || {};
      const orderId = String(body.orderId ?? "").trim();
      if (!orderId) return res.status(400).json({ success: false, error: "orderId is required" });

      const raw = await redis.get(`order:${orderId}`);
      if (!raw) return res.status(404).json({ success: false, error: "Order not found" });

      let order = null;
      try { order = JSON.parse(raw); } catch { /* still delete */ }

      const deleted = await redis.del(`order:${orderId}`);
      if (!deleted) return res.status(500).json({ success: false, error: "Failed to delete order" });

      await removeFromCustomerIndex(redis, order);

      console.log(`[orders/DELETE] Order ${orderId} deleted`);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Order delete error:", error);
      return res.status(500).json({ success: false, error: "Failed to delete order" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
