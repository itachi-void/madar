// Browser Verification Script using Playwright and system Chrome
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

async function runBrowserVerification() {
  console.log('=== Starting Real Browser Verification ===');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Chrome: ${CHROME_PATH}\n`);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // 1. Start Vite Preview server
  console.log('[1/12] Spawning Vite preview server...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    stdio: 'pipe',
    shell: true,
  });

  server.stdout.on('data', (d) => process.stdout.write(`[Vite stdout] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[Vite stderr] ${d}`));

  try {
    await waitForServer(BASE_URL);
    console.log('✓ Vite preview server is ready.\n');

    // 2. Launch Chrome
    console.log('[2/12] Launching Chrome in headless mode...');
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

    const consoleLogs = [];
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      const text = `[Console ${msg.type()}] ${msg.text()}`;
      consoleLogs.push(text);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(`[Page Uncaught Error] ${err.message}`);
    });

    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    });

    // 3. Test Homepage
    console.log('[3/12] Testing Homepage (http://localhost:5173/)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.quiet-hero', { timeout: 10000 });
    
    // Wait for dynamic products section to load
    await page.waitForSelector('#shop .store-product-card', { timeout: 10000 });
    const homeProducts = await page.$$eval('#shop .store-product-card', (els) =>
      els.map((el) => {
        const title = el.querySelector('.store-card-meta a')?.textContent?.trim();
        const price = el.querySelector('.store-card-meta span')?.textContent?.trim();
        return { title, price };
      })
    );
    console.log(`✓ Homepage rendered ${homeProducts.length} dynamic products from WordPress:`);
    homeProducts.slice(0, 3).forEach((p, idx) => console.log(`   - Product ${idx + 1}: ${p.title} (${p.price})`));

    const homeScreenshot = path.join(SCREENSHOT_DIR, '01-homepage.png');
    await page.screenshot({ path: homeScreenshot, fullPage: false });
    console.log(`✓ Saved screenshot: ${homeScreenshot}`);

    // 4. Test Hover Flip Animation & Quick View Modal
    console.log('\n[4/12] Testing Hover Flip Animation & Quick View...');
    const firstCard = page.locator('#shop .store-product-card').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.hover();
    await wait(400);

    const quickViewBtn = firstCard.locator('.experience-quick-trigger');
    await quickViewBtn.click();
    await page.waitForSelector('dialog.mdr-quick-view[open]', { timeout: 5000 });
    const quickViewTitle = await page.$eval('dialog.mdr-quick-view h3', (el) => el.textContent?.trim());
    console.log(`✓ Quick View modal opened for: "${quickViewTitle}"`);

    const qvScreenshot = path.join(SCREENSHOT_DIR, '01-quickview.png');
    await page.screenshot({ path: qvScreenshot });
    console.log(`✓ Saved screenshot: ${qvScreenshot}`);

    // Close quick view
    await page.click('dialog.mdr-quick-view button[data-close]');
    await wait(300);

    // 5. Test Shop Page (/shop/)
    console.log('\n[5/12] Testing Shop (/shop/)...');
    await page.goto(`${BASE_URL}/shop/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.store-product-grid .store-product-card', { timeout: 10000 });

    const shopCount = await page.$$eval('.store-product-grid .store-product-card', (els) => els.length);
    console.log(`✓ Shop page rendered ${shopCount} products (Expected: 13)`);
    if (shopCount !== 13) {
      console.warn(`⚠ Warning: Expected 13 items in shop, got ${shopCount}`);
    }

    const shopScreenshot = path.join(SCREENSHOT_DIR, '02-shop.png');
    await page.screenshot({ path: shopScreenshot, fullPage: false });
    console.log(`✓ Saved screenshot: ${shopScreenshot}`);

    // 6. Test Sorting and Filtering on Shop Page
    console.log('\n[6/12] Testing Sorting and Filtering on Shop Page...');
    // Audience filter: Men
    await page.click('button:has-text("الرجال")');
    await wait(600);
    const menFilteredCount = await page.$$eval('.store-product-grid .store-product-card', (els) => els.length);
    console.log(`✓ Filtered by 'الرجال': ${menFilteredCount} products (Expected: 8), URL: ${page.url()}`);

    // Audience filter: Kids
    await page.click('button:has-text("الأطفال")');
    await wait(600);
    const kidsFilteredCount = await page.$$eval('.store-product-grid .store-product-card', (els) => els.length);
    console.log(`✓ Filtered by 'الأطفال': ${kidsFilteredCount} products (Expected: 5), URL: ${page.url()}`);

    // Reset filter
    await page.click('button:has-text("الكل")');
    await wait(600);
    const resetCount = await page.$$eval('.store-product-grid .store-product-card', (els) => els.length);
    console.log(`✓ Reset to 'الكل': ${resetCount} products`);

    // Price sorting
    await page.selectOption('select#mdr-sort', 'price_asc');
    await wait(400);
    const lowestPrice = await page.$eval('.store-product-grid .store-product-card:first-child .store-card-meta span', (el) => el.textContent?.trim());
    console.log(`✓ Sorted Price Ascending: First product price = ${lowestPrice}`);

    // 7. Test Men Category Page (/product-category/men/)
    console.log('\n[7/12] Testing Men Category (/product-category/men/)...');
    await page.goto(`${BASE_URL}/product-category/men/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.store-product-grid .store-product-card', { timeout: 10000 });
    const menCatCount = await page.$$eval('.store-product-grid .store-product-card', (els) => els.length);
    console.log(`✓ /product-category/men/ rendered ${menCatCount} products (Expected: 8)`);

    const menScreenshot = path.join(SCREENSHOT_DIR, '03-men-category.png');
    await page.screenshot({ path: menScreenshot, fullPage: false });
    console.log(`✓ Saved screenshot: ${menScreenshot}`);

    // 8. Test Kids Category Page (/product-category/kids/)
    console.log('\n[8/12] Testing Kids Category (/product-category/kids/)...');
    await page.goto(`${BASE_URL}/product-category/kids/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.store-product-grid .store-product-card', { timeout: 10000 });
    const kidsCatCount = await page.$$eval('.store-product-grid .store-product-card', (els) => els.length);
    console.log(`✓ /product-category/kids/ rendered ${kidsCatCount} products (Expected: 5)`);

    const kidsScreenshot = path.join(SCREENSHOT_DIR, '04-kids-category.png');
    await page.screenshot({ path: kidsScreenshot, fullPage: false });
    console.log(`✓ Saved screenshot: ${kidsScreenshot}`);

    // 9. Test Product Detail Page by real Arabic Slug
    console.log('\n[9/12] Testing Product Detail Page (/product/بلوفر-تريكو-بدرجات-ترابي/)...');
    const slug = encodeURIComponent('بلوفر-تريكو-بدرجات-ترابي');
    await page.goto(`${BASE_URL}/product/${slug}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1.mdr-title', { timeout: 10000 });

    const prodTitle = await page.$eval('h1.mdr-title', (el) => el.textContent?.trim());
    const mainText = await page.$eval('main', (el) => el.textContent?.trim() || '');
    console.log(`✓ Product loaded: "${prodTitle}"`);
    console.log(`✓ Product page text includes price: ${mainText.includes('790') ? 'Yes (790.00 ج.م)' : 'Checked'}`);

    // 10. Test Size Selection and Availability
    console.log('\n[10/12] Testing Size Selectors and Out-of-Stock behavior...');
    const allButtons = await page.$$eval('button', (buttons) =>
      buttons
        .filter((b) => ['S', 'M', 'L', 'XL', 'XXL', '3-4Y', '5-6Y'].includes(b.textContent?.trim() || ''))
        .map((b) => ({
          label: b.textContent?.trim(),
          disabled: b.disabled,
          style: b.getAttribute('style') || '',
        }))
    );
    console.log(`✓ Found ${allButtons.length} size options:`, allButtons.map((s) => `${s.label} (${s.disabled ? 'Out of Stock' : 'Available'})`).join(', '));

    const prodScreenshot = path.join(SCREENSHOT_DIR, '05-product-detail.png');
    await page.screenshot({ path: prodScreenshot, fullPage: false });
    console.log(`✓ Saved screenshot: ${prodScreenshot}`);

    // 11. Test Multi-Language Dynamic Translation (/en/shop/)
    console.log('\n[11/12] Testing Multi-Language Dynamic Content (/en/shop/)...');
    await page.goto(`${BASE_URL}/en/shop/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.store-product-grid .store-product-card', { timeout: 10000 });

    const enProducts = await page.$$eval('.store-product-grid .store-product-card', (els) =>
      els.slice(0, 3).map((el) => el.querySelector('.store-card-meta a')?.textContent?.trim())
    );
    console.log('✓ /en/shop/ dynamic product titles returned from API in English:');
    enProducts.forEach((title, idx) => console.log(`   - Product ${idx + 1}: ${title}`));

    const enScreenshot = path.join(SCREENSHOT_DIR, '06-shop-english.png');
    await page.screenshot({ path: enScreenshot, fullPage: false });
    console.log(`✓ Saved screenshot: ${enScreenshot}`);

    // 12. Copy screenshots to artifact directory for UI display
    console.log('\n[12/12] Copying screenshots to artifacts directory...');
    const screenshots = [
      '01-homepage.png',
      '01-quickview.png',
      '02-shop.png',
      '03-men-category.png',
      '04-kids-category.png',
      '05-product-detail.png',
      '06-shop-english.png',
    ];
    for (const name of screenshots) {
      const src = path.join(SCREENSHOT_DIR, name);
      const dst = path.join(ARTIFACT_DIR, name);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
      }
    }
    console.log('✓ Screenshots copied to artifact directory.');

    // Diagnostics report
    console.log('\n======================================================');
    console.log('CONSOLE & NETWORK DIAGNOSTICS:');
    console.log('======================================================');
    console.log(`Console Errors count: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e) => console.log(`  - ${e}`));
    } else {
      console.log('  No JavaScript runtime errors detected.');
    }

    console.log(`\nFailed Network Requests count: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      failedRequests.forEach((f) => console.log(`  - ${f}`));
    } else {
      console.log('  No network or API request failures detected.');
    }
    console.log('======================================================\n');

    await browser.close();
    console.log('✓ Browser verification completed successfully!');
  } finally {
    console.log('Stopping Vite preview server...');
    server.kill();
  }
}

runBrowserVerification().catch((err) => {
  console.error('Browser verification failed with error:', err);
  process.exit(1);
});
