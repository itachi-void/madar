import type { ReactNode } from "react"
import { NavLink } from "react-router"
import "../theme/information.css"

const links = [
  ["/about/", "عن مدار"],
  ["/help/", "المساعدة"],
  ["/size-guide/", "دليل المقاسات"],
  ["/policies/", "السياسات"],
  ["/style-finder/", "اكتشف أسلوبك"],
]

export function InformationShell({ children }: { children: ReactNode }) {
  return (
    <main id="mdr-main" className="mdr-page mdr-info-page" tabIndex={-1}>
      <nav className="mdr-info-nav" aria-label="عالم مدار والمساعدة">
        {links.map(([path, title]) => (
          <NavLink key={path} to={path}>
            {title}
          </NavLink>
        ))}
      </nav>
      {children}
      <p className="mdr-authored-note">
        محتوى أصلي للموقع الجديد، وليس نقلًا من صفحات المرجع. تجربة المتجر حاليًا
        للمعاينة فقط.
      </p>
    </main>
  )
}
