import { getRedis } from "./redis.js";

const VALID_CATEGORIES = [
  "netflix", "spotify", "canva", "shahid", "capcut", "console", "mobile",
  "programming", "design", "business", "software", "steam", "epic_games",
  "ea_games", "xbox_pc", "pc"
];

function validateProduct(prod) {
  if (!prod.name || typeof prod.name !== "string" || prod.name.trim().length === 0)
    return "Product name is required";
  if (!prod.category || !VALID_CATEGORIES.includes(prod.category))
    return `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`;
  if (typeof prod.price !== "number" || prod.price < 0)
    return "Price must be a non-negative number";
  if (!prod.description || typeof prod.description !== "string")
    return "Description is required";
  if (prod.rating !== undefined && (typeof prod.rating !== "number" || prod.rating < 0 || prod.rating > 5))
    return "Rating must be between 0 and 5";
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ADMIN_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const redis = await getRedis();

  /* =========================
     GET — list all products
  ==========================*/
  if (req.method === "GET") {
    try {
      const { category } = req.query;

      const allKeys = [];
      let cursor = 0;
      do {
        const result = await redis.scan(cursor, { MATCH: "product:*", COUNT: 100 });
        cursor = result.cursor;
        allKeys.push(...result.keys);
      } while (cursor !== 0);

      if (allKeys.length === 0) {
        return res.status(200).json({ success: true, products: [] });
      }

      let products = await redis.mGet(allKeys);
      products = products
        .map(item => { try { return JSON.parse(item); } catch { return null; } })
        .filter(Boolean);

      if (category && VALID_CATEGORIES.includes(category)) {
        products = products.filter(p => p.category === category);
      }

      return res.status(200).json({ success: true, products });
    } catch (error) {
      console.error("Products fetch error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  }

  // Auth check for write operations
  const adminKey = req.headers.authorization;
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  /* =========================
     POST — create product
  ==========================*/
  if (req.method === "POST") {
    try {
      const { id, name, price, description, category, images, rating, popular, recommended, originalPrice, inStock } = req.body;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Valid numeric product ID is required" });
      }

      const product = {
        id: parseInt(id),
        name: String(name).trim().substring(0, 200),
        price: Number(price),
        description: String(description).trim().substring(0, 500),
        category: String(category).toLowerCase(),
        images:   Array.isArray(images) ? images.filter(img => typeof img === "string").slice(0, 10) : [],
        rating:   typeof rating === "number" ? Math.min(5, Math.max(0, rating)) : 0,
        popular:  Boolean(popular),
        recommended: Boolean(recommended),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        inStock:  inStock !== false
      };

      const err = validateProduct(product);
      if (err) return res.status(400).json({ error: err });

      // Check if product already exists
      const existing = await redis.get(`product:${product.id}`);
      if (existing) return res.status(409).json({ error: "Product with this ID already exists" });

      await redis.set(`product:${product.id}`, JSON.stringify(product));

      return res.status(201).json({ success: true, product });
    } catch (error) {
      console.error("Product create error:", error);
      return res.status(500).json({ error: "Failed to create product" });
    }
  }

  /* =========================
     PUT — update product
  ==========================*/
  if (req.method === "PUT") {
    try {
      const { id, name, price, description, category, images, rating, popular, recommended, originalPrice, inStock } = req.body;

      if (!id) return res.status(400).json({ error: "Product ID is required" });

      const raw = await redis.get(`product:${id}`);
      if (!raw) return res.status(404).json({ error: "Product not found" });

      const existing = JSON.parse(raw);
      const updated = {
        ...existing,
        ...(name !== undefined && { name: String(name).trim().substring(0, 200) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(description !== undefined && { description: String(description).trim().substring(0, 500) }),
        ...(category !== undefined && { category: String(category).toLowerCase() }),
        ...(images !== undefined && { images: Array.isArray(images) ? images.filter(img => typeof img === "string").slice(0, 10) : [] }),
        ...(rating !== undefined && { rating: Math.min(5, Math.max(0, Number(rating))) }),
        ...(popular !== undefined && { popular: Boolean(popular) }),
        ...(recommended !== undefined && { recommended: Boolean(recommended) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number(originalPrice) : undefined }),
        ...(inStock !== undefined && { inStock: Boolean(inStock) })
      };

      const err = validateProduct(updated);
      if (err) return res.status(400).json({ error: err });

      await redis.set(`product:${id}`, JSON.stringify(updated));

      return res.status(200).json({ success: true, product: updated });
    } catch (error) {
      console.error("Product update error:", error);
      return res.status(500).json({ error: "Failed to update product" });
    }
  }

  /* =========================
     DELETE — remove product
  ==========================*/
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) return res.status(400).json({ error: "Product ID is required" });

      const deleted = await redis.del(`product:${id}`);
      if (!deleted) return res.status(404).json({ error: "Product not found" });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Product delete error:", error);
      return res.status(500).json({ error: "Failed to delete product" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
