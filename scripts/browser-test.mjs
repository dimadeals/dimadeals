import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const EDGE = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ADMIN_KEY = process.env.ADMIN_KEY || "dev-admin-key";

mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

const errors = [];
const failedRequests = [];
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
page.on("requestfailed", (request) => {
  if (!request.url().startsWith(BASE)) return;
  const reason = request.failure()?.errorText || "";
  // Aborts are expected when the test navigates away from a page mid-load.
  if (reason.includes("ERR_ABORTED")) return;
  failedRequests.push(`${request.method()} ${request.url()} — ${reason}`);
});
page.on("response", (response) => {
  if (response.url().startsWith(BASE) && response.status() >= 400) {
    failedRequests.push(`${response.status()} ${response.request().method()} ${response.url()}`);
  }
});

const results = [];
function ok(name, detail = "") {
  results.push(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
  process.exitCode = 1;
}
async function check(name, fn) {
  try {
    const detail = await fn();
    ok(name, detail);
  } catch (error) {
    fail(name, error.message);
  }
}

// ── Storefront ──────────────────────────────────────────────────────────────
await check("home renders seeded products", async () => {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("#most-popular-grid .product-card", { timeout: 15000 });
  const popular = await page.locator("#most-popular-grid .product-card").count();
  const recommended = await page.locator("#recommended-grid .product-card").count();
  if (popular === 0 || recommended === 0) throw new Error(`popular=${popular} recommended=${recommended}`);
  return `${popular} popular, ${recommended} recommended`;
});

await check("home product image loads", async () => {
  const img = page.locator("#most-popular-grid .product-card img").first();
  await img.waitFor({ state: "visible" });
  const natural = await img.evaluate((el) => el.naturalWidth);
  if (!natural) throw new Error("image naturalWidth is 0");
  return `naturalWidth=${natural}`;
});

await page.screenshot({ path: "screenshots/home.png", fullPage: false });

await check("clicking a product opens shareable product page", async () => {
  await page.locator("#most-popular-grid .product-card").first().click();
  await page.waitForURL(/\/product\?id=\d+/, { timeout: 10000 });
  await page.waitForSelector(".product-info h1");
  const title = (await page.locator(".product-info h1").textContent())?.trim();
  const price = (await page.locator(".product-info .price").first().textContent())?.trim();
  if (!title) throw new Error("empty product title");
  return `${title} / ${price}`;
});

await page.screenshot({ path: "screenshots/product.png", fullPage: false });

await check("buy now adds to cart", async () => {
  await page.locator(".product-info .buy-button").click();
  await page.waitForFunction(() => document.querySelector("#cart-count")?.textContent === "1", null, { timeout: 5000 });
  return "cart count = 1";
});

await check("cart page shows item and updates quantity", async () => {
  await page.goto(`${BASE}/cart`, { waitUntil: "networkidle" });
  await page.waitForSelector(".cart-item");
  const before = (await page.locator("#total").textContent())?.trim();
  await page.locator(".cart-item .item-quantity button").last().click();
  await page.waitForFunction(
    () => document.querySelector(".cart-item .item-quantity span")?.textContent === "2",
    null,
    { timeout: 5000 }
  );
  const after = (await page.locator("#total").textContent())?.trim();
  if (before === after) throw new Error(`total did not change (${before})`);
  return `${before} -> ${after}`;
});

await page.screenshot({ path: "screenshots/cart.png", fullPage: false });

await check("checkout submits and confirmation shows server order", async () => {
  await page.goto(`${BASE}/checkout`, { waitUntil: "networkidle" });
  await page.waitForSelector("#checkout-form");
  await page.fill("#email", "browser-test@example.com");
  await page.fill("#phone", "20123456");
  await page.fill("#fullname", "Browser Test");
  await page.selectOption("#country", "TN");
  await page.check("#terms");
  await page.click("#submit-btn");
  await page.waitForURL(/\/confirmation\?orderId=ORD-/, { timeout: 15000 });
  await page.waitForSelector("#confirmation-info .info-row");
  const info = (await page.locator("#confirmation-info").innerText()).replace(/\s+/g, " ");
  const items = await page.locator("#confirmation-items-list .confirmation-item-row").count();
  if (!info.includes("Browser Test") || !info.includes("TND") || items < 1) {
    throw new Error(`info="${info}" items=${items}`);
  }
  return `${items} item(s), ${info.slice(0, 80)}...`;
});

await page.screenshot({ path: "screenshots/confirmation.png", fullPage: false });

await check("confirmation survives a refresh (API reload)", async () => {
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#confirmation-info .info-row");
  const name = await page.locator("#confirmation-info .info-row").nth(2).innerText();
  if (!name.includes("Browser Test")) throw new Error(`name row: ${name}`);
  return name.replace(/\s+/g, " ");
});

// ── Browse / search ─────────────────────────────────────────────────────────
await check("browse with no category shows all products", async () => {
  await page.goto(`${BASE}/browse`, { waitUntil: "networkidle" });
  await page.waitForSelector("#products-grid .product-card");
  const title = (await page.locator("#page-title").textContent())?.trim();
  const count = await page.locator("#products-grid .product-card").count();
  if (title !== "All Products" || count === 0) throw new Error(`title=${title} count=${count}`);
  return `${title}, ${count} cards loaded`;
});

await check("games main category filters correctly", async () => {
  await page.goto(`${BASE}/browse?category=games`, { waitUntil: "networkidle" });
  await page.waitForSelector("#products-grid .product-card");
  const title = (await page.locator("#page-title").textContent())?.trim();
  const count = await page.locator("#products-grid .product-card").count();
  const platformsVisible = await page.locator("#platforms-section").isVisible();
  if (title !== "Games & Digital Content" || count === 0 || !platformsVisible) {
    throw new Error(`title=${title} count=${count} platforms=${platformsVisible}`);
  }
  return `${title}, ${count} cards, platforms visible`;
});

await check("mobile_apps category resolves", async () => {
  await page.goto(`${BASE}/browse?category=mobile_apps`, { waitUntil: "networkidle" });
  await page.waitForSelector("#products-grid .product-card");
  const title = (await page.locator("#page-title").textContent())?.trim();
  const count = await page.locator("#products-grid .product-card").count();
  if (title !== "Mobile Apps" || count === 0) throw new Error(`title=${title} count=${count}`);
  return `${title}, ${count} cards`;
});

await check("unknown category shows a friendly empty state", async () => {
  await page.goto(`${BASE}/browse?category=does-not-exist`, { waitUntil: "networkidle" });
  await page.waitForSelector("#products-grid .empty-state");
  return "empty state rendered";
});

await page.screenshot({ path: "screenshots/browse.png", fullPage: false });

await check("search URL, results and filters work", async () => {
  await page.goto(`${BASE}/search?q=premium`, { waitUntil: "networkidle" });
  await page.waitForSelector("#search-results-grid .product-card");
  const count = await page.locator("#search-results-grid .product-card").count();
  const query = (await page.locator("#search-query-display").textContent())?.trim();
  const input = await page.inputValue("#search-input");
  await page.click('[data-filter="games"]');
  await page.waitForTimeout(300);
  const filtered = await page.locator("#search-results-grid .product-card").count();
  if (count === 0 || !query?.includes("premium") || input !== "premium") {
    throw new Error(`count=${count} query=${query} input=${input}`);
  }
  return `${count} total, ${filtered} games, query restored in header`;
});

await page.screenshot({ path: "screenshots/search.png", fullPage: false });

// ── Mobile navigation ───────────────────────────────────────────────────────
await check("mobile hamburger opens menu and submenu", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("#most-popular-grid .product-card");

  const menu = page.locator(".nav-menu");
  if (await menu.isVisible()) throw new Error("nav menu should start closed on mobile");

  await page.click("#mobile-menu-toggle");
  await page.waitForTimeout(200);
  if (!(await menu.isVisible())) throw new Error("nav menu did not open");

  const gamesLink = page.locator('.nav-item > .nav-link', { hasText: "Games" }).first();
  await gamesLink.click();
  await page.waitForTimeout(200);
  const dropdownVisible = await page.locator(".nav-item.open .dropdown").first().isVisible();
  if (!dropdownVisible) throw new Error("submenu did not open on tap");

  return "menu + submenu open";
});

