import { getRedis, SEED_CATEGORIES, ensureSeeded, isAdminRequest } from "./redis.js";

const CATEGORIES_KEY = "config:categories";

function setCommonHeaders(res) {
  const corsOrigin = process.env.ADMIN_ORIGIN;
  if (corsOrigin) res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");
}

function validateMainCategory(name) {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return "Main category name is required";
  }
  if (name.trim().length > 50) return "Main category name is too long";
  return null;
}

function slugifySubcategory(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

function normalizeCategories(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((entry) => entry && typeof entry.mainCategory === "string")
    .map((entry) => ({
      mainCategory: entry.mainCategory.trim(),
      subcategories: Array.isArray(entry.subcategories)
        ? [...new Set(entry.subcategories.filter((s) => typeof s === "string" && s.trim()))]
        : [],
    }))
    .filter((entry) => entry.mainCategory.length > 0);
}

async function getCategoriesFromRedis(redis) {
  try {
    const raw = await redis.get(CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // An explicitly empty array is respected (the owner removed everything).
      if (Array.isArray(parsed)) return normalizeCategories(parsed);
    }
  } catch (error) {
    console.error("Error reading categories from Redis:", error);
  }
  return SEED_CATEGORIES.map((entry) => ({ ...entry, subcategories: [...entry.subcategories] }));
}

async function saveCategories(redis, categories) {
  const cleaned = normalizeCategories(categories);
  await redis.set(CATEGORIES_KEY, JSON.stringify(cleaned));
  return cleaned;
}

/**
 * Keep products in sync when a subcategory is renamed or moved. Without this,
 * products keep pointing at the old slug and disappear from browse pages.
 * A pure move keeps the same slug but still needs its mainCategories updated.
 */
async function reassignProducts(redis, oldCategory, newCategory, mainCategories) {
  if (!oldCategory || !newCategory) return 0;

  const keys = [];
  let cursor = "0";
  do {
    const result = await redis.scan(cursor, { MATCH: "product:*", COUNT: 100 });
    cursor = String(result.cursor || "0");
    keys.push(...result.keys);
  } while (cursor !== "0");

  if (keys.length === 0) return 0;

  const values = await redis.mGet(keys);
  const nextMainCategories = Array.isArray(mainCategories) ? mainCategories : [];

  let updated = 0;

  for (let i = 0; i < keys.length; i += 1) {
    if (!values[i]) continue;
    let product;
    try { product = JSON.parse(values[i]); } catch { continue; }
    if (!product || product.category !== oldCategory) continue;

    const currentMainCategories = Array.isArray(product.mainCategories) ? product.mainCategories : [];
    const mainsChanged = nextMainCategories.length > 0
      && (currentMainCategories.length !== nextMainCategories.length
        || currentMainCategories.some((mc, index) => mc !== nextMainCategories[index]));

    if (product.category === newCategory && !mainsChanged) continue;

    product.category = newCategory;
    if (nextMainCategories.length > 0) product.mainCategories = [...nextMainCategories];
    product.updatedAt = new Date().toISOString();
    await redis.set(keys[i], JSON.stringify(product));
    updated += 1;
  }

  return updated;
}

async function countProductsInCategory(redis, category) {
  const keys = [];
  let cursor = "0";
  do {
    const result = await redis.scan(cursor, { MATCH: "product:*", COUNT: 100 });
    cursor = String(result.cursor || "0");
    keys.push(...result.keys);
  } while (cursor !== "0");

  if (keys.length === 0) return 0;

  const values = await redis.mGet(keys);
  let count = 0;
  for (const raw of values) {
    if (!raw) continue;
    try {
      const product = JSON.parse(raw);
      if (product && product.category === category) count += 1;
    } catch { /* ignore corrupted entries */ }
  }
  return count;
}

export default async function handler(req, res) {
  setCommonHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  let redis;
  try {
    redis = await getRedis();
  } catch (error) {
    console.error("[categories] Store unavailable:", error);
    return res.status(503).json({ success: false, error: "Category store is unavailable" });
  }

  /* =========================
     GET — list all categories
  ==========================*/
  if (req.method === "GET") {
    try {
      await ensureSeeded(redis);
      const categories = await getCategoriesFromRedis(redis);
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      console.error("Categories fetch error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch categories" });
    }
  }

  // Auth check for write operations
  if (!isAdminRequest(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  /* =========================
     POST — add main category or subcategory
  ==========================*/
  if (req.method === "POST") {
    try {
      await ensureSeeded(redis);
      const body = req.body || {};
      const mainCategory = String(body.mainCategory ?? "").trim();
      const rawSubcategory = body.subcategory;

      const mainError = validateMainCategory(mainCategory);
      if (mainError) return res.status(400).json({ success: false, error: mainError });

      const categories = await getCategoriesFromRedis(redis);
      let mainCat = categories.find((c) => c.mainCategory.toLowerCase() === mainCategory.toLowerCase());

      // Creating an empty main category is allowed; subcategories can be added later.
      if (rawSubcategory === undefined || rawSubcategory === null || String(rawSubcategory).trim() === "") {
        if (mainCat) {
          return res.status(409).json({ success: false, error: "This main category already exists" });
        }
        categories.push({ mainCategory, subcategories: [] });
        const saved = await saveCategories(redis, categories);
        return res.status(201).json({ success: true, categories: saved });
      }

      const subcategory = slugifySubcategory(rawSubcategory);
      if (!subcategory) {
        return res.status(400).json({ success: false, error: "Subcategory name is required" });
      }

      if (!mainCat) {
        mainCat = { mainCategory, subcategories: [] };
        categories.push(mainCat);
      }

      if (mainCat.subcategories.includes(subcategory)) {
        return res.status(409).json({ success: false, error: "This subcategory already exists in this category" });
      }

      mainCat.subcategories.push(subcategory);
      const saved = await saveCategories(redis, categories);
      return res.status(201).json({ success: true, categories: saved });
    } catch (error) {
      console.error("Category create error:", error);
      return res.status(500).json({ success: false, error: "Failed to add category" });
    }
  }

  /* =========================
     PUT — rename or move a subcategory
  ==========================*/
  if (req.method === "PUT") {
    try {
      await ensureSeeded(redis);
      const body = req.body || {};
      const mainCategory = String(body.mainCategory ?? "").trim();
      const oldSubcategory = slugifySubcategory(body.oldSubcategory);
      const newMainCategory = body.newMainCategory ? String(body.newMainCategory).trim() : "";
      const newSubcategory = body.newSubcategory ? slugifySubcategory(body.newSubcategory) : "";

      const mainError = validateMainCategory(mainCategory);
      if (mainError) return res.status(400).json({ success: false, error: mainError });
      if (!oldSubcategory) {
        return res.status(400).json({ success: false, error: "Old subcategory is required" });
      }
      if (!newSubcategory && !newMainCategory) {
        return res.status(400).json({ success: false, error: "Provide a new name or a new main category" });
      }
      if (newMainCategory) {
        const targetError = validateMainCategory(newMainCategory);
        if (targetError) return res.status(400).json({ success: false, error: targetError });
      }

      const categories = await getCategoriesFromRedis(redis);
      const source = categories.find((c) => c.mainCategory === mainCategory);
      if (!source) return res.status(404).json({ success: false, error: "Main category not found" });

      const sourceIndex = source.subcategories.indexOf(oldSubcategory);
      if (sourceIndex === -1) {
        return res.status(404).json({ success: false, error: "Subcategory not found in this main category" });
      }

      const targetName = newMainCategory || mainCategory;
      const finalSubcategory = newSubcategory || oldSubcategory;
      const isMove = targetName !== mainCategory;

      if (!isMove) {
        if (finalSubcategory !== oldSubcategory) {
          if (source.subcategories.includes(finalSubcategory)) {
            return res.status(409).json({ success: false, error: "This subcategory already exists" });
          }
          source.subcategories[sourceIndex] = finalSubcategory;
        }
      } else {
        let target = categories.find((c) => c.mainCategory === targetName);
        if (!target) {
          target = { mainCategory: targetName, subcategories: [] };
          categories.push(target);
        }
        if (target.subcategories.includes(finalSubcategory)) {
          return res.status(409).json({ success: false, error: "This subcategory already exists in the target category" });
        }
        source.subcategories.splice(sourceIndex, 1);
        target.subcategories.push(finalSubcategory);
      }

      // Drop main categories that no longer contain anything.
      const cleaned = categories.filter((c) => c.subcategories.length > 0);
      const saved = await saveCategories(redis, cleaned);

      // Best-effort product migration. If it fails we still return success for
      // the rename, with a warning, instead of pretending nothing happened.
      let productsUpdated = 0;
      let warning;
      try {
        productsUpdated = await reassignProducts(
          redis,
          oldSubcategory,
          finalSubcategory,
          [targetName]
        );
      } catch (migrationError) {
        console.error("Category product migration error:", migrationError);
        warning = "The category was updated, but some products could not be migrated. Please review the affected products.";
      }

      return res.status(200).json({ success: true, categories: saved, productsUpdated, warning });
    } catch (error) {
      console.error("Category update error:", error);
      return res.status(500).json({ success: false, error: "Failed to update category" });
    }
  }

  /* =========================
     DELETE — remove subcategory
  ==========================*/
  if (req.method === "DELETE") {
    try {
      await ensureSeeded(redis);
      const mainCategory = String(req.query?.mainCategory ?? "").trim();
      const subcategory = slugifySubcategory(req.query?.subcategory);

      const mainError = validateMainCategory(mainCategory);
      if (mainError) return res.status(400).json({ success: false, error: mainError });
      if (!subcategory) return res.status(400).json({ success: false, error: "Subcategory is required" });

      const categories = await getCategoriesFromRedis(redis);
      const mainCat = categories.find((c) => c.mainCategory === mainCategory);
      if (!mainCat) return res.status(404).json({ success: false, error: "Main category not found" });

      const index = mainCat.subcategories.indexOf(subcategory);
      if (index === -1) return res.status(404).json({ success: false, error: "Subcategory not found" });

      // Refuse to orphan products. The admin message used to claim this was
      // safe, which left products pointing at a category that no longer exists.
      const productCount = await countProductsInCategory(redis, subcategory);
      if (productCount > 0) {
        return res.status(409).json({
          success: false,
          error: `This category is used by ${productCount} product(s). Move or delete those products first.`,
          productsUsingCategory: productCount,
        });
      }

      mainCat.subcategories.splice(index, 1);
      const filtered = categories.filter((c) => c.subcategories.length > 0);
      const saved = await saveCategories(redis, filtered);

      return res.status(200).json({ success: true, categories: saved });
    } catch (error) {
      console.error("Category delete error:", error);
      return res.status(500).json({ success: false, error: "Failed to delete category" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
