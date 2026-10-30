import { useLocation, useNavigate } from "react-router"
import { useI18n } from "../i18n/context"
import { locales, switchLocalePath, type LocaleCode } from "../i18n/config"
import { SelectField } from "./Interface"

export function LanguageSwitcher() {
  const { locale } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <div className="mdr-language">
      <SelectField
        id="mdr-language"
        label="اللغة والمنطقة"
        hideLabel
        value={locale.code}
        onChange={(event) =>
          navigate(
            switchLocalePath(
              location.pathname,
              event.target.value as LocaleCode,
            ) +
              location.search +
              location.hash,
          )
        }
        options={locales.map((language) => ({
          value: language.code,
          label: language.label,
          lang: language.lang,
        }))}
      />
    </div>
  )
}
