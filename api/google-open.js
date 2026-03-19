import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let browser;
  try {
    const executablePath = await chromium.executablePath();

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto("https://www.google.com/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    return res.status(200).json({
      ok: true,
      title: await page.title(),
      message: "Google opened successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Unknown error",
    });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}