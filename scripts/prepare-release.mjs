import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"
const languages = JSON.parse(
  readFileSync(new URL("../src/i18n/locales.json", import.meta.url), "utf8"),
)

export function createSitemap(origin, paths) {
  const site = new URL(origin)
  if (
    site.protocol !== "https:" ||
    site.username ||
    site.password ||
    site.pathname !== "/" ||
    site.search ||
    site.hash
  ) {
    throw new Error(
      "SITE_URL must be your public HTTPS origin, without a path, credentials, query, or fragment.",
    )
  }
  const escape = (value) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")
  const publicPaths = [
    ...new Set([
      "/",
      ...paths.map(
        (path) => path.replace(/^\/(?:sa|en|fr|es)(?=\/|$)/, "") || "/",
      ),
    ]),
  ].filter((path) => !/^\/(?:cart|checkout|my-account)(?:\/|$)/.test(path))
  const url = (path, language) =>
    escape(new URL(encodeURI(language.prefix + path), site).href)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${publicPaths.flatMap((path) => languages.map((language) => `  <url><loc>${url(path, language)}</loc>${languages.map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${url(path, alternate)}"/>`).join("")}</url>`)).join("\n")}\n</urlset>\n`
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  if (!process.env.SITE_URL)
    throw new Error(
      "Set SITE_URL to the real deployment origin. No domain is guessed.",
    )
  if (!existsSync("dist/index.html"))
    throw new Error("Run pnpm build before preparing a release.")
  const pages = JSON.parse(readFileSync("src/content/pages.json", "utf8"))
  const authoredPages = JSON.parse(
    readFileSync("src/content/authored-pages.json", "utf8"),
  )
  const config = JSON.parse(readFileSync(".figma/make/site.json", "utf8"))
  const sitemap = createSitemap(process.env.SITE_URL, [
    ...pages.map((page) => page.path),
    ...authoredPages.filter((page) => !page.draft).map((page) => page.path),
  ])
  writeFileSync("dist/sitemap.xml", sitemap)
  const origin = new URL(process.env.SITE_URL).origin
  const indexable = config.robots?.index !== false
  const robots = indexable
    ? `User-agent: *\nAllow: /\n${languages.flatMap((language) => ["cart", "checkout", "my-account"].map((path) => `Disallow: ${language.prefix}/${path}/`)).join("\n")}\nSitemap: ${origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n"
  writeFileSync("dist/robots.txt", robots)
  console.log(
    `Prepared sitemap and robots.txt. Search indexing is ${
      indexable ? "enabled" : "disabled (preview mode)"
    }.`,
  )
  if (!indexable)
    console.log(
      "Keep preview indexing disabled. Enable it in site settings only when the real site is ready.",
    )
}
