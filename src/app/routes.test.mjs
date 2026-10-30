import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { resolve, dirname } from "node:path"
import { createSitemap } from "../../scripts/prepare-release.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const readJSON = (name) =>
  JSON.parse(readFileSync(resolve(root, "src/content", name), "utf8"))
const pages = readJSON("pages.json").map((page) => ({
  ...page,
  html: readFileSync(
    resolve(root, "src/content/pages", page.contentFile),
    "utf8",
  ),
}))
const catalog = readJSON("catalog.json")
const manifest = readJSON("route-manifest.json")
const authoredPages = readJSON("authored-pages.json")
const sizeGuide = readJSON("size-guide.json")
const languageConfig = JSON.parse(
  readFileSync(resolve(root, "src/i18n/locales.json"), "utf8"),
)
const knownPaths = new Set([
  "/",
  "/checkout/",
  ...manifest.map((route) => route.path),
])

test("captures all 37 additional public pages and their original routes", () => {
  assert.equal(pages.length, 37)
  assert.equal(new Set(pages.map((page) => page.path)).size, pages.length)
  for (const page of pages) {
    assert.ok(knownPaths.has(page.path), page.path)
    assert.match(page.html, /<main\b[^>]*id="mdr-main"/)
    assert.ok(page.title)
  }
})

test("preserves all 16 products with real source prices and gallery images", () => {
  assert.equal(catalog.length, 16)
  assert.equal(catalog.find((product) => product.id === 86).price, 790)
  assert.equal(catalog.find((product) => product.id === 141).price, 1490)
  assert.equal(catalog.find((product) => product.id === 98).price, 2190)
  for (const product of catalog) {
    assert.ok(Number.isFinite(product.price) && product.price > 0, product.name)
    assert.ok(
      pages.some((page) => page.path === product.path),
      product.path,
    )
    assert.ok(
      existsSync(resolve(root, "public", product.image.slice(1))),
      product.image,
    )
  }
})

test("does not ship executable source markup, server actions, or nonces", () => {
  for (const page of pages) {
    assert.ok(
      !/<(?:script|iframe|object|embed)\b/i.test(page.html),
      `Executable markup: ${page.path}`,
    )
    assert.ok(
      !/\son[a-z]+\s*=|javascript:|data-wp-|nonce|<input[^>]+type="hidden"/i.test(
        page.html,
      ),
      `Runtime directives or private fields: ${page.path}`,
    )
    assert.ok(
      !/<form[^>]+\baction=/i.test(page.html),
      `Server form: ${page.path}`,
    )
    assert.ok(
      !/(?:glamorous-muffler\.localsite\.io|capability-test\.local)/.test(
        page.html,
      ),
      `Unlocalized URL: ${page.path}`,
    )
  }
})

