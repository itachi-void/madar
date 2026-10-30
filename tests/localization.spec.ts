import { test, expect, type Page } from "@playwright/test"
import pages from "../src/content/pages.json" with { type: "json" }
import authored from "../src/content/authored-pages.json" with { type: "json" }
import catalog from "../src/content/catalog.json" with { type: "json" }
import en from "../src/i18n/locales/en.json" with { type: "json" }
import fr from "../src/i18n/locales/fr.json" with { type: "json" }
import es from "../src/i18n/locales/es.json" with { type: "json" }
import sa from "../src/i18n/locales/sa.json" with { type: "json" }
import {
  locales,
  localePath,
  stripLocale,
  switchLocalePath,
} from "../src/i18n/config.ts"
import { createTranslator } from "../src/i18n/translate.ts"

const dictionaries = { en, fr, es, sa }
const versions = locales.filter((locale) => locale.code !== "eg")
const product = catalog.find((item) => item.id === 86)!
const routes = [
  ...new Set([
    "/",
    ...pages.map((page) => page.path),
    ...authored.map((page) => page.path),
    "/checkout/",
    "/checkout/order-received/",
    "/my-account/orders/",
    "/my-account/edit-address/",
    "/my-account/edit-account/",
    "/my-account/reset-password/",
    "/unknown-page/",
  ]),
]

async function untranslated(page: Page) {
  return page.locator("body").evaluate((body) => {
    const found: string[] = []
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      if (
        node.parentElement?.closest(
          "select, script, style, pre, code, [translate=no]",
        )
      )
        continue
      if (/[\u0600-\u06ff]/.test(node.textContent || ""))
        found.push((node.textContent || "").trim())
    }
    for (const element of body.querySelectorAll(
      "[aria-label], [alt], [placeholder]",
    )) {
      if (element.closest("select, [translate=no]")) continue
      for (const attribute of ["aria-label", "alt", "placeholder"]) {
        const value = element.getAttribute(attribute) || ""
        if (/[\u0600-\u06ff]/.test(value)) found.push(value)
      }
    }
    for (const input of body.querySelectorAll<HTMLInputElement>(
      "input[type=submit], input[type=button], input[type=reset]",
    )) {
      if (/[\u0600-\u06ff]/.test(input.value)) found.push(input.value)
    }
    return [...new Set(found)]
  })
}

for (const locale of versions) {
  test(`${locale.code}: all 50 page routes are localized, linked and responsive`, async ({
    page,
  }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    for (const route of routes) {
      await page.goto(locale.prefix + encodeURI(route))
      await expect(page.locator("main#mdr-main")).toHaveCount(1)
      await expect(page.locator("main h1")).toBeVisible()
      await expect(page.locator("html")).toHaveAttribute("lang", locale.lang)
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        locale.direction,
      )
      await expect(page.locator("#mdr-language")).toHaveValue(locale.code)
      if (locale.direction === "ltr")
        expect(await untranslated(page), route).toEqual([])
      const links = await page
        .locator("header a[href^='/'], footer a[href^='/']")
        .evaluateAll((anchors) =>
          anchors.map((anchor) => anchor.getAttribute("href")!),
        )
      expect(links.every((link) => link.startsWith(locale.prefix + "/"))).toBe(
        true,
      )
      await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
        "href",
        new RegExp(locale.prefix + "/"),
      )
      await expect(page.locator("link[rel=alternate][hreflang]")).toHaveCount(5)
    }
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 900 })
      for (const route of [
        "/",
        "/shop/",
        product.path,
        "/my-account/",
        "/about/",
        "/help/",
        "/size-guide/",
        "/policies/",
        "/style-finder/",
      ]) {
        await page.goto(locale.prefix + encodeURI(route))
        await expect(page.locator("main h1")).toBeVisible()
        await page.waitForLoadState("networkidle")
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth,
          ),
          `${width}px ${route}`,
        ).toBeLessThanOrEqual(1)
      }
    }
    await page.goto(locale.prefix + "/?page_id=3")
    await expect(page).toHaveURL(
      new RegExp(locale.prefix + "/policies/#privacy$"),
    )
    await expect(page.locator("meta[name=robots]")).toHaveAttribute(
      "content",
      "noindex, nofollow",
    )
    expect(errors).toEqual([])
  })

  test(`${locale.code}: product, validation, demo checkout and account states work in this language`, async ({
    page,
  }) => {
    const t = createTranslator(
      locale,
      dictionaries[(locale.code as keyof typeof dictionaries)],
    )
    const submissions: string[] = []
    page.on("request", (request) => {
      if (!["GET", "HEAD"].includes(request.method()))
        submissions.push(request.url())
    })
    await page.goto(locale.prefix + encodeURI(product.path))
    await page.locator(".mdr-swatches button:not([disabled])").first().click()
    await page.locator(".single_add_to_cart_button").click()
    await page.locator(".mdr-preview-toast a").click()
    await expect(page).toHaveURL(new RegExp(locale.prefix + "/cart/$"))
    await expect(page.locator(".mdr-cart-line")).toContainText(t(product.name))
    if (locale.direction === "ltr") expect(await untranslated(page)).toEqual([])
    await page.locator(".mdr-cart-summary .mdr-btn").click()
    await page
      .getByRole("button", { name: t("متابعة إلى طريقة الدفع"), exact: true })
      .click()
    await expect(page.locator("#checkoutName")).toHaveAttribute(
      "aria-invalid",
      "true",
    )
    await page.locator("#checkoutName").fill("Demo User")
    await page.locator("#checkoutEmail").fill("demo@example.test")
    await page
      .locator("#checkoutPhone")
      .fill(locale.code === "sa" ? "0501234567" : "+33612345678")
    await page.locator("#checkoutCity").fill("Demo City")
    await page.locator("#checkoutAddress").fill("Demo address 10")
    await page
      .getByRole("button", { name: t("متابعة إلى طريقة الدفع"), exact: true })
      .click()
    await page
      .getByRole("radio", { name: new RegExp(t("البطاقة البنكية — محاكاة")) })
      .check()
    await page
      .getByRole("radio", { name: t("محاكاة رفض الدفع"), exact: true })
      .check()
    await page.locator("main form button[type=submit]").click()
    if (locale.direction === "ltr") expect(await untranslated(page)).toEqual([])
    await page.locator("#checkoutConsent").check()
    await page
      .getByRole("button", { name: t("إتمام المعاينة"), exact: true })
      .click()
    await expect(page.getByRole("alert")).toContainText(
      t(
        "محاكاة رفض الدفع: لم تتم أي عملية ولم يُخصم أي مبلغ. جرّب حالة النجاح أو اختر الدفع عند الاستلام.",
      ),
    )
    await page
      .getByRole("button", { name: t("تعديل الطريقة"), exact: true })
      .click()
    await page
      .getByRole("radio", { name: t("محاكاة نجاح الدفع"), exact: true })
      .check()
    await page.locator("main form button[type=submit]").click()
    await page
      .getByRole("button", { name: t("إتمام المعاينة"), exact: true })
      .click()
    await expect(page).toHaveURL(
      new RegExp(locale.prefix + "/checkout/order-received/$"),
    )
    await page.getByRole("link", { name: t("الحساب"), exact: true }).click()
    await page
      .getByRole("button", {
        name: t("تصفّح لوحة الحساب التجريبية"),
        exact: false,
      })
      .click()
    await expect(page.locator(".mdr-account-nav")).toBeVisible()
    await page
      .locator(`.mdr-account-nav a[href="${locale.prefix}/my-account/orders/"]`)
      .click()
    await expect(page.locator(".mdr-order-preview")).toBeVisible()
    if (locale.direction === "ltr") expect(await untranslated(page)).toEqual([])
    expect(submissions).toEqual([])
  })
}

