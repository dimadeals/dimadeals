import { getRedis } from "./redis.js";

/**
 * CLEANUP SCRIPT — Delete all products from Redis
 * Run once with: node api/cleanup-products.js
 */

(async () => {
  try {
    const redis = await getRedis();
    console.log("🔍 Scanning for all products...");

    // Scan all product keys
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
      console.log("✅ No products found. Already clean!");
      process.exit(0);
    }

    console.log(`🗑️  Found ${allKeys.length} product(s). Deleting...`);

    // Delete all products
    const deleted = await redis.del(allKeys);
    console.log(`✅ Deleted ${deleted} product(s)`);

    // Verify
    let checkCursor = "0";
    let checkCount = 0;
    do {
      const result = await redis.scan(checkCursor, {
        MATCH: "product:*",
        COUNT: 100
      });
      checkCursor = String(result.cursor || "0");
      checkCount += result.keys.length;
    } while (checkCursor !== "0");

    if (checkCount === 0) {
      console.log("✨ All products cleared! Ready to recreate.");
    } else {
      console.log(`⚠️  Warning: ${checkCount} products still remain`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
})();
