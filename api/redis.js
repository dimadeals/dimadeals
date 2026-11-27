// ============================================================================
// DIMA Deals — single data/runtime module
// ----------------------------------------------------------------------------
// This one file contains the Redis client, the local in-memory fallback, the
// admin auth check, and the starter catalog. Keeping it together avoids extra
// helper files while still being shared by every API endpoint.
// ============================================================================

import { timingSafeEqual } from "node:crypto";

// ============================================================================
// In-memory fallback store
// ----------------------------------------------------------------------------
// Implements the small subset of the node-redis v4 API used by this project.
// It lets `npm run dev` work with zero external services. Production continues
// to use Redis whenever REDIS_URL is configured.
// ============================================================================

class MemoryStore {
  constructor() {
    this.data = new Map();
    this.isOpen = true;
    this._expiry = new Map();
  }

  _now() { return Date.now(); }

  _alive(key) {
    const exp = this._expiry.get(key);
    if (exp && exp <= this._now()) {
      this.data.delete(key);
      this._expiry.delete(key);
      return false;
    }
    return true;
  }

  _match(pattern) {
    // Only the `prefix:*` patterns used by this app are supported.
    if (!pattern) return [...this.data.keys()];
    if (pattern.endsWith("*") && !pattern.slice(0, -1).includes("*")) {
      const prefix = pattern.slice(0, -1);
      return [...this.data.keys()].filter((key) => key.startsWith(prefix));
    }
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    const re = new RegExp(`^${escaped}$`);
    return [...this.data.keys()].filter((key) => re.test(key));
  }

  async get(key) {
    if (!this._alive(key)) return null;
    return this.data.has(key) ? this.data.get(key) : null;
  }

  async mGet(keys) {
    return keys.map((key) => (this._alive(key) && this.data.has(key) ? this.data.get(key) : null));
  }

  async set(key, value, options = {}) {
    this._alive(key);
    if (options && options.NX && this.data.has(key)) return null;

    this.data.set(key, String(value));
    if (options && options.EX) this._expiry.set(key, this._now() + Number(options.EX) * 1000);
    else this._expiry.delete(key);
    return "OK";
  }

  async del(key) {
    this._alive(key);
    this._expiry.delete(key);
    return this.data.delete(key) ? 1 : 0;
  }

  async exists(key) {
    return this._alive(key) && this.data.has(key) ? 1 : 0;
  }

  async scan(cursor, options = {}) {
    // The in-memory store returns everything in a single page.
    const keys = this._match(options.MATCH || "*").sort();
    return { cursor: 0, keys };
  }

  async ping() { return "PONG"; }

  async quit() { this.isOpen = false; }
}

/**
 * Constant-time check of the admin Authorization header.
 * Fails closed when ADMIN_KEY is not configured.
 */
