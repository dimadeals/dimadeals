import { getRedis } from "./redis.js";

const VALID_CATEGORIES = [
  "netflix", "spotify", "canva", "shahid", "capcut", "console", "mobile",
  "programming", "design", "business", "software", "steam", "epic_games",
  "ea_games", "xbox_pc", "pc"
];

const VALID_MAIN_CATEGORIES = ["Subscriptions", "Games", "Courses", "Apps"];

const CATEGORY_TO_MAIN = {
  netflix:     ["Subscriptions"],
  spotify:     ["Subscriptions"],
  canva:       ["Subscriptions"],
  shahid:      ["Subscriptions"],
  capcut:      ["Subscriptions"],
  pc:          ["Games"],
  console:     ["Games"],
  mobile:      ["Games"],
  steam:       ["Games"],
  epic_games:  ["Games"],
  ea_games:    ["Games"],
  xbox_pc:     ["Games"],
  programming: ["Courses"],
  design:      ["Courses"],
  business:    ["Courses"],
  software:    ["Apps"],
};

function deriveMainCategories(category) {
  return CATEGORY_TO_MAIN[category] || [];
}

function validateProduct(prod) {
  if (!prod.name || typeof prod.name !== "string" || prod.name.trim().length === 0)
    return "Product name is required";
  if (!prod.category || typeof prod.category !== "string" || prod.category.trim().length === 0)
    return "Category is required";
  if (typeof prod.price !== "number" || prod.price < 0)
    return "Price must be a non-negative number";
  if (!prod.description || typeof prod.description !== "string")
    return "Description is required";
  if (prod.rating !== undefined && (typeof prod.rating !== "number" || prod.rating < 0 || prod.rating > 5))
    return "Rating must be between 0 and 5";
  if (!Array.isArray(prod.mainCategories) || prod.mainCategories.length === 0)
    return "At least one main category is required";
  for (const mc of prod.mainCategories) {
    if (!VALID_MAIN_CATEGORIES.includes(mc))
      return `Invalid main category: ${mc}. Must be one of: ${VALID_MAIN_CATEGORIES.join(", ")}`;
  }
  return null;
}

export default async function handler(req, res) {
  // CORS — must be explicitly configured in production (no wildcard fallback)
  const corsOrigin = process.env.ADMIN_ORIGIN;
  if (corsOrigin) {
    res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  }
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
      let cursor = "0";
      do {
        const result = await redis.scan(cursor, {
          MATCH: "product:*",
          COUNT: 100
        });

        cursor = String(result.cursor || "0");
        allKeys.push(...result.keys);

      } while (cursor !== "0");

      if (allKeys.length === 0) {
        return res.status(200).json({ success: true, products: [] });
      }

      let products = await redis.mGet(allKeys);
      products = products
        .filter(Boolean)
        .map(item => {
          try { return JSON.parse(item); }
          catch { return null; }
        })
        .filter(Boolean)
        .map(p => {
          // Auto-fill mainCategories for legacy products
          if (!Array.isArray(p.mainCategories) || p.mainCategories.length === 0) {
            p.mainCategories = deriveMainCategories(p.category);
          }
          return p;
        });

      if (category) {
        products = products.filter(p => p.category === category);
      }

      return res.status(200).json({ success: true, products });
    } catch (error) {
      console.error("Products fetch error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  }

  // Auth check for write operations
  const adminKey = req.headers["authorization"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  /* =========================
     POST — create product
  ==========================*/

  if (req.method === "POST") {
    try {
      const { id, name, price, description, category, images, rating, popular, recommended, originalPrice, inStock, mainCategories } = req.body;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Valid numeric product ID is required" });
      }

      const catValue = String(category).toLowerCase();
      const resolvedMainCategories = Array.isArray(mainCategories) && mainCategories.length > 0
        ? mainCategories.filter(mc => VALID_MAIN_CATEGORIES.includes(mc))
        : deriveMainCategories(catValue);

      const product = {
        id: parseInt(id),
        name: String(name).trim().substring(0, 200),
        price: Number(price),
        description: String(description).trim().substring(0, 500),
        category: catValue,
        mainCategories: resolvedMainCategories.length > 0 ? resolvedMainCategories : deriveMainCategories(catValue),
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
      const { id, name, price, description, category, images, rating, popular, recommended, originalPrice, inStock, mainCategories } = req.body;

      if (!id) return res.status(400).json({ error: "Product ID is required" });

      const raw = await redis.get(`product:${id}`);
      if (!raw) return res.status(404).json({ error: "Product not found" });

      const existing = JSON.parse(raw);

      // Resolve mainCategories: use provided array, or re-derive from category if category changed
      let resolvedMainCategories = existing.mainCategories || [];
      if (mainCategories !== undefined) {
        resolvedMainCategories = Array.isArray(mainCategories)
          ? mainCategories.filter(mc => VALID_MAIN_CATEGORIES.includes(mc))
          : [];
      }
      if (category !== undefined && mainCategories === undefined) {
        resolvedMainCategories = deriveMainCategories(String(category).toLowerCase());
      }
      // Fallback: ensure at least auto-derived
      if (resolvedMainCategories.length === 0) {
        const cat = category !== undefined ? String(category).toLowerCase() : existing.category;
        resolvedMainCategories = deriveMainCategories(cat);
      }

      const updated = {
        ...existing,
        ...(name !== undefined && { name: String(name).trim().substring(0, 200) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(description !== undefined && { description: String(description).trim().substring(0, 500) }),
        ...(category !== undefined && { category: String(category).toLowerCase() }),
        mainCategories: resolvedMainCategories,
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
      const { id } = req.query; // Extract ID from URL query

      if (!id) return res.status(400).json({ error: "Product ID is required" });

      const productKey = `product:${id}`;
      const productExists = await redis.exists(productKey);

      if (!productExists) {
        return res.status(404).json({ error: "Product not found" });
      }

      const deleted = await redis.del(productKey);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete product" });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Product delete error:", error);
      return res.status(500).json({ error: "Failed to delete product" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
