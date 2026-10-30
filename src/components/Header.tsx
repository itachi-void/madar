import { useEffect, useRef, useState } from "react"
import { Link, NavLink } from "react-router"
import { useLocation, useNavigate } from "../i18n/navigation"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { usePreviewStore } from "../app/PreviewStore"

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const searchInput = useRef<HTMLInputElement>(null)
  const searchTrigger = useRef<HTMLButtonElement>(null)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLElement>(null)
  const header = useRef<HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, favorites } = usePreviewStore()
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0)
  const newArrivalsActive =
    /^\/shop\/?$/.test(location.pathname) &&
    new URLSearchParams(location.search).get("orderby") === "date"

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus()
    if (menuOpen) menu.current?.querySelector<HTMLAnchorElement>("a")?.focus()
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (searchOpen || menuOpen)) {
        event.preventDefault()
        setSearchOpen(false)
        setMenuOpen(false)
        if (searchOpen) searchTrigger.current?.focus()
        else menuTrigger.current?.focus()
      }
    }
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener("keydown", escape)
    document.addEventListener("pointerdown", outside)
    return () => {
      document.removeEventListener("keydown", escape)
      document.removeEventListener("pointerdown", outside)
    }
  }, [searchOpen, menuOpen])

  return (
    <header className="wp-block-template-part" ref={header}>
      <div className="quiet-top">
        <span>رجال وأطفال — تجربة متجر كاملة، بدون دفع أو طلب حقيقي</span>
        <a href="/shop/">التشكيلة ↗</a>
      </div>
      <div className="quiet-header store-header" data-mdr-header>
        <a href="/" className="quiet-brand" aria-label="مدار — الرئيسية">
          مدار
          <span>MEN + KIDS / CAIRO</span>
        </a>
        <button
          type="button"
          ref={menuTrigger}
          className="store-menu-toggle mdr-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mdr-nav"
          aria-label="القائمة"
          onClick={() => {
            setSearchOpen(false)
            setMenuOpen((o) => !o)
          }}
        >
          <Icon>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </Icon>
        </button>
        <nav
          id="mdr-nav"
          ref={menu}
          className={`store-nav${menuOpen ? " is-open" : ""}`}
          aria-label="التنقل الرئيسي"
        >
          <Link
            to="/shop/?orderby=date"
            className={newArrivalsActive ? "active" : undefined}
            aria-current={newArrivalsActive ? "page" : undefined}
          >
            وصل حديثًا
          </Link>
          <NavLink
            to="/product-category/men/"
            className="experience-nav-button"
          >
            الرجال ⌄
          </NavLink>
          <NavLink
            to="/product-category/kids/"
            className="experience-nav-button"
          >
            الأطفال
          </NavLink>
          <NavLink to="/lookbook/">الإطلالات</NavLink>
          <NavLink to="/journal/">دفتر مدار</NavLink>
        </nav>
        <div className="quiet-header-tools">
          <button
            type="button"
            ref={searchTrigger}
            className="experience-search-trigger"
            aria-expanded={searchOpen}
            aria-controls="mdr-search"
            aria-label="البحث"
            onClick={() => {
              setMenuOpen(false)
              setSearchOpen((o) => !o)
            }}
          >
            <Icon>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </Icon>
          </button>
          <LanguageSwitcher />
          <a
            href="/my-account/?view=favorites"
            aria-label={`المفضلة، ${favorites.length} قطع`}
          >
            <Icon>
              <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 1 9 8 15 7-6 12-11 8-15Z" />
            </Icon>
            <small>{favorites.length}</small>
          </a>
          <a href="/my-account/" aria-label="الحساب">
            <Icon>
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </Icon>
          </a>
          <a
            href="/cart/"
            className="store-cart-link"
            aria-label={`سلة المشتريات، ${cartCount} قطع`}
          >
            <Icon>
              <path d="M5 7h14l1 14H4L5 7Z" />
              <path d="M8 8V6a4 4 0 0 1 8 0v2" />
            </Icon>
            <small key={cartCount} className="mdr-bump">
              {cartCount}
            </small>
          </a>
        </div>
      </div>
      <div id="mdr-search" className="mdr-search" hidden={!searchOpen}>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            navigate(
              `/shop/${
                query.trim() ? `?s=${encodeURIComponent(query.trim())}` : ""
              }`,
            )
            setSearchOpen(false)
          }}
        >
          <label htmlFor="mdr-search-input" className="screen-reader-text">
            البحث في المنتجات
          </label>
          <input
            ref={searchInput}
            id="mdr-search-input"
            type="search"
            placeholder="دوّر على قطعتك…"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="mdr-btn">
            بحث
          </button>
        </form>
      </div>
    </header>
  )
}