export function isAdminRequest(req) {
  const expected = process.env.ADMIN_KEY;
  const provided = req.headers?.authorization;

  if (!expected || typeof provided !== "string") return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;

  try {
    return timingSafeEqual(providedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

// ============================================================================
// Seed catalog for DIMA Deals
// ----------------------------------------------------------------------------
// The storefront is fully data-driven (Redis in production). This file gives
// the app a complete, realistic starting catalog so a fresh deployment / local
// checkout is never empty. It is only written when the product store has no
// products and the one-time seed marker has not been set yet.
// Set AUTO_SEED=false to disable automatic seeding.
// ============================================================================

const CATEGORY_TO_MAIN = {
  netflix: ["Subscriptions"],
  spotify: ["Subscriptions"],
  canva: ["Subscriptions"],
  shahid: ["Subscriptions"],
  capcut: ["Subscriptions"],
  pc: ["Games"],
  console: ["Games"],
  mobile: ["Games"],
  steam: ["Games"],
  epic_games: ["Games"],
  ea_games: ["Games"],
  xbox_pc: ["Games"],
  programming: ["Courses"],
  design: ["Courses"],
  business: ["Courses"],
  mobile_apps: ["Apps"],
  software: ["Apps"],
};

export const SEED_CATEGORIES = [
  {
    mainCategory: "Subscriptions",
    subcategories: ["netflix", "spotify", "canva", "shahid", "capcut"],
  },
  {
    mainCategory: "Games",
    subcategories: ["pc", "console", "mobile", "steam", "epic_games", "ea_games", "xbox_pc"],
  },
  {
    mainCategory: "Courses",
    subcategories: ["programming", "design", "business"],
  },
  {
    mainCategory: "Apps",
    subcategories: ["mobile_apps", "software"],
  },
];

function p(id, name, category, price, originalPrice, description, images, rating, popular, recommended, inStock = true) {
  return {
    id,
    name,
    category,
    mainCategories: CATEGORY_TO_MAIN[category] || [],
    price,
    originalPrice: originalPrice > price ? originalPrice : undefined,
    description,
    images,
    rating,
    popular: Boolean(popular),
    recommended: Boolean(recommended),
    inStock: inStock !== false,
  };
}

export const SEED_PRODUCTS = [
  // ── Subscriptions ──────────────────────────────────────────────────────
  p(1, "Netflix Premium — 1 Month", "netflix", 25, 35,
    "Watch unlimited movies and series in 4K Ultra HD on 4 screens with a private Netflix Premium profile. Instant activation.",
    ["images/NetflixBigLogo.png", "images/NetflixLogo.png"], 4.9, true, true),
  p(2, "Netflix Premium — 3 Months", "netflix", 65, 90,
    "3 months of Netflix Premium in 4K Ultra HD. Private profile, 4 simultaneous screens, and instant delivery after payment.",
    ["images/NetflixLogo.png", "images/NetflixBigLogo.png"], 4.8, true, false),
  p(3, "Netflix Premium — 6 Months", "netflix", 120, 180,
    "Save more with 6 months of Netflix Premium. Full 4K access on 4 screens with a private, ready-to-use profile.",
    ["images/NetflixBigLogo.png", "images/NetflixLogo.png"], 4.7, false, true),

  p(10, "Spotify Premium — 1 Month", "spotify", 15, 20,
    "Ad-free music, offline downloads, and unlimited skips with Spotify Premium. Works on mobile, desktop, and smart TVs.",
    ["images/spotifyBig.png", "images/spotify.png", "images/spotify-1.png"], 4.9, true, true),
  p(11, "Spotify Premium — 3 Months", "spotify", 40, 55,
    "Three months of ad-free Spotify Premium with offline listening and high-quality audio on all your devices.",
    ["images/spotify.png", "images/Spotify_logo.png"], 4.8, false, false),
  p(12, "Spotify Premium — 6 Months", "spotify", 75, 100,
    "Six months of Spotify Premium at the best price. Unlimited music, podcasts, and downloads with no ads.",
    ["images/Spotify_logo.png", "images/spotifyBig.png"], 4.7, false, true),

  p(20, "Canva Pro — 1 Year", "canva", 35, 60,
    "Unlock premium templates, background remover, brand kits, and AI design tools with a full year of Canva Pro.",
    ["images/canva-icon.png", "images/creativecloud.png"], 4.8, true, true),
  p(21, "Canva Pro — 1 Month", "canva", 8, 12,
    "A full month of Canva Pro with premium templates, Magic Studio AI tools, and unlimited exports.",
    ["images/canva-icon.png"], 4.6, false, false),
  p(22, "Canva Pro — 3 Months", "canva", 20, 30,
    "Three months of Canva Pro for creators, students, and small businesses. Instant activation.",
    ["images/canva-icon.png", "images/creativecloud.png"], 4.7, false, false),

  p(30, "Shahid VIP — 1 Month", "shahid", 18, 25,
    "Stream exclusive Arab series, movies, and live sports in HD with Shahid VIP. Instant activation.",
    ["images/ShahidLogo.png", "images/Shahid_Logo.png"], 4.7, true, false),
  p(31, "Shahid VIP — 3 Months", "shahid", 45, 65,
    "Three months of Shahid VIP with unlimited access to Shahid Originals, movies, and premium content.",
    ["images/Shahid_Logo.png", "images/ShahidLogo.png"], 4.6, false, false),
  p(32, "Shahid VIP — 1 Year", "shahid", 140, 200,
    "A full year of Shahid VIP entertainment at the best price. Works on mobile, web, and smart TVs.",
    ["images/ShahidLogo.png", "images/Shahid_Logo.png"], 4.8, false, true),

  p(40, "CapCut Pro — 1 Month", "capcut", 12, 18,
    "Edit like a pro with CapCut Pro: premium effects, cloud storage, and watermark-free exports for 30 days.",
    ["images/capcut.png", "images/logo-capcut.png"], 4.6, false, false),
  p(41, "CapCut Pro — 3 Months", "capcut", 30, 45,
    "Three months of CapCut Pro with all premium effects, templates, and AI editing tools unlocked.",
    ["images/logo-capcut.png", "images/capcut.png"], 4.7, false, false),
  p(42, "CapCut Pro — 1 Year", "capcut", 95, 140,
    "A full year of CapCut Pro for content creators. Premium assets, cloud backup, and no watermark.",
    ["images/capcut.png", "images/logo-capcut.png"], 4.8, false, true),

  // ── PC Games ───────────────────────────────────────────────────────────
  p(50, "Arc Raiders", "pc", 189, 220,
    "Arc Raiders is a cooperative survival shooter where you and your squad face mechanical threats and rival raiders. Steam key.",
    ["images/Arc_Raiders3.png"], 4.8, true, true),
  p(51, "Cyberpunk 2077", "pc", 129, 179,
    "Explore Night City in this open-world RPG packed with story, combat, and customization. PC digital key.",
    ["images/Cyberpunk2077.png"], 4.9, true, false),
  p(52, "Elden Ring", "pc", 149, 199,
    "FromSoftware's award-winning action RPG. Explore the Lands Between, master combat, and become Elden Lord.",
    ["images/elden-ring.png", "images/elden-ring-3.png"], 4.9, true, false),
  p(53, "Helldivers 2", "pc", 139, 169,
    "Team up with up to four players to spread democracy across the galaxy in this co-op third-person shooter.",
    ["images/helldivers-2-2.png", "images/helldivers-2-3.png"], 4.8, false, true),
  p(54, "Grand Theft Auto V", "pc", 99, 129,
    "Experience Los Santos and Blaine County in the legendary open-world action game, including GTA Online.",
    ["images/gta5.png", "images/gta5-2.png", "images/gta5-3.png"], 4.7, true, false),
  p(55, "No Man's Sky", "pc", 119, 159,
    "Explore an infinite universe of planets, build bases, and trade with other players in this space survival adventure.",
    ["images/no-man-s-sky-3.png", "images/no-man-s-sky-2.png"], 4.6, false, false),
  p(56, "Rust", "pc", 109, 139,
    "Survive, build, and fight for resources in Rust's brutal multiplayer sandbox. Steam key with instant delivery.",
    ["images/rust.png", "images/rust-2.png", "images/rust-3.png"], 4.7, false, false),
  p(57, "Nioh 3", "pc", 169, 210,
    "Master fast-paced samurai combat and supernatural enemies in the latest chapter of the Nioh series.",
    ["images/nioh-3-2.png", "images/nioh-3-3.png"], 4.6, false, true),
  p(58, "REANIMAL", "pc", 159, 199,
    "A dark cooperative horror adventure from the creators of Little Nightmares. Face your fears together.",
    ["images/REANIMAL.png", "images/REANIMAL-2.png", "images/REANIMAL-3.png"], 4.5, false, false),
  p(59, "Minecraft: Java & Bedrock Edition", "pc", 89, 119,
    "Build, explore, and survive in the world's most popular sandbox. Includes both Java and Bedrock editions.",
    ["images/minecraft-java-and-bedrock-edition-pc-mac-cover.jpg", "images/mc2.jpg", "images/mc3.jpg"], 4.9, false, true),

  // ── Console Games ──────────────────────────────────────────────────────
  p(60, "EA Sports FC 26 — PS5", "console", 219, 279,
    "Play the newest chapter of EA Sports FC on PlayStation 5 with updated clubs, Ultimate Team, and gameplay.",
    ["images/fc-26-2.png", "images/fc-26s.png"], 4.7, true, false),
  p(61, "EA Sports FC 26 — Xbox", "console", 219, 279,
    "EA Sports FC 26 for Xbox Series X|S. Full game digital code with instant delivery.",
    ["images/fc-26s.png", "images/fc-26-2.png"], 4.7, false, false),
  p(62, "Elden Ring — PS5", "console", 159, 199,
    "The complete Elden Ring experience on PlayStation 5. Explore the Lands Between and face legendary bosses.",
    ["images/elden-ring.png", "images/elden-ring-3.png"], 4.8, false, true),
  p(63, "Cyberpunk 2077 — Xbox", "console", 139, 179,
    "Cyberpunk 2077 on Xbox Series X|S with the next-gen update. Dive into Night City's sprawling story.",
    ["images/Cyberpunk2077.png"], 4.7, false, false),

  // ── Mobile Games ───────────────────────────────────────────────────────
  p(70, "Minecraft Mobile", "mobile", 39, 49,
    "Minecraft Pocket Edition for iOS and Android. Build, mine, and explore anywhere.",
    ["images/minecraft-java-and-bedrock-edition-pc-mac-cover.jpg", "images/mc2.jpg"], 4.7, false, false),
  p(71, "GTA V — Mobile Cloud", "mobile", 59, 79,
    "Stream Grand Theft Auto V on your phone with a cloud gaming pass. No console required.",
    ["images/gta5.png", "images/gta5-2.png"], 4.5, false, false),
  p(72, "EA Sports FC 26 — Mobile", "mobile", 69, 89,
    "Play EA Sports FC 26 on mobile with a premium account and full Ultimate Team access.",
    ["images/fc-26-2.png", "images/fc-26s.png"], 4.6, false, false),

  // ── Courses ────────────────────────────────────────────────────────────
  p(80, "Python Programming Bootcamp", "programming", 59, 120,
    "Learn Python from zero to advanced with hands-on projects, exercises, and lifetime access to course materials.",
    ["images/Codecademy.png", "images/Udemy.png"], 4.8, true, false),
  p(81, "Full-Stack Web Development", "programming", 79, 150,
    "Master HTML, CSS, JavaScript, React, Node.js, and databases with a complete full-stack curriculum.",
    ["images/Coursera.png", "images/Udemy.png"], 4.8, false, true),
  p(82, "JavaScript Masterclass", "programming", 49, 99,
    "Deepen your JavaScript skills with modern ES features, async patterns, and real-world projects.",
    ["images/Udemy.png", "images/Codecademy.png"], 4.7, false, false),

  p(90, "UI/UX Design with Figma", "design", 54, 110,
    "Design beautiful, usable interfaces in Figma. Covers design systems, prototyping, and portfolio projects.",
    ["images/Figmapro.png", "images/sketch.png"], 4.8, true, false),
  p(91, "Adobe Creative Cloud Masterclass", "design", 69, 140,
    "Learn Photoshop, Illustrator, and InDesign through practical projects and professional workflows.",
    ["images/adobe.png", "images/creativecloud.png"], 4.7, false, false),
  p(92, "Graphic Design Fundamentals", "design", 39, 80,
    "Understand color, typography, layout, and branding to create professional designs from day one.",
    ["images/sketch.png", "images/Figmapro.png"], 4.6, false, false),

  p(100, "Digital Marketing Professional", "business", 65, 130,
    "Master SEO, social media, email marketing, and paid ads with a practical, certification-oriented course.",
    ["images/google-marketing-coursera.png", "images/google-marketing-coursera2.png"], 4.7, true, false),
  p(101, "Business Leadership & Management", "business", 59, 120,
    "Develop leadership, communication, and team-management skills for modern organizations.",
    ["images/Coursera.png", "images/LinkedInLearning.png"], 4.6, false, false),
  p(102, "LinkedIn Learning — 3 Months", "business", 45, 70,
    "Unlimited access to thousands of business, tech, and creative courses for three months.",
    ["images/LinkedInLearning.png", "images/Coursera.png"], 4.5, false, true),

  // ── Apps ───────────────────────────────────────────────────────────────
  p(120, "Microsoft 365 Personal — 1 Year", "mobile_apps", 89, 130,
    "Word, Excel, PowerPoint, Outlook, and 1 TB OneDrive storage for one user on all devices.",
    ["images/365.png", "images/adobe.png"], 4.8, true, false),
  p(121, "Google Play Gift Card — 50 TND", "mobile_apps", 50, 55,
    "Top up your Google Play balance and buy apps, games, and in-app items. Digital code delivered instantly.",
    ["images/google-play.png", "images/app-store.png"], 4.9, false, true),
  p(122, "App Store Gift Card — 50 TND", "mobile_apps", 50, 55,
    "Apple App Store and iTunes gift card for apps, games, music, and subscriptions. Instant digital delivery.",
    ["images/app-store.png", "images/google-play.png"], 4.9, false, false),

  p(130, "Adobe Creative Cloud — 1 Year", "software", 199, 299,
    "Full access to Photoshop, Illustrator, Premiere Pro, After Effects, and more for a full year.",
    ["images/adobe.png", "images/creativecloud.png"], 4.8, true, false),
  p(131, "Microsoft 365 Family — 1 Year", "software", 129, 180,
    "Share Microsoft 365 with up to 6 people, each with 1 TB OneDrive storage and premium Office apps.",
    ["images/365.png", "images/adobe.png"], 4.7, false, false),
  p(132, "Norton 360 Deluxe — 1 Year", "software", 79, 110,
    "Protect up to 5 devices with antivirus, VPN, password manager, and cloud backup for one year.",
    ["images/norton.png"], 4.5, false, false),
  p(133, "QuickBooks Pro — 1 Year", "software", 149, 220,
    "Accounting, invoicing, payroll, and reporting tools for small businesses. One-year subscription.",
    ["images/quickbooks.png"], 4.6, false, false),
  p(134, "Sketch Pro — 1 Year", "software", 99, 150,
    "A full year of Sketch for Mac: vector editing, prototyping, and collaboration for product designers.",
    ["images/sketch.png", "images/Figmapro.png"], 4.5, false, false),

  // ── Gift cards ─────────────────────────────────────────────────────────
  p(150, "Steam Gift Card — 50 TND", "steam", 52, 55,
    "Add 50 TND to your Steam wallet and buy games, DLC, or in-game items. Code delivered instantly.",
    ["images/steam.png", "images/steam-logo.png"], 4.9, true, false),
  p(151, "Steam Gift Card — 100 TND", "steam", 102, 110,
    "A 100 TND Steam wallet code for the games you love. Instant digital delivery after payment.",
    ["images/steam-logo.png", "images/steam1.png"], 4.8, false, false),

  p(160, "Epic Games Gift Card — 50 TND", "epic_games", 52, 55,
    "Shop the Epic Games Store with a 50 TND gift card. Use it on games, DLC, and V-Bucks.",
    ["images/epic-games.png", "images/epic_games_logo.png"], 4.8, false, false),
  p(161, "Epic Games Gift Card — 100 TND", "epic_games", 102, 110,
    "A 100 TND Epic Games Store gift card, delivered instantly as a digital code.",
    ["images/epic-games1.png", "images/epic-games.png"], 4.7, false, false),

  p(170, "EA Play — 1 Month", "ea_games", 19, 25,
    "Access a library of EA games, early trials, and member rewards with a one-month EA Play subscription.",
    ["images/EA_logo.png", "images/ea-logo.png"], 4.7, false, false),
  p(171, "EA Play — 12 Months", "ea_games", 129, 160,
    "A full year of EA Play: more games, early access trials, and 10% off EA digital purchases.",
    ["images/ea-logo.png", "images/EA_logo.png"], 4.6, false, false),

  p(180, "Xbox Game Pass PC — 1 Month", "xbox_pc", 39, 50,
    "Play hundreds of high-quality PC games with Xbox Game Pass, including new releases on day one.",
    ["images/xbox-game-pass.png", "images/Xbox-logo.png"], 4.8, true, false),
  p(181, "Xbox Game Pass PC — 3 Months", "xbox_pc", 109, 140,
    "Three months of Xbox Game Pass for PC with access to the full rotating catalog and member discounts.",
    ["images/xbox.png", "images/xbox-game-pass.png"], 4.7, false, false),
  p(182, "Xbox Game Pass Ultimate — 1 Month", "xbox_pc", 55, 70,
    "Game Pass Ultimate combines PC and console libraries, online multiplayer, and cloud gaming.",
    ["images/Xbox-logo.png", "images/xbox.png"], 4.8, false, true),
];

export const SEED_MARKER_KEY = "catalog:seeded:v1";
const SEED_LOCK_KEY = "catalog:seed:lock";

export function deriveMainCategories(category) {
  return CATEGORY_TO_MAIN[category] || [];
}

export function isValidCategorySlug(category) {
  return typeof category === "string" && /^[a-z0-9][a-z0-9_-]{0,49}$/.test(category);
}

/**
 * Populate the store with the starter catalog exactly once.
 * Safe to call on every request: it is a cheap marker read after the first run.
 */
export async function ensureSeeded(redis) {
  if (String(process.env.AUTO_SEED).toLowerCase() === "false") return false;

  try {
    if (await redis.get(SEED_MARKER_KEY)) return false;

    // Cross-process lock so two cold starts cannot double-seed.
    const lock = await redis.set(SEED_LOCK_KEY, "1", { NX: true, EX: 60 });
    if (!lock) return false;

    try {
      if (await redis.get(SEED_MARKER_KEY)) return false;

      let cursor = "0";
      let hasProducts = false;
      do {
        const result = await redis.scan(cursor, { MATCH: "product:*", COUNT: 100 });
        cursor = String(result.cursor || "0");
        if (result.keys && result.keys.length > 0) { hasProducts = true; break; }
      } while (cursor !== "0");

      if (!hasProducts) {
        // Write in small parallel batches to shorten the crash window.
        const batchSize = 20;
        for (let i = 0; i < SEED_PRODUCTS.length; i += batchSize) {
          const batch = SEED_PRODUCTS.slice(i, i + batchSize);
          await Promise.all(
            batch.map((product) => redis.set(`product:${product.id}`, JSON.stringify(product)))
          );
        }
        console.log(`[seed] Seeded ${SEED_PRODUCTS.length} starter products`);
      }

      if (!(await redis.get("config:categories"))) {
        await redis.set("config:categories", JSON.stringify(SEED_CATEGORIES));
      }

      await redis.set(SEED_MARKER_KEY, new Date().toISOString());
      return true;
    } finally {
      try { await redis.del(SEED_LOCK_KEY); } catch { /* expire will clean up */ }
    }
  } catch (error) {
    console.error("[seed] Failed to seed catalog:", error);
    return false;
  }
}

// A single client per serverless instance. Storing the *promise* (not just the
// client) prevents concurrent cold-start requests from opening several
// connections at the same time.
let globalClientPromise = null;
let memoryStore = null;

async function connectRedis() {
  const { createClient } = await import("redis");
  const client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (err) => {
    console.error("❌ Redis Error:", err);
  });
  client.on("end", () => {
    globalClientPromise = null;
  });

  await client.connect();
  console.log("✅ Redis connected");
  return client;
}

export async function getRedis() {
  if (process.env.REDIS_URL) {
    if (!globalClientPromise) {
      globalClientPromise = connectRedis().catch((err) => {
        // Do not cache a failed connection; the next request can retry.
        globalClientPromise = null;
        throw new Error(`Redis connection failed: ${err.message}`);
      });
    }
    return globalClientPromise;
  }

  // No Redis configured. In production this would silently split orders across
  // ephemeral lambda instances, so fail loudly unless explicitly overridden.
  const isProduction = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
  if (isProduction && String(process.env.ALLOW_MEMORY_STORE).toLowerCase() !== "true") {
    throw new Error("REDIS_URL is required in production (set ALLOW_MEMORY_STORE=true to override)");
  }

  // Local development / demo: use the in-memory store so the whole shop,
  // checkout, and admin dashboard still work without external services.
  if (!memoryStore) {
    memoryStore = new MemoryStore();
    console.log("ℹ️  REDIS_URL not set — using in-memory store (data resets on restart)");
  }
  return memoryStore;
}

export default getRedis;
