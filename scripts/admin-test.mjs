import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const EDGE = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ADMIN_KEY = process.env.ADMIN_KEY || "dev-admin-key";

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

const steps = [];
const ok = (msg) => steps.push(`✓ ${msg}`);
const fail = (msg) => { steps.push(`✗ ${msg}`); process.exitCode = 1; };

async function step(name, fn) {
  try { ok(`${name} — ${await fn()}`); }
  catch (error) { fail(`${name} — ${error.message}`); }
}

async function toastText() {
  await page.waitForSelector(".toast", { timeout: 5000 });
  return (await page.locator(".toast").last().innerText()).trim();
}

await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
await page.fill("#key-input", ADMIN_KEY);
await page.click("#login-btn");
await page.waitForSelector("#dashboard.vis");

await step("create main category from admin UI", async () => {
  await page.click('[data-sec="categories"]');
  await page.waitForSelector(".main-cat-card");
  await page.click("#add-main-cat-btn");
  await page.waitForSelector("#main-cat-modal.open");
  await page.fill("#main-cat-name", "Streaming");
  await page.click("#save-main-cat-btn");
  const toast = await toastText();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".main-cat-card h4")].some((h) => h.textContent.trim() === "Streaming"),
    null, { timeout: 5000 }
  );
  return toast;
});

await step("add subcategory to custom main category", async () => {
  const card = page.locator(".main-cat-card", { has: page.locator("h4", { hasText: "Streaming" }) });
  await card.locator("button", { hasText: "Add Subcategory" }).click();
  await page.waitForSelector("#subcat-modal.open");
  await page.fill("#subcat-name", "Hulu TV");
  await page.click("#save-subcat-btn");
  const toast = await toastText();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".main-cat-card")].some((card) =>
      card.querySelector("h4")?.textContent.trim() === "Streaming" &&
      card.textContent.includes("hulu-tv")),
    null, { timeout: 5000 }
  );
  return toast;
});

await step("create product in custom category with auto main category", async () => {
  await page.click('[data-sec="products"]');
  await page.waitForSelector("#products-tbody tr");
  await page.click("#add-product-btn");
  await page.waitForSelector("#product-modal.open");
  await page.fill("#prod-id", "999");
  await page.fill("#prod-name", "Hulu Test Product");
  await page.selectOption("#prod-category", "hulu-tv");
  const autoChecked = await page.locator('.main-cat-cb[value="Streaming"]').isChecked();
  if (!autoChecked) throw new Error("main category was not auto-checked");
  await page.fill("#prod-price", "12");
  await page.fill("#prod-description", "A test product created from the admin dashboard.");
  await page.fill("#prod-images", "images/canva-icon.png");
  await page.click("#save-product-btn");
  const toast = await toastText();
  await page.waitForFunction(() =>
    [...document.querySelectorAll("#products-tbody tr")].some((row) => row.textContent.includes("Hulu Test Product")),
    null, { timeout: 5000 }
  );
  return `${toast}, main category auto-checked`;
});

await step("custom product API state is correct", async () => {
  const res = await fetch(`${BASE}/api/products`, { headers: { Authorization: ADMIN_KEY } });
  const data = await res.json();
  const product = data.products.find((p) => p.id === 999);
  if (!product) throw new Error("product 999 missing");
  if (product.category !== "hulu-tv" || !product.mainCategories.includes("Streaming")) {
    throw new Error(`category=${product.category} mains=${product.mainCategories}`);
  }
  return `category=${product.category}, main=${product.mainCategories.join(",")}`;
});

await step("delete product from admin UI", async () => {
  const row = page.locator("#products-tbody tr", { hasText: "Hulu Test Product" });
  await row.locator(".btn-danger").click();
  await page.waitForSelector("#confirm-bg.open");
  await page.click("#confirm-yes");
  await page.waitForFunction(() =>
    ![...document.querySelectorAll("#products-tbody tr")].some((row) => row.textContent.includes("Hulu Test Product")),
    null, { timeout: 5000 }
  );
  return "product removed";
});

await step("delete now-unused subcategory from admin UI", async () => {
  await page.click('[data-sec="categories"]');
  const card = page.locator(".main-cat-card", { has: page.locator("h4", { hasText: "Streaming" }) });
  await card.locator(".subcat-item", { hasText: "hulu-tv" }).locator(".btn-danger").click();
  await page.waitForSelector("#confirm-bg.open");
  await page.click("#confirm-yes");
  await page.waitForFunction(() =>
    ![...document.querySelectorAll(".main-cat-card h4")].some((h) => h.textContent.trim() === "Streaming"),
    null, { timeout: 5000 }
  );
  return "empty main category removed";
});

console.log(steps.join("\n"));
console.log("errors:", errors.length ? errors : "none");
await browser.close();
if (errors.length) process.exitCode = 1;