await check("mobile search expands", async () => {
  await page.click("#search-button");
  await page.waitForTimeout(200);
  const expanded = await page.locator(".search-container.expanded").count();
  const inputVisible = await page.locator("#search-input").isVisible();
  if (!expanded || !inputVisible) throw new Error(`expanded=${expanded} input=${inputVisible}`);
  return "search field visible";
});

await page.screenshot({ path: "screenshots/mobile-home.png", fullPage: false });
await page.setViewportSize({ width: 1440, height: 1000 });

// ── Admin ───────────────────────────────────────────────────────────────────
const admin = await context.newPage();
const adminErrors = [];
admin.on("pageerror", (error) => adminErrors.push(`pageerror: ${error.message}`));
admin.on("console", (message) => {
  if (message.type() === "error") adminErrors.push(`console: ${message.text()}`);
});

await check("admin login and overview load", async () => {
  await admin.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  await admin.fill("#key-input", ADMIN_KEY);
  await admin.click("#login-btn");
  await admin.waitForSelector("#dashboard.vis", { timeout: 10000 });
  await admin.waitForFunction(() => document.querySelector("#k-total")?.textContent !== "—", null, { timeout: 10000 });
  const total = (await admin.locator("#k-total").textContent())?.trim();
  const revenue = (await admin.locator("#k-revenue").textContent())?.trim();
  const recent = await admin.locator("#recent-tbody tr").count();
  const active = await admin.locator(".s-content.active").getAttribute("id");
  if (!total || !revenue || recent === 0 || active !== "sec-overview") {
    throw new Error(`total=${total} revenue=${revenue} recent=${recent} active=${active}`);
  }
  return `total=${total} revenue=${revenue} recent=${recent}`;
});

