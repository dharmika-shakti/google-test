import puppeteer from 'puppeteer';

async function main() {
  console.log('[INIT] Starting Google open test');

  // Decide headless from env (default headless on server)
  const forceHeadless = (v) => /^(1|true|yes)$/i.test(String(v || '').trim());
  const hasDisplay = process.platform === 'win32' || (process.env.DISPLAY && process.env.DISPLAY.length > 0);
  const RUN_HEADLESS = forceHeadless(process.env.HSN_HEADLESS) || (!hasDisplay && process.platform !== 'win32');

  const launchOptions = {
    headless: RUN_HEADLESS ? true : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    defaultViewport: RUN_HEADLESS ? { width: 1280, height: 800 } : null,
  };

  let browser;
  try {
    console.log('[BROWSER_LAUNCH] Launching browser...');
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    console.log('[NAVIGATE] Going to https://www.google.com/');
    await page.goto('https://www.google.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('[DONE] Google loaded successfully');
  } catch (err) {
    console.error('[ERROR]', err);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

main().catch((e) => {
  console.error('[FATAL]', e);
  process.exit(1);
});
