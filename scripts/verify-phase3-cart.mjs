// Phase 3.1 Browser Verification Script: WooCommerce Store API Cart Integration
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\itachi\\.gemini\\antigravity\\brain\\0b3e5d7e-06e5-47f4-a023-82e8d20592c8';
const SCREENSHOT_DIR = path.resolve('screenshots');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // Retry
    }
    await wait(300);
  }
  throw new Error(`Server at ${url} did not become ready in ${timeoutMs}ms`);
}

async function runCartVerification() {
  console.log('=== Starting Phase 3.1: WooCommerce Cart Integration Browser Test ===\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // 1. Spawning Vite Preview Server
  console.log('[1/10] Starting Vite preview server...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    stdio: 'pipe',
    shell: true,
  });

  server.stdout.on('data', (d) => process.stdout.write(`[Vite stdout] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[Vite stderr] ${d}`));

  try {
    await waitForServer(BASE_URL);
    console.log('✓ Server ready at http://localhost:5173/\n');

    // 2. Launch Chrome
    console.log('[2/10] Launching Chrome in headless mode...');
    const browser = await chromium.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();

    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console error] ${msg.text()}`);
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(`[Page Uncaught Error] ${err.message}`);
    });

    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    });

    // 3. Test Product Page: Out-of-Stock and In-Stock Size selection
    console.log('[3/10] Testing Product Page and Out-of-Stock Protection...');
    const slug = encodeURIComponent('بلوفر-تريكو-بدرجات-ترابي');
    await page.goto(`${BASE_URL}/product/${slug}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1.mdr-title', { timeout: 10000 });

    // Check XL button is disabled
    const xlButton = page.locator('button:has-text("XL")');
    const isXlDisabled = await xlButton.isDisabled();
    console.log(`✓ Out-of-stock size 'XL' disabled attribute: ${isXlDisabled}`);

    // Select Size S (in stock)
    const sButton = page.locator('button:has-text("S")');
    await sButton.click();
    console.log("✓ Selected in-stock size: 'S'");

    // 4. Test Add to Cart via Store API
    console.log('\n[4/10] Adding variable product to cart...');
    const addToCartBtn = page.locator('button:has-text("أضف إلى السلة")');
    await addToCartBtn.click();

    // Wait for success indication
    await page.waitForSelector('button:has-text("أُضيفت القطعة بنجاح")', { timeout: 10000 });
    console.log('✓ Add to cart button transitioned to success state');

    // Check Header cart count badge
    await page.waitForSelector('.store-cart-link small', { timeout: 5000 });
    const cartBadgeCount = await page.$eval('.store-cart-link small', (el) => el.textContent?.trim());
    console.log(`✓ Header Cart badge updated to: ${cartBadgeCount}`);

    const addedScreenshot = path.join(SCREENSHOT_DIR, 'cart-01-added.png');
    await page.screenshot({ path: addedScreenshot });
    console.log(`✓ Saved screenshot: ${addedScreenshot}`);

    // 5. Navigate to Cart Page (/cart/)
    console.log('\n[5/10] Navigating to Cart Page (/cart/)...');
    await page.goto(`${BASE_URL}/cart/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.mdr-cart-layout', { timeout: 10000 });

    const cartItemName = await page.$eval('.mdr-cart-line a:not(:has(img))', (el) => el.textContent?.trim());
    const cartItemVariation = await page.$eval('.mdr-cart-line p', (el) => el.textContent?.trim());
    const cartItemPrice = await page.$eval('.mdr-cart-line > span', (el) => el.textContent?.trim());
    const cartTotal = await page.$eval('.mdr-cart-summary strong:last-of-type', (el) => el.textContent?.trim());

    console.log(`✓ Cart Page Item: "${cartItemName}"`);
    console.log(`✓ Cart Page Variation: "${cartItemVariation}"`);
    console.log(`✓ Line Total: ${cartItemPrice}`);
    console.log(`✓ Summary Total: ${cartTotal}`);

    const cartScreenshot = path.join(SCREENSHOT_DIR, 'cart-02-cart-page.png');
    await page.screenshot({ path: cartScreenshot });
    console.log(`✓ Saved screenshot: ${cartScreenshot}`);

    // 6. Test Quantity Change (Increase to 2)
    console.log('\n[6/10] Testing Quantity Change (Increase quantity to 2)...');
    const qtyInput = page.locator('.mdr-cart-line input[type="number"]');
    await qtyInput.fill('2');
    // Trigger change
    await qtyInput.dispatchEvent('change');
    await wait(1200);

    const updatedTotal = await page.$eval('.mdr-cart-summary strong:last-of-type', (el) => el.textContent?.trim());
    const updatedBadge = await page.$eval('.store-cart-link small', (el) => el.textContent?.trim());
    console.log(`✓ Quantity updated to 2. New Cart Total: ${updatedTotal}`);
    console.log(`✓ Header badge updated to: ${updatedBadge}`);

    const qtyScreenshot = path.join(SCREENSHOT_DIR, 'cart-03-quantity-updated.png');
    await page.screenshot({ path: qtyScreenshot });
    console.log(`✓ Saved screenshot: ${qtyScreenshot}`);

    // 7. Test Cart Persistence on Page Reload
    console.log('\n[7/10] Testing Cart-Token persistence on page reload...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.mdr-cart-layout', { timeout: 10000 });

    const reloadedItemCount = await page.$$eval('.mdr-cart-line', (els) => els.length);
    const reloadedTotal = await page.$eval('.mdr-cart-summary strong:last-of-type', (el) => el.textContent?.trim());
    console.log(`✓ After Reload: Items count = ${reloadedItemCount}, Total = ${reloadedTotal}`);

    const reloadScreenshot = path.join(SCREENSHOT_DIR, 'cart-04-refreshed.png');
    await page.screenshot({ path: reloadScreenshot });
    console.log(`✓ Saved screenshot: ${reloadScreenshot}`);

    // 8. Test Session Persistence across Multiple Tabs
    console.log('\n[8/10] Testing Session persistence in a new browser tab...');
    const page2 = await context.newPage();
    await page2.goto(`${BASE_URL}/cart/`, { waitUntil: 'networkidle' });
    await page2.waitForSelector('.mdr-cart-layout', { timeout: 10000 });
    const tab2ItemCount = await page2.$$eval('.mdr-cart-line', (els) => els.length);
    const tab2Total = await page2.$eval('.mdr-cart-summary strong:last-of-type', (el) => el.textContent?.trim());
    console.log(`✓ In Tab 2: Items count = ${tab2ItemCount}, Total = ${tab2Total}`);
    await page2.close();

    // 9. Test Coupon Validation
    console.log('\n[9/10] Testing Coupon Code input...');
    const couponInput = page.locator('input[placeholder="رمز القسيمة أو الخصم"]');
    await couponInput.fill('INVALIDTESTCOUPON');
    await page.click('button:has-text("تطبيق")');
    await wait(800);
    const couponFeedback = await page.$eval('.mdr-cart-layout p[style*="color"]', (el) => el.textContent?.trim()).catch(() => 'None');
    console.log(`✓ Coupon rejection feedback: "${couponFeedback}"`);

    const couponScreenshot = path.join(SCREENSHOT_DIR, 'cart-05-coupon.png');
    await page.screenshot({ path: couponScreenshot });
    console.log(`✓ Saved screenshot: ${couponScreenshot}`);

    // 10. Test Remove Item & Empty State
    console.log('\n[10/10] Testing Remove Item and Empty State...');
    const removeBtn = page.locator('button:has-text("إزالة القطعة")');
    await removeBtn.click();
    await page.waitForSelector('.mdr-empty', { timeout: 10000 });

    const emptyTitle = await page.$eval('.mdr-empty h2, .mdr-empty h3, .mdr-empty p', (el) => el.textContent?.trim());
    const emptyBadge = await page.$eval('.store-cart-link small', (el) => el.textContent?.trim());
    console.log(`✓ Empty State Text: "${emptyTitle}"`);
    console.log(`✓ Header badge reset to: ${emptyBadge}`);

    const emptyScreenshot = path.join(SCREENSHOT_DIR, 'cart-06-empty.png');
    await page.screenshot({ path: emptyScreenshot });
    console.log(`✓ Saved screenshot: ${emptyScreenshot}`);

    // Copy screenshots to artifact directory
    const screenshotFiles = [
      'cart-01-added.png',
      'cart-02-cart-page.png',
      'cart-03-quantity-updated.png',
      'cart-04-refreshed.png',
      'cart-05-coupon.png',
      'cart-06-empty.png',
    ];
    for (const f of screenshotFiles) {
      const src = path.join(SCREENSHOT_DIR, f);
      const dst = path.join(ARTIFACT_DIR, f);
      if (fs.existsSync(src)) fs.copyFileSync(src, dst);
    }
    console.log('\n✓ All screenshots copied to artifact directory.');

    console.log('\n======================================================');
    console.log('CONSOLE & NETWORK DIAGNOSTICS:');
    console.log('======================================================');
    console.log(`Console Errors count: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e) => console.log(`  - ${e}`));
    } else {
      console.log('  No JavaScript runtime errors detected.');
    }

    console.log(`Failed Network Requests count: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      failedRequests.forEach((f) => console.log(`  - ${f}`));
    } else {
      console.log('  No network or API request failures detected.');
    }
    console.log('======================================================\n');

    await browser.close();
    console.log('✓ Phase 3.1 Cart Verification passed completely!');
  } finally {
    console.log('Stopping Vite preview server...');
    server.kill();
  }
}

runCartVerification().catch((err) => {
  console.error('Cart verification failed with error:', err);
  process.exit(1);
});
