const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false
    });
  });

  const page = await context.newPage();

  await page.goto("https://db.netkeiba.com/race/202401010101/", {
    waitUntil: "domcontentloaded"
  });

  const content = await page.content();
  await browser.close();

  if (
    content.includes("アクセスが制限されています") ||
    content.includes("swal-icon--error")
  ) {
    console.log("🚫 ブロックされています");
  } else {
    console.log("✅ 通常ページを取得できました");
  }
})();