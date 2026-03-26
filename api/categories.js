import { getRedis } from "./redis.js";

const CATEGORIES_KEY = "config:categories";

// Default categories if none exist
const DEFAULT_CATEGORIES = [
  {
    mainCategory: "Subscriptions",
    subcategories: ["netflix", "spotify", "canva", "shahid", "capcut"]
  },
  {
    mainCategory: "Games",
    subcategories: ["pc", "console", "mobile", "steam", "epic_games", "ea_games", "xbox_pc"]
  },
  {
    mainCategory: "Courses",
    subcategories: ["programming", "design", "business"]
  },
  {
    mainCategory: "Apps",
    subcategories: ["mobile-apps", "software"]
  }
];

function validateMainCategory(name) {
  if (!name || typeof name !== "string" || name.trim().length === 0)
    return "Main category name is required";
  return null;
}

function validateSubcategories(subs) {
  if (!Array.isArray(subs))
    return "Subcategories must be an array";
  if (subs.length === 0)
    return "At least one subcategory is required";
  for (const sub of subs) {
    if (!sub || typeof sub !== "string" || sub.trim().length === 0)
      return "All subcategories must be non-empty strings";
  }
  return null;
}

async function getCategoriesFromRedis(redis) {
  try {
    const raw = await redis.get(CATEGORIES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading categories from Redis:", e);
  }
  return DEFAULT_CATEGORIES;
}

export default async function handler(req, res) {
  // CORS
  const corsOrigin = process.env.ADMIN_ORIGIN;
  if (corsOrigin) {
    res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const redis = await getRedis();

  /* =========================
     GET — list all categories
  ==========================*/
  if (req.method === "GET") {
    try {
      const categories = await getCategoriesFromRedis(redis);
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      console.error("Categories fetch error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch categories" });
    }
  }

  // Auth check for write operations
  const adminKey = req.headers["authorization"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  /* =========================
     POST — add subcategory to main category
  ==========================*/
  if (req.method === "POST") {
    try {
      const { mainCategory, subcategory } = req.body;

      const err1 = validateMainCategory(mainCategory);
      if (err1) return res.status(400).json({ error: err1 });

      if (!subcategory || typeof subcategory !== "string" || subcategory.trim().length === 0)
        return res.status(400).json({ error: "Subcategory name is required" });

      const categories = await getCategoriesFromRedis(redis);

      // Find or create main category
      let mainCat = categories.find(c => c.mainCategory === mainCategory);
      if (!mainCat) {
        mainCat = {
          mainCategory: mainCategory,
          subcategories: []
        };
        categories.push(mainCat);
      }

      // Check if subcategory already exists
      const subcatNorm = subcategory.trim().toLowerCase().replace(/\s+/g, "-");
      if (mainCat.subcategories.includes(subcatNorm)) {
        return res.status(409).json({ error: "This subcategory already exists in this category" });
      }

      mainCat.subcategories.push(subcatNorm);

      await redis.set(CATEGORIES_KEY, JSON.stringify(categories));

      return res.status(201).json({ success: true, categories });
    } catch (error) {
      console.error("Category create error:", error);
      return res.status(500).json({ error: "Failed to add subcategory" });
    }
  }

  /* =========================
     PUT — update subcategory or move between main categories
  ==========================*/
  if (req.method === "PUT") {
    try {
      const { mainCategory, oldSubcategory, newSubcategory, newMainCategory } = req.body;

      const err1 = validateMainCategory(mainCategory);
      if (err1) return res.status(400).json({ error: err1 });
      if (!oldSubcategory || typeof oldSubcategory !== "string")
        return res.status(400).json({ error: "Old subcategory is required" });

      const categories = await getCategoriesFromRedis(redis);
      const mainCat = categories.find(c => c.mainCategory === mainCategory);

      if (!mainCat) {
        return res.status(404).json({ error: "Main category not found" });
      }

      const idx = mainCat.subcategories.indexOf(oldSubcategory);
      if (idx === -1) {
        return res.status(404).json({ error: "Subcategory not found in this main category" });
      }

      // If renaming subcategory
      if (newSubcategory && newSubcategory !== oldSubcategory) {
        if (!newSubcategory || typeof newSubcategory !== "string" || newSubcategory.trim().length === 0)
          return res.status(400).json({ error: "New subcategory name is required" });

        const newSubcatNorm = newSubcategory.trim().toLowerCase().replace(/\s+/g, "-");
        if (mainCat.subcategories.includes(newSubcatNorm)) {
          return res.status(409).json({ error: "This subcategory already exists" });
        }
        mainCat.subcategories[idx] = newSubcatNorm;
      }

      // If moving to different main category
      if (newMainCategory && newMainCategory !== mainCategory) {
        const err2 = validateMainCategory(newMainCategory);
        if (err2) return res.status(400).json({ error: err2 });

        mainCat.subcategories.splice(idx, 1);

        let newMainCat = categories.find(c => c.mainCategory === newMainCategory);
        if (!newMainCat) {
          newMainCat = {
            mainCategory: newMainCategory,
            subcategories: []
          };
          categories.push(newMainCat);
        }

        if (newMainCat.subcategories.includes(oldSubcategory)) {
          return res.status(409).json({ error: "This subcategory already exists in the target category" });
        }
        newMainCat.subcategories.push(oldSubcategory);
      }

      await redis.set(CATEGORIES_KEY, JSON.stringify(categories));
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      console.error("Category update error:", error);
      return res.status(500).json({ error: "Failed to update category" });
    }
  }

  /* =========================
     DELETE — remove subcategory
  ==========================*/
  if (req.method === "DELETE") {
    try {
      const { mainCategory, subcategory } = req.query;

      const err1 = validateMainCategory(mainCategory);
      if (err1) return res.status(400).json({ error: err1 });
      if (!subcategory)
        return res.status(400).json({ error: "Subcategory is required" });

      const categories = await getCategoriesFromRedis(redis);
      const mainCat = categories.find(c => c.mainCategory === mainCategory);

      if (!mainCat) {
        return res.status(404).json({ error: "Main category not found" });
      }

      const idx = mainCat.subcategories.indexOf(subcategory);
      if (idx === -1) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      mainCat.subcategories.splice(idx, 1);

      // Remove empty main categories
      const filtered = categories.filter(c => c.subcategories.length > 0);

      await redis.set(CATEGORIES_KEY, JSON.stringify(filtered));
      return res.status(200).json({ success: true, categories: filtered });
    } catch (error) {
      console.error("Category delete error:", error);
      return res.status(500).json({ error: "Failed to delete category" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
