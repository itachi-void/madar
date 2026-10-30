import { test, expect, type Page } from "@playwright/test"
import pages from "../src/content/pages.json" with { type: "json" }
import catalog from "../src/content/catalog.json" with { type: "json" }
import authoredPages from "../src/content/authored-pages.json" with { type: "json" }

const product = catalog.find((item) => item.id === 86)!
const extraRoutes = [
  "/checkout/",
  "/checkout/order-received/",
  "/my-account/orders/",
  "/my-account/edit-address/",
  "/my-account/edit-account/",
  "/my-account/reset-password/",
  ...authoredPages.map((page) => page.path),
]

async function openProduct(page: Page) {
  await page.goto(encodeURI(product.path))
  await expect(page.locator(".mdr-swatches button").first()).toBeVisible()
}
async function addProduct(page: Page) {
  await openProduct(page)
  await page.locator(".mdr-swatches button:not([disabled])").first().click()
  await page.locator(".single_add_to_cart_button").click()
  await page.locator(".mdr-preview-toast a").click()
  await expect(page.locator(".mdr-cart-line")).toHaveCount(1)
}
async function openCheckout(page: Page) {
  await addProduct(page)
  await page.locator(".mdr-cart-summary .mdr-btn").click()
  await expect(page).toHaveURL(/\/checkout\/$/)
}
async function fillDelivery(page: Page) {
  await page.locator("#checkoutName").fill("معاينة مدار")
  await page.locator("#checkoutEmail").fill("preview@example.test")
  await page.locator("#checkoutPhone").fill("01012345678")
  await page.locator("#checkoutCity").fill("القاهرة — تجريبي")
  await page.locator("#checkoutAddress").fill("عنوان تجريبي، مبنى ١")
  await page.getByRole("button", { name: "متابعة إلى طريقة الدفع" }).click()
}

