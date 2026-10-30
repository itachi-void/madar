import { test, expect, type Page } from "@playwright/test"
import authoredPages from "../src/content/authored-pages.json" with { type: "json" }
import catalog from "../src/content/catalog.json" with { type: "json" }
import sizeGuide from "../src/content/size-guide.json" with { type: "json" }
import {
  recommendStyle,
  type StyleAnswers,
} from "../src/content/style-edits.ts"

async function completeStyle(page: Page, audience = "عالم الرجال") {
  await page.getByRole("radio", { name: new RegExp(audience) }).check()
  await page.getByRole("button", { name: "التالي", exact: true }).click()
  await page.getByRole("radio", { name: /خروجة مرتّبة/ }).check()
  await page.getByRole("button", { name: "التالي", exact: true }).click()
  await page.getByRole("radio", { name: /تباين هادئ/ }).check()
  await page.getByRole("button", { name: "شوف اختياراتك" }).click()
  await expect(page.locator(".mdr-style-product")).toHaveCount(3)
}

test("authored pages have real content, working navigation and accurate metadata on desktop and mobile", async ({
  page,
}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const content of authoredPages) {
      await page.goto(content.path)
      await expect(page.locator("main h1")).toBeVisible()
      await expect(page.locator(".mdr-unavailable")).toHaveCount(0)
      await expect(page).toHaveTitle(`${content.title} — مدار`)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        content.description,
      )
      await expect(page.locator(".mdr-info-nav a.active")).toHaveAttribute(
        "href",
        content.path,
      )
      await expect(page.locator(".mdr-authored-note")).toContainText(
        "محتوى أصلي",
      )
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
        `${width}px ${content.path}`,
      ).toBeLessThanOrEqual(1)
    }
  }
  await page.goto("/about/")
  await page
    .getByRole("navigation", { name: "عالم مدار والمساعدة" })
    .getByRole("link", { name: "المساعدة", exact: true })
    .click()
  await expect(page).toHaveURL(/\/help\/$/)
})

test("help answers, source-backed size tables and draft privacy links are usable", async ({
  page,
}) => {
  await page.goto("/help/")
  const question = page.getByText("أبدأ باختيار المقاس إزاي؟", { exact: true })
  await question.click()
  await expect(page.locator(".mdr-faq[open]")).toHaveCount(1)
  await page
    .locator(".mdr-faq[open]")
    .getByRole("link", { name: "دليل المقاسات", exact: true })
    .click()
  await expect(page).toHaveURL(/\/size-guide\/$/)
  for (const row of sizeGuide.men) {
    await expect(
      page
        .locator("tbody tr")
        .filter({
          has: page.getByRole("rowheader", { name: row[0], exact: true }),
        }),
    ).toContainText(row.slice(1).join(""))
  }
  await page.getByRole("button", { name: "أطفال", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "أطفال", exact: true }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(page.locator("table caption")).toContainText("أطفال")
  for (const row of sizeGuide.kids) {
    await expect(
      page.getByRole("rowheader", { name: row[0], exact: true }),
    ).toBeVisible()
  }
  await page.goto("/?page_id=3")
  await expect(page).toHaveURL(/\/policies\/#privacy$/)
  await expect(page.locator(".mdr-policy-badge")).toHaveText(
    "مسودة للمراجعة — غير معتمدة",
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  )
  await expect(page.locator("#mdr-route-schema")).toHaveCount(0)
  await expect(page.locator("#privacy")).toBeVisible()
  await page
    .getByRole("navigation", { name: "أقسام السياسات" })
    .getByRole("link", { name: "الشحن والتوصيل", exact: true })
    .click()
  await expect(page).toHaveURL(/#shipping$/)
  await expect(page.locator("#shipping")).toContainText("لم تُعتمد بعد")
  await page.goto("/?page_id=999")
  await expect(page.locator(".mdr-unavailable")).toBeVisible()
})

test("style finder has keyboard choices, editable results, session favorites and a clean restart", async ({
  page,
}) => {
  const submissions: string[] = []
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method()))
      submissions.push(request.url())
  })
  await page.goto("/style-finder/")
  await expect(
    page.getByRole("button", { name: "التالي", exact: true }),
  ).toBeDisabled()
  await page.getByRole("radio", { name: /عالم الرجال/ }).focus()
  await page.keyboard.press("Space")
  await expect(
    page.getByRole("button", { name: "التالي", exact: true }),
  ).toBeEnabled()
  await completeStyle(page)
  await expect(page.locator("#style-question")).toBeFocused()
  const first = page.locator(".mdr-style-product").first()
  const name = await first.locator("h3").innerText()
  await first.getByRole("button", { name: /حفظ .* في المفضلة/ }).click()
  await expect(
    first.getByRole("button", { name: /إزالة .* من المفضلة/ }),
  ).toHaveAttribute("aria-pressed", "true")
  await page.getByRole("button", { name: "عدّل اختياراتك" }).click()
  await expect(page.getByRole("radio", { name: /عالم الرجال/ })).toBeChecked()
  await completeStyle(page, "عالم الأطفال")
  for (const card of await page.locator(".mdr-style-product").all()) {
    const title = await card.locator("h3").innerText()
    expect(
      catalog.find((product) => product.name === title)?.categories,
    ).toContain("أطفال")
  }
  await page.getByRole("button", { name: "ابدأ من جديد" }).click()
  await expect(
    page.getByRole("button", { name: "التالي", exact: true }),
  ).toBeDisabled()
  await expect(
    page.getByRole("radio", { name: /عالم الرجال/ }),
  ).not.toBeChecked()
  await page.getByRole("link", { name: /المفضلة،/ }).click()
  await expect(page.locator("main")).toContainText(name)
  expect(submissions).toEqual([])
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 })
})

test("mobile style finder completes and reload resets only its in-memory answers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/style-finder/")
  await completeStyle(page, "عالم الأطفال")
  await expect(page.locator(".mdr-style-summary")).toContainText("عالم الأطفال")
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.reload()
  await expect(
    page.getByRole("button", { name: "التالي", exact: true }),
  ).toBeDisabled()
  await expect(page.locator(".mdr-style-product")).toHaveCount(0)
})

test("all editorial combinations recommend three existing products in the selected audience", () => {
  for (const audience of ["men", "kids"] as const) {
    for (const occasion of ["everyday", "smart", "layers"] as const) {
      for (const palette of ["earth", "mono", "light"] as const) {
        const answers: StyleAnswers = { audience, occasion, palette }
        const ids = recommendStyle(answers)
        expect(new Set(ids).size).toBe(3)
        for (const id of ids) {
          const product = catalog.find((item) => item.id === id)
          expect(product?.categories).toContain(
            audience === "men" ? "رجالي" : "أطفال",
          )
          expect(product?.name).not.toContain("تجريبي")
        }
      }
    }
  }
  expect(recommendStyle({ audience: "", occasion: "", palette: "" })).toEqual(
    [],
  )
  expect(
    recommendStyle({ audience: "men", occasion: "smart", palette: "earth" }),
  ).not.toEqual(
    recommendStyle({ audience: "men", occasion: "smart", palette: "mono" }),
  )
})
