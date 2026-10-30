import { localePath, type Locale } from "./config"

export function localizeHtml(
  html: string,
  locale: Locale,
  t: (value: string) => string,
) {
  if (locale.code === "eg") return html
  const doc = new DOMParser().parseFromString(html, "text/html")
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("script, style, code, pre")) continue
    if (node.parentElement?.tagName === "OPTION")
      node.parentElement.dataset.mdrSourceLabel = node.textContent || ""
    const text = node.textContent || ""
    node.textContent =
      locale.direction === "ltr" &&
      node.parentElement?.closest(".woocommerce-Price-amount") &&
      /^\s*[\d,]+\.\d{2}\s*$/.test(text)
        ? new Intl.NumberFormat(locale.lang, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(text.replace(/,/g, "").trim())) + " "
        : t(text)
  }
  doc.body.querySelectorAll<HTMLElement>("*").forEach((element) => {
    for (const name of [
      "alt",
      "title",
      "placeholder",
      "aria-label",
      "data-mdr-name",
    ]) {
      const value = element.getAttribute(name)
      if (value) element.setAttribute(name, t(value))
    }
    if (element.hasAttribute("href"))
      element.setAttribute(
        "href",
        localePath(element.getAttribute("href")!, locale.code),
      )
    if (
      element instanceof HTMLInputElement &&
      ["submit", "reset", "button"].includes(element.type)
    )
      element.setAttribute("value", t(element.value))
  })
  return doc.body.innerHTML
}
