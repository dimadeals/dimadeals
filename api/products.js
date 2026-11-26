import { getRedis, deriveMainCategories, ensureSeeded, isValidCategorySlug, isAdminRequest } from "./redis.js";

const MAX_PRICE = 10_000_000;
const MAX_MAIN_CATEGORIES = 8;

function normalizeMainCategories(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .filter((mc) => typeof mc === "string")
      .map((mc) => mc.trim().substring(0, 50))
      .filter(Boolean)
  )].slice(0, MAX_MAIN_CATEGORIES);
}

function setCommonHeaders(res) {
  const corsOrigin = process.env.ADMIN_ORIGIN;
  if (corsOrigin) res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .filter((img) => typeof img === "string")
    .map((img) => img.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") return null;

  const idNumber = Number(product.id);
  // Reject phantom keys: a product whose stored id is not a positive integer
  // cannot be addressed by the admin (PUT/DELETE use product:<int>).
  if (!Number.isInteger(idNumber) || idNumber <= 0 || idNumber > 1_000_000_000) return null;
  const id = idNumber;
  const priceNumber = Number(product.price);
  const price = Number.isFinite(priceNumber) && priceNumber >= 0 ? priceNumber : 0;
  const ratingNumber = Number(product.rating);
  const category = typeof product.category === "string" ? product.category.toLowerCase() : "";

  let mainCategories = normalizeMainCategories(product.mainCategories);
  if (mainCategories.length === 0) mainCategories = deriveMainCategories(category);

  return {
    ...product,
    id,
    name: String(product.name ?? ""),
    price,
    originalPrice:
      Number.isFinite(Number(product.originalPrice)) && Number(product.originalPrice) > price
        ? Number(product.originalPrice)
        : undefined,
    description: String(product.description ?? ""),
    category,
    mainCategories,
    images: normalizeImages(product.images),
    rating: Number.isFinite(ratingNumber) ? Math.min(5, Math.max(0, ratingNumber)) : 0,
    popular: Boolean(product.popular),
    recommended: Boolean(product.recommended),
    inStock: product.inStock !== false,
  };
}

async function resolveMainCategories(redis, category) {
  const direct = deriveMainCategories(category);
  if (direct.length > 0) return direct;

  // Custom subcategories added from the admin dashboard are stored in config.
  try {
    const raw = await redis.get("config:categories");
    if (raw) {
      const categories = JSON.parse(raw);
      if (Array.isArray(categories)) {
        const match = categories.find(
          (entry) => Array.isArray(entry.subcategories) && entry.subcategories.includes(category)
        );
        if (match && match.mainCategory) {
          return [match.mainCategory];
        }
      }
    }
  } catch (error) {
    console.error("[products] Could not read category config:", error);
  }
  return [];
}

function validateProduct(product) {
  if (!product.name || product.name.trim().length === 0) return "Product name is required";
  if (product.name.length > 200) return "Product name must be 200 characters or fewer";
  if (!product.category || !isValidCategorySlug(product.category)) return "A valid category is required";
  if (!Number.isFinite(product.price) || product.price < 0) return "Price must be a non-negative number";
  if (product.price > MAX_PRICE) return "Price is too large";
  if (!product.description || product.description.trim().length === 0) return "Description is required";
  if (product.description.length > 2000) return "Description must be 2000 characters or fewer";
  if (typeof product.rating !== "number" || product.rating < 0 || product.rating > 5) {
    return "Rating must be between 0 and 5";
  }
  if (!Array.isArray(product.mainCategories) || product.mainCategories.length === 0) {
    return "At least one main category is required (check the product category)";
  }
  for (const mc of product.mainCategories) {
    if (typeof mc !== "string" || mc.trim().length === 0 || mc.length > 50) {
      return "Main categories must be non-empty names of 50 characters or fewer";
    }
  }
  return null;
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 && id <= 1_000_000_000 ? id : null;
}

export default async function handler(req, res) {
  setCommonHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  let redis;
  try {
    redis = await getRedis();
  } catch (error) {
    console.error("[products] Store unavailable:", error);
    return res.status(503).json({ success: false, error: "Product store is unavailable" });
  }

  /* =========================
     GET — list all products
  ==========================*/
  if (req.method === "GET") {
    try {
      await ensureSeeded(redis);

      const category = req.query?.category ? String(req.query.category).toLowerCase() : "";

      const allKeys = [];
      let cursor = "0";
      do {
        const result = await redis.scan(cursor, { MATCH: "product:*", COUNT: 100 });
        cursor = String(result.cursor || "0");
        allKeys.push(...result.keys);
      } while (cursor !== "0");

      if (allKeys.length === 0) {
        return res.status(200).json({ success: true, products: [] });
      }

      const raw = await redis.mGet(allKeys);
      let products = raw
        .filter(Boolean)
        .map((item) => {
          try { return JSON.parse(item); } catch { return null; }
        })
        .map(normalizeProduct)
        .filter(Boolean);

      if (category) products = products.filter((p) => p.category === category);

      // Stable ordering: newest IDs last, useful for "next ID" and admin.
      products.sort((a, b) => Number(a.id) - Number(b.id));

      return res.status(200).json({ success: true, products });
    } catch (error) {
      console.error("Products fetch error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  }

  // Auth check for write operations
  if (!isAdminRequest(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  /* =========================
     POST — create product
  ==========================*/
  if (req.method === "POST") {
    try {
      await ensureSeeded(redis);
      const body = req.body || {};

      const id = parseId(body.id);
      if (!id) return res.status(400).json({ success: false, error: "Valid numeric product ID is required" });

      const category = String(body.category ?? "").toLowerCase().trim();
      if (!isValidCategorySlug(category)) {
        return res.status(400).json({ success: false, error: "A valid category is required" });
      }

      const mainCategories = normalizeMainCategories(body.mainCategories);
      const resolvedMainCategories = mainCategories.length > 0
        ? mainCategories
        : await resolveMainCategories(redis, category);

      const product = normalizeProduct({
        id,
        name: String(body.name ?? "").trim().substring(0, 200),
        price: Number(body.price),
        description: String(body.description ?? "").trim().substring(0, 2000),
        category,
        mainCategories: resolvedMainCategories,
        images: body.images,
        rating: body.rating === undefined ? 0 : Number(body.rating),
        popular: body.popular,
        recommended: body.recommended,
        originalPrice: body.originalPrice,
        inStock: body.inStock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const err = validateProduct(product);
      if (err) return res.status(400).json({ success: false, error: err });

      if (await redis.exists(`product:${product.id}`)) {
        return res.status(409).json({ success: false, error: "Product with this ID already exists" });
      }

      await redis.set(`product:${product.id}`, JSON.stringify(product));
      return res.status(201).json({ success: true, product });
    } catch (error) {
      console.error("Product create error:", error);
      return res.status(500).json({ success: false, error: "Failed to create product" });
    }
  }

  /* =========================
     PUT — update product
  ==========================*/
  if (req.method === "PUT") {
    try {
      await ensureSeeded(redis);
      const body = req.body || {};
      const id = parseId(body.id);
      if (!id) return res.status(400).json({ success: false, error: "Product ID is required" });

      const raw = await redis.get(`product:${id}`);
      if (!raw) return res.status(404).json({ success: false, error: "Product not found" });

      let existing;
      try { existing = JSON.parse(raw); } catch {
        return res.status(500).json({ success: false, error: "Stored product is corrupted" });
      }

      const category = body.category !== undefined
        ? String(body.category).toLowerCase().trim()
        : existing.category;

      if (!isValidCategorySlug(category)) {
        return res.status(400).json({ success: false, error: "A valid category is required" });
      }

      let mainCategories;
      if (Array.isArray(body.mainCategories)) {
        mainCategories = normalizeMainCategories(body.mainCategories);
      } else if (body.category !== undefined) {
        mainCategories = await resolveMainCategories(redis, category);
      } else {
        mainCategories = normalizeMainCategories(existing.mainCategories);
      }
      if (!Array.isArray(mainCategories) || mainCategories.length === 0) {
        mainCategories = await resolveMainCategories(redis, category);
      }

      const updated = normalizeProduct({
        ...existing,
        ...(body.name !== undefined && { name: String(body.name).trim().substring(0, 200) }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.description !== undefined && { description: String(body.description).trim().substring(0, 2000) }),
        category,
        mainCategories,
        ...(body.images !== undefined && { images: body.images }),
        ...(body.rating !== undefined && { rating: Number(body.rating) }),
        ...(body.popular !== undefined && { popular: Boolean(body.popular) }),
        ...(body.recommended !== undefined && { recommended: Boolean(body.recommended) }),
        ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice }),
        ...(body.inStock !== undefined && { inStock: body.inStock !== false }),
        updatedAt: new Date().toISOString(),
      });

      const err = validateProduct(updated);
      if (err) return res.status(400).json({ success: false, error: err });

      await redis.set(`product:${id}`, JSON.stringify(updated));
      return res.status(200).json({ success: true, product: updated });
    } catch (error) {
      console.error("Product update error:", error);
      return res.status(500).json({ success: false, error: "Failed to update product" });
    }
  }

  /* =========================
     DELETE — remove product
  ==========================*/
  if (req.method === "DELETE") {
    try {
      const id = parseId(req.query?.id);
      if (!id) return res.status(400).json({ success: false, error: "Product ID is required" });

      const productKey = `product:${id}`;
      if (!(await redis.exists(productKey))) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      const deleted = await redis.del(productKey);
      if (!deleted) return res.status(500).json({ success: false, error: "Failed to delete product" });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Product delete error:", error);
      return res.status(500).json({ success: false, error: "Failed to delete product" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
