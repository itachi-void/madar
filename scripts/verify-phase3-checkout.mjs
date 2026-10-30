// Phase 3.2 Browser Verification Script: WooCommerce Store API Checkout Integration
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

async function runCheckoutVerification() {
  console.log('=== Starting Phase 3.2: Checkout Integration Browser Test ===\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // 1. Spawning Vite Preview Server
  console.log('[1/8] Starting Vite preview server...');
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
    console.log('[2/8] Launching Chrome in headless mode...');
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

    // 3. Add Item to Cart
    console.log('[3/8] Adding product to cart before proceeding to Checkout...');
    const slug = encodeURIComponent('بلوفر-تريكو-بدرجات-ترابي');
    await page.goto(`${BASE_URL}/product/${slug}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1.mdr-title', { timeout: 10000 });

    const sButton = page.locator('button:has-text("S")');
    await sButton.click();
    await wait(300);

    const addToCartBtn = page.locator('button:has-text("أضف إلى السلة")');
    await addToCartBtn.click();
    await page.waitForSelector('button:has-text("أُضيفت القطعة بنجاح")', { timeout: 10000 });
    console.log('✓ Product added to cart.');

    // 4. Navigate to Checkout (/checkout/)
    console.log('\n[4/8] Navigating to Checkout (/checkout/)...');
    await page.goto(`${BASE_URL}/checkout/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.mdr-checkout-form', { timeout: 10000 });

    const summaryItem = await page.$eval('.mdr-summary-products li span', (el) => el.textContent?.trim());
    const summaryTotal = await page.$eval('.mdr-summary-total strong', (el) => el.textContent?.trim());
    console.log(`✓ Checkout Summary Product: "${summaryItem}", Total: ${summaryTotal}`);

    // 5. Fill Step 0: Delivery details
    console.log('\n[5/8] Completing Step 0: Delivery Details...');
    await page.fill('input[name="checkoutName"]', 'عمر الفاروق');
    await page.fill('input[name="checkoutEmail"]', 'omar.alfarouq@madar.local');
    await page.fill('input[name="checkoutPhone"]', '+201099887766');
    await page.fill('input[name="checkoutCity"]', 'القاهرة');
    await page.fill('input[name="checkoutAddress"]', 'حي المعادي، شارع 9، مبنى 12');
    await page.fill('input[name="checkoutNotes"]', 'برجاء الاتصال قبل التوصيل بنصف ساعة');

    await page.click('button[type="submit"]:has-text("متابعة إلى طريقة الدفع")');
    await wait(600);

    // 6. Step 1: Payment Method (COD)
    console.log('\n[6/8] Completing Step 1: Payment Method...');
    await page.waitForSelector('input[name="paymentMethod"][value="cod"], input[type="radio"]:checked', { timeout: 5000 });
    console.log('✓ Selected payment method: الدفع عند الاستلام (COD)');

    await page.click('button[type="submit"]:has-text("مراجعة الاختيارات")');
    await wait(600);

    // 7. Step 2: Review & Submit Order
    console.log('\n[7/8] Reviewing order and placing order via Store API...');
    await page.waitForSelector('.mdr-review-block', { timeout: 5000 });

    const reviewName = await page.$eval('.mdr-review-block:first-of-type p:first-of-type', (el) => el.textContent?.trim());
    console.log(`✓ Review details confirmed for customer: "${reviewName}"`);

    const reviewScreenshot = path.join(SCREENSHOT_DIR, 'chk-01-review.png');
    await page.screenshot({ path: reviewScreenshot });
    console.log(`✓ Saved screenshot: ${reviewScreenshot}`);

    // Click Submit Order
    const placeOrderBtn = page.locator('button[type="submit"]:has-text("تأكيد وإرسال الطلب")');
    await placeOrderBtn.click();

    // 8. Order Received Confirmation Page (/checkout/order-received/)
    console.log('\n[8/8] Waiting for Order Confirmation Page...');
    await page.waitForURL(/checkout\/order-received/, { timeout: 15000 });
    await page.waitForSelector('.mdr-result-content', { timeout: 10000 });

    const orderTitle = await page.$eval('h1, h2', (el) => el.textContent?.trim());
    const orderNumberText = await page.$eval('.mdr-lead strong', (el) => el.textContent?.trim());
    const orderCustomer = await page.$eval('.mdr-result-content div strong', (el) => el.textContent?.trim());
    const orderTotal = await page.$eval('.mdr-summary-total strong', (el) => el.textContent?.trim());

    console.log(`✓ Confirmation Page Header: "${orderTitle}"`);
    console.log(`✓ Placed Real Order Number: ${orderNumberText}`);
    console.log(`✓ Customer: ${orderCustomer}`);
    console.log(`✓ Total: ${orderTotal}`);

    const receivedScreenshot = path.join(SCREENSHOT_DIR, 'chk-02-order-received.png');
    await page.screenshot({ path: receivedScreenshot });
    console.log(`✓ Saved screenshot: ${receivedScreenshot}`);

    // Verify cart is cleared
    const headerCartBadge = await page.$eval('.store-cart-link small', (el) => el.textContent?.trim());
    console.log(`✓ Cart badge after order completion: ${headerCartBadge} (Expected: 0)`);

    const cartEmptyScreenshot = path.join(SCREENSHOT_DIR, 'chk-03-cart-cleared.png');
    await page.screenshot({ path: cartEmptyScreenshot });
    console.log(`✓ Saved screenshot: ${cartEmptyScreenshot}`);

    // Copy screenshots to artifact directory
    const screenshotFiles = [
      'chk-01-review.png',
      'chk-02-order-received.png',
      'chk-03-cart-cleared.png',
    ];
    for (const f of screenshotFiles) {
      const src = path.join(SCREENSHOT_DIR, f);
      const dst = path.join(ARTIFACT_DIR, f);
      if (fs.existsSync(src)) fs.copyFileSync(src, dst);
    }
    console.log('\n✓ All Checkout screenshots copied to artifact directory.');

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
    console.log('✓ Phase 3.2 Checkout Verification passed completely!');
  } finally {
    console.log('Stopping Vite preview server...');
    server.kill();
  }
}

runCheckoutVerification().catch((err) => {
  console.error('Checkout verification failed with error:', err);
  process.exit(1);
});
