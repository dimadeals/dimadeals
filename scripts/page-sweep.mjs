import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const EDGE = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });

const results = [];
const record = (ok, text) => { results.push(`${ok ? "✓" : "✗"} ${text}`); if (!ok) process.exitCode = 1; };

async function check(name, fn) {
  try { record(true, `${name} — ${await fn()}`); }
  catch (error) { record(false, `${name} — ${error.message}`); }
}

for (const pagePath of ["about.html", "contact.html", "faq.html", "help.html", "terms.html", "privacy.html"]) {
  await check(`static page ${pagePath}`, async () => {
    await page.goto(`${BASE}/${pagePath}`, { waitUntil: "networkidle" });
    const title = await page.title();
    const h1 = await page.locator("h1, h2").first().innerText();
    if (!title || !h1) throw new Error("missing title/heading");
    return title;
  });
}

await check("contact form submits", async () => {
  await page.goto(`${BASE}/contact.html`, { waitUntil: "networkidle" });
  await page.fill("#name", "Sweep Test");
  await page.fill("#email", "sweep@example.com");
  await page.fill("#message", "Testing the contact form end-to-end.");
  await page.click("#submit-btn");
  await page.waitForSelector("#success-message", { state: "visible", timeout: 10000 });
  return (await page.locator("#success-message").innerText()).trim();
});

await check("FAQ accordion mouse and keyboard", async () => {
  await page.goto(`${BASE}/faq.html`, { waitUntil: "networkidle" });
  const first = page.locator(".faq-item").first();
  await first.locator(".faq-question").click();
  if (!(await first.evaluate((el) => el.classList.contains("open")))) throw new Error("click did not open");
  const expanded = await first.locator(".faq-question").getAttribute("aria-expanded");
  await first.locator(".faq-question").press("Enter");
  if (await first.evaluate((el) => el.classList.contains("open"))) throw new Error("Enter did not close");
  return `aria-expanded was ${expanded}, keyboard toggles`;
});

await check("theme toggle persists dark mode", async () => {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.locator(".theme-toggle-container").click();
  const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  if (theme !== "dark") throw new Error(`data-theme=${theme}`);
  await page.reload({ waitUntil: "networkidle" });
  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  if (after !== "dark") throw new Error(`after reload data-theme=${after}`);
  await page.locator(".theme-toggle-container").click();
  return "dark applied and restored after reload";
});

await check("language switch keeps CTA icon", async () => {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.selectOption("#language-select", "fr");
  const cta = await page.locator(".hero .cta-button").innerText();
  const icon = await page.locator(".hero .cta-button i").count();
  if (!cta.includes("Parcourir") || icon !== 1) throw new Error(`cta="${cta}" icon=${icon}`);
  await page.selectOption("#language-select", "en");
  return cta.replace(/\s+/g, " ");
});

await page.screenshot({ path: "screenshots/legal-page.png", fullPage: false });

console.log(results.join("\n"));
console.log("errors:", errors.length ? `\n- ${errors.join("\n- ")}` : "none");
await browser.close();
if (errors.length) process.exitCode = 1;
