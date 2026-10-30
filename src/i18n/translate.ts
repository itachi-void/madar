import type { Dictionary, Locale } from "./config"

export const normalizeMessage = (value: string) =>
  value
    .replace(/[\u200e\u200f\u2066-\u2069]/g, "")
    .replace(/\s+/g, " ")
    .trim()

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function createTranslator(locale: Locale, dictionary: Dictionary) {
  const messages = new Map(
    Object.entries(dictionary).map(([key, value]) => [
      normalizeMessage(key),
      value,
    ]),
  )
  const patterns = [...messages]
    .filter(([key]) => /\{\d+\}/.test(key) && !/\{\d+\}\{\d+\}/.test(key))
    .map(([key, value]) => {
      const indices: string[] = []
      const expression = key
        .split(/(\{\d+\})/)
        .map((part) => {
          if (/^\{\d+\}$/.test(part)) {
            indices.push(part)
            return "(.+?)"
          }
          return escapeRegex(part)
        })
        .join("")
      return { regex: new RegExp("^" + expression + "$"), value, indices }
    })
    .sort((a, b) => b.regex.source.length - a.regex.source.length)

  function translate(value: string, depth = 0): string {
    if (locale.code === "eg" || !value || depth > 4) return value
    const key = normalizeMessage(value)
    if (locale.direction === "ltr" && /^[\d,]+\.\d{2} ج\.م$/.test(key)) {
      const amount = Number(key.replace(" ج.م", "").replace(/,/g, ""))
      return (
        new Intl.NumberFormat(locale.lang, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + " EGP"
      )
    }
    const exact = messages.get(key)
    let translated = exact
    if (translated === undefined) {
      for (const pattern of patterns) {
        const match = key.match(pattern.regex)
        if (!match) continue
        translated = pattern.value
        pattern.indices.forEach((parameter, index) => {
          translated = translated!
            .split(parameter)
            .join(translate(match[index + 1], depth + 1))
        })
        break
      }
    }
    if (translated === undefined && key.includes(" / ")) {
      const parts = key.split(" / ")
      const next = parts.map((part) => translate(part, depth + 1))
      if (next.some((part, index) => part !== parts[index]))
        translated = next.join(" / ")
    }
    if (translated === undefined && key.includes("، ")) {
      const parts = key.split("، ")
      const next = parts.map((part) => translate(part, depth + 1))
      if (next.some((part, index) => part !== parts[index]))
        translated = next.join(locale.direction === "ltr" ? ", " : "، ")
    }
    if (translated === undefined && key.startsWith("/ "))
      translated = "/ " + translate(key.slice(2), depth + 1)
    if (translated === undefined) return value
    const leading = value.match(/^\s*/)?.[0] || ""
    const trailing = value.match(/\s*$/)?.[0] || ""
    return leading + translated + trailing
  }
  return translate
}
