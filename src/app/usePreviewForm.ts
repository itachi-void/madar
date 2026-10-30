import { useState, type ChangeEvent } from "react"
import { useI18n } from "../i18n/context"

export const required = (value: string) =>
  value.trim() ? "" : "هذا الحقل مطلوب."
export const email = (value: string) =>
  required(value) ||
  (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? ""
    : "أدخل بريدًا إلكترونيًا صحيحًا.")
export const password = (value: string) =>
  value.length >= 8 ? "" : "استخدم ٨ أحرف على الأقل."
export const phone = (value: string) => {
  const normalized = value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[\s()+-]/g, "")
  return /^(?:0?1[0125]\d{8}|201[0125]\d{8})$/.test(normalized)
    ? ""
    : "أدخل رقم موبايل مصري صحيحًا."
}

export function usePreviewForm<T extends Record<string, string>>(
  initial: T,
  validators: Partial<Record<keyof T, (value: string) => string>>,
) {
  const { locale } = useI18n()
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const check = (key: keyof T, value: string) => {
    if (validators[key] === phone && locale.code !== "eg") {
      const normalized = value
        .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
        .replace(/[\s()+-]/g, "")
      const valid =
        locale.code === "sa"
          ? /^(?:05\d{8}|9665\d{8})$/.test(normalized)
          : /^\d{7,15}$/.test(normalized)
      return valid ? "" : "أدخل رقم موبايل مصري صحيحًا."
    }
    return validators[key]?.(value) || ""
  }
  const field = (key: keyof T) => ({
    id: String(key),
    name: String(key),
    value: values[key],
    error: errors[key],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [key]: value }))
      if (submitted || errors[key])
        setErrors((current) => ({ ...current, [key]: check(key, value) }))
    },
    onBlur: () =>
      setErrors((current) => ({ ...current, [key]: check(key, values[key]) })),
  })
  const validate = (keys = Object.keys(validators) as Array<keyof T>) => {
    setSubmitted(true)
    const next = Object.fromEntries(
      keys.map((key) => [key, check(key, values[key])]),
    ) as Partial<Record<keyof T, string>>
    setErrors(next)
    const first = keys.find((key) => next[key])
    if (first) document.getElementById(String(first))?.focus()
    return !first
  }
  return { values, field, validate, errors }
}