test("language switching keeps the current page, query, bag and history without changing product prices", async ({
  page,
}) => {
  await page.goto("/en" + encodeURI(product.path))
  await page.locator(".mdr-swatches button:not([disabled])").first().click()
  await page.locator(".single_add_to_cart_button").click()
  await page.locator(".mdr-preview-toast a").click()
  await page.locator("#mdr-language").selectOption("fr")
  await expect(page).toHaveURL(/\/fr\/cart\/$/)
  await expect(page.locator(".mdr-cart-line")).toHaveCount(1)
  await expect(page.locator(".mdr-cart-summary")).toContainText("790,00 EGP")
  await page.locator("#mdr-language").selectOption("sa")
  await expect(page).toHaveURL(/\/sa\/cart\/$/)
  await expect(page.locator(".mdr-region-note")).toContainText("بالجنيه المصري")
  await expect(page.locator(".mdr-cart-line")).toHaveCount(1)
  await page.locator("#mdr-language").selectOption("eg")
  await expect(page).toHaveURL(/\/cart\/$/)
  await expect(page.locator(".mdr-cart-summary")).toContainText("790.00")
  await page.goBack()
  await expect(page).toHaveURL(/\/sa\/cart\/$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "ar-SA")
  await page.goto("/en/shop/?orderby=price")
  await page.locator("#mdr-language").selectOption("es")
  await expect(page).toHaveURL(/\/es\/shop\/\?orderby=price$/)
})

test("the retry screen stays in the requested language if its language chunk fails", async ({
  page,
}) => {
  const pattern = "**/src/i18n/locales/fr.json*"
  await page.route(pattern, (route) => route.abort())
  await page.goto("/fr/")
  await expect(page.locator("main h1")).toHaveText(
    "Impossible de charger la page.",
  )
  await expect(page.locator("html")).toHaveAttribute("lang", "fr")
  await expect(
    page.getByRole("button", { name: "Réessayer", exact: true }),
  ).toBeVisible()
  await page.unroute(pattern)
  await page.getByRole("button", { name: "Réessayer", exact: true }).click()
  await expect(page.locator("main h1")).toContainText("Une présence discrète.")
})

test("localized paths preserve canonical slugs and never prefix assets or external links", () => {
  expect(localePath("/shop/?s=coat", "fr")).toBe("/fr/shop/?s=coat")
  expect(localePath("/shop/?s=shirt.com", "fr")).toBe("/fr/shop/?s=shirt.com")
  expect(localePath("/en/shop/", "fr")).toBe("/en/shop/")
  expect(switchLocalePath("/en/shop/", "fr")).toBe("/fr/shop/")
  expect(switchLocalePath("/fr/shop/", "eg")).toBe("/shop/")
  expect(stripLocale("/es/product/example/")).toBe("/product/example/")
  expect(localePath("/images/coat-camel.jpg", "sa")).toBe(
    "/images/coat-camel.jpg",
  )
  expect(localePath("https://example.test/", "fr")).toBe(
    "https://example.test/",
  )
  for (const locale of versions) {
    const t = createTranslator(
      locale,
      dictionaries[(locale.code as keyof typeof dictionaries)],
    )
    expect(t("المتجر")).not.toBe("")
    expect(t("نتائج البحث عن «coat»")).toContain("coat")
    expect(t("إظهار كلمة المرور")).not.toMatch(
      locale.direction === "ltr" ? /[\u0600-\u06ff]/ : /مصري/,
    )
  }
})