test("all imported media references point to files available locally", () => {
  const css = readFileSync(resolve(root, "src/theme/wordpress.css"), "utf8")
  const data = pages.map((page) => page.html).join("\n") + css
  const references = [
    ...data.matchAll(/\/images\/madar-source\/[^"'()<>\s]+/g),
  ].map((match) => match[0])
  assert.ok(references.length > 0)
  for (const file of new Set(references)) {
    assert.ok(existsSync(resolve(root, "public", file.slice(1))), file)
  }
})

test("every captured internal page link has a registered destination", () => {
  for (const page of pages) {
    for (const match of page.html.matchAll(/\bhref="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&")
      if (!href.startsWith("/") || href.startsWith("/images/")) continue
      const url = new URL(href, "https://madar.example")
      const route = decodeURIComponent(url.pathname).replace(/\/+$/, "") + "/"
      assert.ok(knownPaths.has(route), `${page.path} -> ${href}`)
    }
  }
})

test("keeps source 404s and records the original empty-checkout redirect", () => {
  for (const path of [
    "/about/",
    "/help/",
    "/policies/",
    "/size-guide/",
    "/style-finder/",
  ]) {
    assert.equal(
      manifest.find((route) => route.path === path).sourceStatus,
      404,
    )
    assert.ok(!pages.some((page) => page.path === path))
  }
  assert.equal(
    manifest.find((route) => route.path === "/checkout/").redirect,
    "/cart/",
  )
})

test("release sitemap uses a supplied real origin and excludes private/demo routes", () => {
  const sitemap = createSitemap("https://madar.example", [
    ...pages.map((page) => page.path),
    ...authoredPages.filter((page) => !page.draft).map((page) => page.path),
    "/checkout/",
    "/my-account/orders/",
  ])
  assert.match(sitemap, /https:\/\/madar\.example\/shop\//)
  assert.match(sitemap, /https:\/\/madar\.example\/product\//)
  assert.doesNotMatch(sitemap, /\/(?:cart|checkout|my-account)\//)
  for (const path of ["/about/", "/help/", "/size-guide/", "/style-finder/"]) {
    assert.ok(sitemap.includes(`https://madar.example${path}`), path)
  }
  assert.doesNotMatch(sitemap, /\/policies\//)
  for (const language of languageConfig) {
    assert.ok(sitemap.includes(`https://madar.example${language.prefix}/shop/`))
    assert.ok(sitemap.includes(`hreflang="${language.lang}"`))
  }
  assert.throws(() => createSitemap("http://madar.example", ["/"]), /HTTPS/)
  assert.throws(
    () => createSitemap("https://user:password@madar.example", ["/"]),
    /credentials/,
  )
  assert.throws(
    () => createSitemap("https://madar.example/subpath", ["/"]),
    /path/,
  )
})

test("all four editions have complete matching static message catalogues", () => {
  const dictionaries = ["sa", "en", "fr", "es"].map((code) => ({
    code,
    messages: JSON.parse(
      readFileSync(resolve(root, `src/i18n/locales/${code}.json`), "utf8"),
    ),
  }))
  const keys = Object.keys(dictionaries[0].messages).sort()
  assert.ok(keys.length >= 850)
  for (const { code, messages } of dictionaries) {
    assert.deepEqual(Object.keys(messages).sort(), keys, code)
    for (const [source, translation] of Object.entries(messages)) {
      assert.ok(
        typeof translation === "string" && translation.trim(),
        `${code}: ${source}`,
      )
      assert.ok(
        !translation.includes("\ufffd"),
        `${code}: corrupt text for ${source}`,
      )
      if (code !== "sa")
        assert.doesNotMatch(
          translation,
          /[\u0600-\u06ff]/,
          `${code}: ${source}`,
        )
      assert.deepEqual(
        [...translation.matchAll(/\{\d+\}/g)].map((match) => match[0]).sort(),
        [...source.matchAll(/\{\d+\}/g)].map((match) => match[0]).sort(),
        `${code}: interpolation ${source}`,
      )
    }
  }
})

test("authored page metadata is separate from original source 404s, with a draft-only policy", () => {
  assert.equal(authoredPages.length, 5)
  assert.equal(new Set(authoredPages.map((page) => page.path)).size, 5)
  for (const page of authoredPages) {
    assert.equal(
      manifest.find((route) => route.path === page.path).sourceStatus,
      404,
    )
    assert.ok(page.title && page.description)
    assert.equal(page.draft, page.path === "/policies/")
    assert.ok(!pages.some((captured) => captured.path === page.path))
  }
})

test("offline language-error copy matches the full reviewed message catalogues", () => {
  const copy = JSON.parse(
    readFileSync(resolve(root, "src/i18n/error-copy.json"), "utf8"),
  )
  for (const [code, messages] of Object.entries(copy)) {
    const dictionary = JSON.parse(
      readFileSync(resolve(root, `src/i18n/locales/${code}.json`), "utf8"),
    )
    for (const [key, value] of Object.entries(messages))
      assert.equal(value, dictionary[key])
  }
})

test("the standalone size guide copies source measurements without inventing numbers", () => {
  const source = pages.find((page) => page.path === sizeGuide.sourcePage)
  assert.ok(source)
  assert.equal(source.contentFile, sizeGuide.sourceFile)
  for (const row of [...sizeGuide.men, ...sizeGuide.kids]) {
    assert.ok(
      source.html.includes(
        `<tr>${row.map((value) => `<td>${value}</td>`).join("")}</tr>`,
      ),
      row.join(" / "),
    )
  }
  assert.equal(sizeGuide.men.length, 5)
  assert.equal(sizeGuide.kids.length, 5)
})

test("font subsets and their open-source licenses are available locally", () => {
  const css = readFileSync(resolve(root, "src/theme/fonts.css"), "utf8")
  assert.doesNotMatch(css, /fonts\.googleapis|fonts\.gstatic/)
  const files = [...css.matchAll(/url\((\/fonts\/[^)]+)\)/g)].map(
    (match) => match[1],
  )
  assert.equal(files.length, 5)
  for (const file of files)
    assert.ok(existsSync(resolve(root, "public", file.slice(1))), file)
  for (const font of ["alexandria", "manrope", "notonaskharabic"]) {
    assert.ok(existsSync(resolve(root, `public/fonts/${font}-OFL.txt`)))
  }
})
