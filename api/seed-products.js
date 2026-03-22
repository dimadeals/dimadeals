import { getRedis } from "./redis.js";

/**
 * PRODUCT SEED SCRIPT
 * Loads a predefined set of products into Redis
 * Run with: node api/seed-products.js
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Netflix Premium",
    category: "netflix",
    price: 12.99,
    originalPrice: 16.99,
    description: "1 month Netflix Premium subscription - Watch unlimited films and TV shows",
    images: ["images/netflix.png"],
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 2,
    name: "Spotify Premium",
    category: "spotify",
    price: 9.99,
    originalPrice: 11.99,
    description: "1 month Spotify Premium - Ad-free music streaming",
    images: ["images/spotify.png"],
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 3,
    name: "Canva Pro",
    category: "canva",
    price: 14.99,
    originalPrice: 19.99,
    description: "1 month Canva Pro - Design templates and tools",
    images: ["images/canva.png"],
    rating: 4.6,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 4,
    name: "Shahid VIP",
    category: "shahid",
    price: 7.99,
    originalPrice: 9.99,
    description: "1 month Shahid VIP - Arabic entertainment content",
    images: ["images/shahid.png"],
    rating: 4.5,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 5,
    name: "CapCut Pro",
    category: "capcut",
    price: 4.99,
    originalPrice: 6.99,
    description: "1 month CapCut Premium - Professional video editing",
    images: ["images/capcut.png"],
    rating: 4.4,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 6,
    name: "Steam Gift Card 50$",
    category: "steam",
    price: 49.99,
    description: "$50 Steam store credit for games and software",
    images: ["images/steam.png"],
    rating: 4.9,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 7,
    name: "Epic Games Bundle",
    category: "epic_games",
    price: 29.99,
    originalPrice: 39.99,
    description: "1 month Epic Games Pass - Access to 100+ games",
    images: ["images/epic.png"],
    rating: 4.7,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 8,
    name: "EA Play Pro",
    category: "ea_games",
    price: 14.99,
    originalPrice: 19.99,
    description: "1 month EA Play Pro - Full EA games library",
    images: ["images/ea.png"],
    rating: 4.5,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 9,
    name: "Xbox Game Pass",
    category: "xbox_pc",
    price: 11.99,
    originalPrice: 16.99,
    description: "1 month Xbox Game Pass for PC - 300+ games",
    images: ["images/xbox.png"],
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 10,
    name: "Adobe Creative Cloud",
    category: "design",
    price: 54.99,
    originalPrice: 79.99,
    description: "1 month Adobe CC - Photoshop, Illustrator, Premiere Pro",
    images: ["images/adobe.png"],
    rating: 4.9,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 11,
    name: "Microsoft Office 365",
    category: "business",
    price: 9.99,
    originalPrice: 14.99,
    description: "1 month Microsoft 365 - Word, Excel, Teams, and more",
    images: ["images/office.png"],
    rating: 4.6,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 12,
    name: "JetBrains All Products",
    category: "programming",
    price: 24.99,
    originalPrice: 34.99,
    description: "1 month access to all JetBrains IDEs",
    images: ["images/jetbrains.png"],
    rating: 4.7,
    popular: false,
    recommended: false,
    inStock: true
  }
];

(async () => {
  try {
    const redis = await getRedis();
    console.log("📦 Starting product seed...");

    let created = 0;
    let failed = 0;

    for (const product of PRODUCTS) {
      try {
        await redis.set(`product:${product.id}`, JSON.stringify(product));
        console.log(`✅ Created: ${product.name} (ID: ${product.id})`);
        created++;
      } catch (error) {
        console.error(`❌ Failed to create ${product.name}:`, error.message);
        failed++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created: ${created}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`ℹ️  Total products: ${PRODUCTS.length}`);

    if (created === PRODUCTS.length) {
      console.log("\n✨ All products loaded successfully!");
      console.log("🚀 You can now:");
      console.log("   1. Refresh your admin dashboard to see all products");
      console.log("   2. Edit/delete any product");
      console.log("   3. Add to cart and checkout will use local products");
    }

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
})();