await check("admin orders tab, row modal and full history load", async () => {
  await admin.click('[data-sec="orders"]');
  await admin.waitForSelector("#orders-tbody tr", { state: "attached" });
  const rows = await admin.locator("#orders-tbody tr").count();
  const info = (await admin.locator("#pg-info").textContent())?.trim();
  await admin.locator("#orders-tbody tr").first().click();
  await admin.waitForSelector("#order-modal.open");
  const modalText = (await admin.locator("#modal-body").innerText()).replace(/\s+/g, " ");
  await admin.click("#order-modal .mclose");
  if (rows === 0 || !info || !modalText.includes("Order ID")) {
    throw new Error(`rows=${rows} info=${info} modal="${modalText.slice(0, 60)}"`);
  }
  return `${rows} row(s), ${info}`;
});

await admin.screenshot({ path: "screenshots/admin-overview.png", fullPage: false });

await check("admin products and edit modal work", async () => {
  await admin.click('[data-sec="products"]');
  await admin.waitForSelector("#products-tbody tr");
  const rows = await admin.locator("#products-tbody tr").count();
  await admin.locator("#products-tbody tr .btn-secondary").first().click();
  await admin.waitForSelector("#product-modal.open");
  const mainCats = await admin.locator("#main-cat-checkboxes .main-cat-cb").count();
  const categoryOptions = await admin.locator("#prod-category option").count();
  await admin.click('#product-modal .mclose');
  if (rows < 10 || mainCats < 4 || categoryOptions < 5) {
    throw new Error(`rows=${rows} mainCats=${mainCats} categoryOptions=${categoryOptions}`);
  }
  return `${rows} products, ${mainCats} main categories, ${categoryOptions} categories`;
});

await check("admin categories render", async () => {
  await admin.click('[data-sec="categories"]');
  await admin.waitForSelector(".main-cat-card");
  const cards = await admin.locator(".main-cat-card").count();
  if (cards < 4) throw new Error(`cards=${cards}`);
  return `${cards} main categories`;
});

await check("admin messages tab renders", async () => {
  await admin.click('[data-sec="messages"]');
  await admin.waitForSelector("#messages-tbody tr");
  const count = (await admin.locator("#messages-count").textContent())?.trim();
  return `count=${count}`;
});

await admin.screenshot({ path: "screenshots/admin-products.png", fullPage: false });

// ── Report ──────────────────────────────────────────────────────────────────
console.log("\n=== BROWSER TEST RESULTS ===");
console.log(results.join("\n"));
console.log("\nConsole/page errors:", errors.length ? `\n- ${errors.join("\n- ")}` : "none");
console.log("Admin console/page errors:", adminErrors.length ? `\n- ${adminErrors.join("\n- ")}` : "none");
console.log("Failed same-origin requests:", failedRequests.length ? `\n- ${failedRequests.join("\n- ")}` : "none");

await browser.close();

if (errors.length || adminErrors.length) process.exitCode = 1;
