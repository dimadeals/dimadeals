import { getRedis } from "./redis.js";

const VALID_STATUSES = ["pending", "processing", "completed", "delivered", "cancelled"];

export default async function handler(req, res) {

  // CORS — tighten to your actual domain in production
  res.setHeader("Access-Control-Allow-Origin", process.env.ADMIN_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Auth check
  const adminKey = req.headers.authorization;
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redis = await getRedis();

  /* =========================
     GET — list orders
  ==========================*/
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 50, status, search } = req.query;
      const pageNum  = Math.max(1, parseInt(page)  || 1);
      const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 50));

      // SCAN is non-blocking; use it instead of KEYS in production
      const allKeys = [];
      let cursor = 0;
      do {
        const result = await redis.scan(cursor, { MATCH: "order:*", COUNT: 200 });
        cursor = result.cursor;
        allKeys.push(...result.keys);
      } while (cursor !== 0);

      if (allKeys.length === 0) {
        return res.status(200).json({
          success: true,
          orders: [],
          total: 0,
          page: pageNum,
          pages: 0,
          stats: { revenue: 0, pending: 0, completed: 0, cancelled: 0, today: 0, total: 0 }
        });
      }

      // MGET — single round-trip for all values instead of N individual GETs
      const raw = await redis.mGet(allKeys);
      let orders = raw
        .map(item => { try { return JSON.parse(item); } catch { return null; } })
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Compute stats from full dataset before filtering
      const today = new Date().toDateString();
      const stats = {
        total:     orders.length,
        revenue:   orders.reduce((s, o) => s + (o.total || 0), 0),
        pending:   orders.filter(o => o.status === "pending").length,
        completed: orders.filter(o => o.status === "completed" || o.status === "delivered").length,
        cancelled: orders.filter(o => o.status === "cancelled").length,
        today:     orders.filter(o => new Date(o.createdAt).toDateString() === today).length,
      };

      // Apply optional filters
      if (status && status !== "all") {
        orders = orders.filter(o => o.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        orders = orders.filter(o =>
          o.orderId?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q)   ||
          o.fullname?.toLowerCase().includes(q)
        );
      }

      // Paginate
      const total      = orders.length;
      const pages      = Math.ceil(total / limitNum);
      const start      = (pageNum - 1) * limitNum;
      const pageOrders = orders.slice(start, start + limitNum);

      return res.status(200).json({
        success: true,
        orders:  pageOrders,
        total,
        page:    pageNum,
        pages,
        stats
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
      const { orderId, status } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({ error: "orderId and status are required" });
      }
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`
        });
      }

      const raw = await redis.get(`order:${orderId}`);
      if (!raw) return res.status(404).json({ error: "Order not found" });

      const order       = JSON.parse(raw);
      order.status      = status;
      order.updatedAt   = new Date().toISOString();

      await redis.set(`order:${orderId}`, JSON.stringify(order), { EX: 7776000 });

      return res.status(200).json({ success: true, order });

    } catch (error) {
      console.error("Order update error:", error);
      return res.status(500).json({ error: "Failed to update order" });
    }
  }

  /* =========================
     DELETE — remove an order
  ==========================*/
  if (req.method === "DELETE") {
    try {
      const { orderId } = req.body;

      if (!orderId) return res.status(400).json({ error: "orderId is required" });

      const deleted = await redis.del(`order:${orderId}`);
      if (!deleted) return res.status(404).json({ error: "Order not found" });

      return res.status(200).json({ success: true });

    } catch (error) {
      console.error("Order delete error:", error);
      return res.status(500).json({ error: "Failed to delete order" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