for (const width of [1440, 390, 768]) {
  test(`all captured routes and new UI routes render at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = []
    const consoleErrors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text())
    })
    await page.setViewportSize({ width, height: 1000 })
    for (const path of [
      "/",
      ...pages.map((item) => item.path),
      ...extraRoutes,
      "/unknown-page/",
    ]) {
      await page.goto(encodeURI(path))
      await page.waitForLoadState("networkidle")
      await expect(page.locator("main#mdr-main")).toHaveCount(1)
      await expect(page.locator("main h1")).toBeVisible()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, `${width}px ${path}`).toBeLessThanOrEqual(1)
    }
    expect(errors).toEqual([])
    expect(consoleErrors).toEqual([])
  })
}

test("shop ordering, search, galleries, drawers, keyboard tabs, cart and favorites", async ({
  page,
}) => {
  await page.goto("/shop/?orderby=price")
  await expect(
    page.locator('#mdr-nav a[href="/shop/?orderby=date"]'),
  ).not.toHaveAttribute("aria-current", "page")
  await expect(page.locator("main li.product")).toHaveCount(16)
  await expect
    .poll(async () => page.locator("main li.product").evaluateAll((cards) => {
        const prices = cards.map((card) =>
          Number((card as HTMLElement).dataset.mdrPrice),
        )
        return prices.every(
          (price, index) => index === 0 || price >= prices[index - 1],
        )
      }))
    .toBe(true)
  await page.locator('[data-mdr-open="mdr-filters"]').click()
  await expect(page.locator("#mdr-filters")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.locator("#mdr-filters")).not.toBeVisible()
  await expect(page.locator('[data-mdr-open="mdr-filters"]')).toBeFocused()
  await openProduct(page)
  await page.locator(".mdr-gallery-thumbs button").nth(1).click()
  await expect(
    page.locator(".mdr-gallery-thumbs button").nth(1),
  ).toHaveAttribute("aria-pressed", "true")
  await page
    .locator('.woocommerce-product-gallery__image[data-active="true"] a')
    .click()
  await expect(page.locator(".mdr-image-dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await page.locator(".woocommerce-tabs ul.tabs a").first().focus()
  await page.keyboard.press("ArrowLeft")
  await expect(
    page.locator(".woocommerce-tabs ul.tabs a").nth(1),
  ).toHaveAttribute("aria-selected", "true")
  await page.locator('[data-mdr-open="mdr-size-guide"]').click()
  await expect(page.locator("#mdr-size-guide")).toBeVisible()
  await page.keyboard.press("Escape")
  await page.locator(".mdr-swatches button:not([disabled])").first().click()
  await page.locator(".single_add_to_cart_button").click()
  await page.locator(".mdr-preview-toast a").click()
  await page.locator(".mdr-cart-line input").fill("2")
  await expect(page.locator(".mdr-cart-summary")).toContainText("1,580.00")
  await page.locator(".mdr-cart-line button").click()
  await expect(page.locator(".mdr-empty")).toBeVisible()
  await page.goto("/")
  await page.locator(".store-card-fav").first().click()
  await page.locator('a[href="/my-account/?view=favorites"]').first().click()
  await expect(page.locator("main .store-product-card")).toHaveCount(1)
  await page.getByRole("button", { name: /إزالة .* من المفضلة/ }).click()
  await expect(page.locator(".mdr-empty")).toBeVisible()
  await page.getByRole("button", { name: "البحث", exact: true }).click()
  await page.locator("#mdr-search-input").fill("معطف")
  await page.locator("#mdr-search button").click()
  await expect(page.locator("main li.product:visible")).toHaveCount(2)
  await page.getByRole("button", { name: "البحث", exact: true }).click()
  await page.locator("#mdr-search-input").fill("no-matching-product")
  await page.locator("#mdr-search button").click()
  await expect(page.locator(".mdr-search-empty")).toBeVisible()
})

test("checkout validates, preserves edits, simulates refusal and completes without network submissions", async ({
  page,
}) => {
  const submissions: string[] = []
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method()))
      submissions.push(request.url())
  })
  await openCheckout(page)
  await page.getByRole("button", { name: "متابعة إلى طريقة الدفع" }).click()
  await expect(page.locator("#checkoutName")).toHaveAttribute(
    "aria-invalid",
    "true",
  )
  await fillDelivery(page)
  await page.getByRole("radio", { name: /البطاقة البنكية — محاكاة/ }).check()
  await page
    .getByRole("radio", { name: "محاكاة رفض الدفع", exact: true })
    .check()
  await page
    .getByRole("button", { name: "مراجعة الاختيارات", exact: true })
    .last()
    .click()
  await page
    .getByRole("button", { name: "إتمام المعاينة", exact: true })
    .click()
  await expect(page.getByRole("alert")).toContainText("أكّد")
  await page.locator("#checkoutConsent").check()
  await page
    .getByRole("button", { name: "إتمام المعاينة", exact: true })
    .click()
  await expect(
    page.getByRole("button", { name: "جارٍ تشغيل المحاكاة…" }),
  ).toBeDisabled()
  await expect(page.getByRole("alert")).toContainText("محاكاة رفض الدفع")
  await page.getByRole("button", { name: "تعديل البيانات" }).click()
  await expect(page.locator("#checkoutName")).toHaveValue("معاينة مدار")
  await page.getByRole("button", { name: "متابعة إلى طريقة الدفع" }).click()
  await page
    .getByRole("radio", { name: "محاكاة نجاح الدفع", exact: true })
    .check()
  await page
    .getByRole("button", { name: "مراجعة الاختيارات", exact: true })
    .last()
    .click()
  await page
    .getByRole("button", { name: "إتمام المعاينة", exact: true })
    .click()
  await expect(page).toHaveURL(/\/checkout\/order-received\/$/)
  await expect(page.locator("main h1")).toContainText("اكتملت المعاينة")
  await expect(page.locator(".mdr-checkout-summary")).toContainText("790.00")
  await page.locator('a[href="/cart/"]').first().click()
  await expect(page.locator(".mdr-empty")).toBeVisible()
  expect(submissions).toEqual([])
  await page.reload()
  await expect(page.locator(".mdr-empty")).toBeVisible()
})

test("account, registration, recovery, address and profile states are explicitly demo-only", async ({
  page,
}) => {
  const submissions: string[] = []
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method()))
      submissions.push(request.url())
  })
  await page.goto("/my-account/")
  await page
    .getByRole("button", { name: "تسجيل جديد — تجريبي", exact: true })
    .click()
  await expect(page.locator("#registerEmail")).toHaveAttribute(
    "aria-invalid",
    "true",
  )
  await page.locator("#registerEmail").fill("demo@example.test")
  await page.locator("#registerPassword").fill("preview-password")
  await page.locator("#registerConfirm").fill("different-password")
  await page
    .getByRole("button", { name: "تسجيل جديد — تجريبي", exact: true })
    .click()
  await expect(page.locator("#registerConfirm-error")).toContainText(
    "غير متطابقتين",
  )
  await page.locator("#registerConfirm").fill("preview-password")
  await page
    .getByRole("button", { name: "تسجيل جديد — تجريبي", exact: true })
    .click()
  await expect(page.locator(".mdr-account-nav")).toBeVisible()
  await page.locator('.mdr-account-nav a[href="/my-account/orders/"]').click()
  await expect(page.locator(".mdr-empty")).toContainText("لا توجد طلبات")
  await page
    .locator('.mdr-account-nav a[href="/my-account/edit-address/"]')
    .click()
  await page.getByRole("button", { name: "معاينة التعديل" }).click()
  await expect(page.locator("#accountName")).toHaveAttribute(
    "aria-invalid",
    "true",
  )
  await page.locator("#accountName").fill("اسم تجريبي")
  await page.locator("#accountPhone").fill("01012345678")
  await page.locator("#accountCity").fill("القاهرة")
  await page.locator("#accountAddress").fill("عنوان تجريبي")
  await page.getByRole("button", { name: "معاينة التعديل" }).click()
  await expect(
    page.locator(".mdr-account-content [role=status]"),
  ).toContainText("لم تُرسل")
  await page
    .locator('.mdr-account-nav a[href="/my-account/edit-account/"]')
    .click()
  await expect(page.locator("#accountEmail")).toBeVisible()
  await page.locator("#accountName").fill("اسم تجريبي")
  await page.locator("#accountEmail").fill("demo@example.test")
  await page.getByRole("button", { name: "معاينة التعديل" }).click()
  await expect(
    page.locator(".mdr-account-content [role=status]"),
  ).toContainText("بنجاح")
  await page.getByRole("button", { name: "إنهاء معاينة الحساب" }).click()
  await page.locator("#username").fill("demo")
  await page.locator("#loginPassword").fill("preview-only")
  await page
    .getByRole("button", { name: "إظهار كلمة المرور", exact: true })
    .first()
    .click()
  await expect(page.locator("#loginPassword")).toHaveAttribute("type", "text")
  await page
    .getByRole("button", { name: "تسجيل الدخول — تجريبي", exact: true })
    .click()
  await expect(page.locator(".mdr-account-nav")).toBeVisible()
  await page.getByRole("button", { name: "إنهاء معاينة الحساب" }).click()
  await page.getByRole("link", { name: "نسيت كلمة مرورك؟" }).click()
  await page.locator("#recoveryUsername").fill("demo@example.test")
  await page.getByRole("button", { name: "معاينة طلب الاستعادة" }).click()
  await expect(page.locator(".mdr-password-page [role=status]")).toContainText(
    "لم يُرسل بريد",
  )
  await page.getByRole("link", { name: "معاينة تعيين كلمة مرور" }).click()
  await page.locator("#newPassword").fill("preview-password")
  await page.locator("#confirmPassword").fill("preview-password")
  await page.getByRole("button", { name: "معاينة تغيير كلمة المرور" }).click()
  await expect(page.locator(".mdr-password-page [role=status]")).toContainText(
    "لم تتغير",
  )
  expect(submissions).toEqual([])
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 })
})

test("mobile keyboard navigation, motion preferences, local fonts and per-route metadata", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await expect(page.locator(".motion-curtain")).toBeHidden()
  await page.getByRole("button", { name: "القائمة", exact: true }).click()
  await expect(page.locator("#mdr-nav a").first()).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(
    page.getByRole("button", { name: "القائمة", exact: true }),
  ).toBeFocused()
  await expect(
    page.getByRole("button", { name: "القائمة", exact: true }),
  ).toHaveAttribute("aria-expanded", "false")
  await page.getByRole("button", { name: "البحث", exact: true }).click()
  await page.keyboard.press("Escape")
  await expect(
    page.getByRole("button", { name: "البحث", exact: true }),
  ).toBeFocused()
  await page.evaluate(() => document.fonts.ready)
  expect(
    await page.evaluate(() => document.fonts.check('400 14px "Alexandria"')),
  ).toBe(true)
  expect(
    await page.evaluate(() =>
      document.fonts.check('400 40px "Noto Naskh Arabic"'),
    ),
  ).toBe(true)
  await openProduct(page)
  await expect(page).toHaveTitle(`${product.name} — مدار`)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    new RegExp(product.name),
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator("#mdr-route-schema")).toHaveCount(1)
  await page.getByRole("link", { name: "الحساب", exact: true }).click()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  )
  await expect(page.locator("#mdr-route-schema")).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveTitle(`${product.name} — مدار`)
})

test("mobile COD preview, scroll restoration and the moving-strip pause control", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openCheckout(page)
  await fillDelivery(page)
  await expect(
    page.getByRole("radio", { name: /الدفع عند الاستلام/ }),
  ).toBeChecked()
  await page
    .getByRole("button", { name: "مراجعة الاختيارات", exact: true })
    .last()
    .click()
  await page.locator("#checkoutConsent").check()
  await page
    .getByRole("button", { name: "إتمام المعاينة", exact: true })
    .click()
  await expect(page).toHaveURL(/\/checkout\/order-received\/$/)
  await expect(page.locator(".mdr-result-content")).toContainText(
    "الدفع عند الاستلام",
  )
  await page.goto("/")
  const pause = page.getByRole("button", { name: "إيقاف الشريط المتحرك" })
  await pause.focus()
  await page.keyboard.press("Space")
  await expect(page.locator(".quiet-marquee")).toHaveAttribute(
    "data-paused",
    "true",
  )
  const productLink = page.locator("#shop .store-card-meta a").first()
  await productLink.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  )
  // Playwright may scroll again when clicking; record the actual departure.
  await productLink.evaluate((element) =>
    element.addEventListener(
      "click",
      () => {
        document.documentElement.dataset.testNavigationScroll = String(
          window.scrollY,
        )
      },
      { capture: true, once: true },
    ),
  )
  await productLink.click()
  const position = await page.evaluate(() =>
    Number(document.documentElement.dataset.testNavigationScroll),
  )
  expect(Number.isFinite(position)).toBe(true)
  await expect(page.locator(".woocommerce-product-gallery")).toBeVisible()
  await page.goBack()
  await expect
    .poll(async () => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(position - 100)
})
