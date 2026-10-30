import { useEffect, useRef, type RefObject } from "react"
import { useNavigate } from "../i18n/navigation"
import { useI18n } from "../i18n/context"
import { catalog, usePreviewStore } from "./PreviewStore"
import type { CapturedPage } from "./SourcePage"

type Variation = {
  attributes: Record<string, string>
  is_in_stock: boolean
  is_purchasable: boolean
  display_price: number
}

export function useSourceInteractions(
  container: RefObject<HTMLDivElement | null>,
  page: CapturedPage,
  query: string,
  enabled: boolean,
) {
  const store = usePreviewStore()
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const latestStore = useRef(store)
  latestStore.current = store

  useEffect(() => {
    const root = container.current
    if (!enabled || !root) return
    const main = root.querySelector("main")
    main?.setAttribute("tabindex", "-1")
    root
      .querySelector(".woocommerce-breadcrumb")
      ?.setAttribute("aria-label", t("مسار التصفح"))
    const additions: Element[] = []
    const cleanups: Array<() => void> = []
    const params = new URLSearchParams(query)

    const list = root.querySelector<HTMLElement>(
      "ul.wc-block-product-template, ul.products",
    )
    if (list && !page.path.startsWith("/product/")) {
      const cards = Array.from(list.children) as HTMLElement[]
      const search = (params.get("s") || "").trim().toLocaleLowerCase()
      const order = params.get("orderby")
      const nativeOrder =
        root.querySelector<HTMLSelectElement>("select.orderby")
      if (nativeOrder) {
        nativeOrder.value = order || "menu_order"
        const orderChange = () => {
          const next = new URLSearchParams(query)
          next.set("orderby", nativeOrder.value)
          navigate(`${page.path}?${next}`)
        }
        nativeOrder.addEventListener("change", orderChange)
        cleanups.push(() =>
          nativeOrder.removeEventListener("change", orderChange),
        )
      }
      if (order === "popularity" || order === "rating") {
        const notice = document.createElement("p")
        notice.className = "mdr-form-notice"
        notice.setAttribute("role", "status")
        notice.textContent = t(
          "بيانات المبيعات والتقييمات غير متصلة في نسخة العرض؛ يظهر ترتيب المصدر بدلًا من ترتيب حي.",
        )
        list.before(notice)
        additions.push(notice)
      }
      if (order === "price" || order === "price-desc") {
        cards.sort(
          (a, b) =>
            (Number(a.dataset.mdrPrice) - Number(b.dataset.mdrPrice)) *
            (order === "price" ? 1 : -1),
        )
      } else if (order === "date") {
        cards.sort(
          (a, b) =>
            Number(b.dataset.mdrProductId) - Number(a.dataset.mdrProductId),
        )
      }
      cards.forEach((card) => {
        card.hidden = Boolean(
          search && !card.dataset.mdrName?.toLocaleLowerCase().includes(search),
        )
        list.appendChild(card)
      })
      const visible = cards.filter((card) => !card.hidden).length
      if (search) {
        const heading = root.querySelector("h1")
        if (heading)
          heading.textContent = t(`نتائج البحث عن «${params.get("s")}»`)
        root
          .querySelectorAll(
            ".wc-block-product-results-count, .woocommerce-result-count",
          )
          .forEach((node) => {
            node.textContent = t(`${visible} قطعة`)
          })
        const empty = document.createElement("p")
        empty.className = "mdr-lead mdr-search-empty"
        empty.textContent = visible
          ? ""
          : t("لم نجد قطعة بهذا الاسم. جرّب كلمة أخرى أو تصفّح التشكيلة.")
        list.after(empty)
        additions.push(empty)
      }
      root
        .querySelectorAll<HTMLAnchorElement>("#mdr-filters a")
        .forEach((anchor) => {
          const url = new URL(anchor.href)
          if (search && url.pathname === window.location.pathname) {
            url.searchParams.set("s", params.get("s") || "")
            anchor.href = url.pathname + url.search
          }
          if (url.pathname === window.location.pathname) {
            const active = url.searchParams.get("orderby") === order
            if (active) anchor.setAttribute("aria-current", "true")
            else anchor.removeAttribute("aria-current")
          }
        })
    }

    const gallery = root.querySelector<HTMLElement>(
      ".woocommerce-product-gallery",
    )
    const images = Array.from(
      root.querySelectorAll<HTMLElement>(".woocommerce-product-gallery__image"),
    )
    if (gallery && images.length) {
      gallery.style.opacity = "1"
      const zoom = document.createElement("button")
      zoom.type = "button"
      zoom.className = "woocommerce-product-gallery__trigger"
      zoom.dataset.mdrZoom = ""
      zoom.setAttribute("aria-label", t("تكبير الصورة الحالية"))
      gallery.prepend(zoom)
      additions.push(zoom)
      const thumbs = document.createElement("ol")
      thumbs.className = "flex-control-thumbs mdr-gallery-thumbs"
      thumbs.setAttribute("aria-label", t("صور القطعة"))
      images.forEach((image, index) => {
        image.dataset.active = String(index === 0)
        const original = image.querySelector("img")
        if (!original) return
        original.loading = index === 0 ? "eager" : "lazy"
        const item = document.createElement("li")
        const button = document.createElement("button")
        button.type = "button"
        button.dataset.mdrImageIndex = String(index)
        button.setAttribute("aria-label", t(`عرض الصورة ${index + 1}`))
        button.setAttribute("aria-pressed", String(index === 0))
        const thumbnail = document.createElement("img")
        thumbnail.src = original.src
        thumbnail.alt = ""
        thumbnail.className = index === 0 ? "flex-active" : ""
        button.appendChild(thumbnail)
        item.appendChild(button)
        thumbs.appendChild(item)
      })
      gallery.appendChild(thumbs)
      additions.push(thumbs)
    }

    const tabLinks = Array.from(
      root.querySelectorAll<HTMLAnchorElement>(".woocommerce-tabs ul.tabs a"),
    )
    const selectTab = (active: HTMLAnchorElement) => {
      tabLinks.forEach((tab) => {
        const selected = tab === active
        tab.setAttribute("aria-selected", String(selected))
        tab.tabIndex = selected ? 0 : -1
        tab.parentElement?.classList.toggle("active", selected)
        const panel = root.querySelector<HTMLElement>(
          tab.getAttribute("href") || "",
        )
        if (panel) panel.hidden = !selected
      })
    }
    if (tabLinks.length) {
      root
        .querySelector(".woocommerce-tabs ul.tabs")
        ?.setAttribute("role", "tablist")
      selectTab(
        tabLinks.find((tab) => tab.hash === window.location.hash) ||
          tabLinks[0],
      )
    }

    const cartForm = root.querySelector<HTMLFormElement>("form.cart")
    const selects = Array.from(
      cartForm?.querySelectorAll<HTMLSelectElement>(".variations select") || [],
    )
    let variations: Variation[] = []
    try {
      variations = JSON.parse(
        cartForm?.getAttribute("data-product_variations") || "[]",
      )
    } catch {
      /* Simple products have no variations. */
    }
    const matchingVariations = () =>
      variations.filter((variation) =>
        selects.every(
          (select) =>
            !select.value ||
            !variation.attributes[select.name] ||
            variation.attributes[select.name] === select.value,
        ),
      )
    const refreshSwatches = () => {
      const reset =
        cartForm?.querySelector<HTMLAnchorElement>(".reset_variations")
      if (reset) {
        const selected = selects.some((select) => select.value)
        reset.style.visibility = selected ? "visible" : "hidden"
        reset.tabIndex = selected ? 0 : -1
      }
      selects.forEach((select) => {
        const group = select.previousElementSibling
        group
          ?.querySelectorAll<HTMLButtonElement>("button")
          .forEach((button) => {
            button.setAttribute(
              "aria-pressed",
              String(select.value === button.dataset.value),
            )
            const matches = variations.filter(
              (variation) =>
                (!variation.attributes[select.name] ||
                  variation.attributes[select.name] === button.dataset.value) &&
                selects.every(
                  (other) =>
                    other === select ||
                    !other.value ||
                    !variation.attributes[other.name] ||
                    variation.attributes[other.name] === other.value,
                ),
            )
            const soldOut =
              matches.length > 0 &&
              matches.every((variation) => !variation.is_in_stock)
            button.classList.toggle("is-soldout", soldOut)
            button.disabled = soldOut
            button.setAttribute(
              "aria-label",
              `${button.textContent}${soldOut ? t(" — غير متوفر") : ""}`,
            )
          })
      })
      const add = cartForm?.querySelector<HTMLButtonElement>(
        ".single_add_to_cart_button",
      )
      const incomplete = selects.some((select) => !select.value)
      const matching = matchingVariations()
      if (add && selects.length) {
        add.disabled =
          incomplete ||
          !matching.some(
            (variation) => variation.is_in_stock && variation.is_purchasable,
          )
        add.classList.toggle("disabled", add.disabled)
      }
    }
    selects.forEach((select, index) => {
      const group = document.createElement("div")
      group.className = "mdr-swatches"
      group.setAttribute("role", "group")
      const label = cartForm?.querySelector<HTMLLabelElement>(
        `label[for="${CSS.escape(select.id)}"]`,
      )
      group.setAttribute(
        "aria-label",
        label?.textContent?.trim() || t("الخيارات"),
      )
      Array.from(select.options)
        .filter((option) => option.value)
        .forEach((option) => {
          const button = document.createElement("button")
          button.type = "button"
          button.className = "mdr-swatch"
          button.textContent = option.textContent
          button.dataset.mdrSelect = String(index)
          button.dataset.value = option.value
          group.appendChild(button)
        })
      select.before(group)
      select.classList.add("mdr-native-select")
      select.tabIndex = -1
      select.setAttribute("aria-hidden", "true")
      additions.push(group)
    })
    refreshSwatches()

    let lightbox: HTMLDialogElement | undefined
    const showImage = (src: string, alt: string) => {
      if (!lightbox) {
        lightbox = document.createElement("dialog")
        lightbox.className = "mdr-image-dialog"
        lightbox.setAttribute("aria-label", t("تكبير صورة القطعة"))
        const close = document.createElement("button")
        close.type = "button"
        close.textContent = "×"
        close.setAttribute("aria-label", t("إغلاق صورة القطعة"))
        close.dataset.mdrClose = ""
        lightbox.append(close, document.createElement("img"))
        root.appendChild(lightbox)
        additions.push(lightbox)
      }
      const image = lightbox.querySelector("img")!
      image.src = src
      image.alt = alt
      lightbox.showModal()
    }

    const click = (event: Event) => {
      if (!(event.target instanceof Element)) return
      const target = event.target
      const open = target.closest<HTMLElement>("[data-mdr-open]")
      if (open) {
        event.preventDefault()
        root
          .querySelector<HTMLDialogElement>(
            `#${CSS.escape(open.dataset.mdrOpen || "")}`,
          )
          ?.showModal()
        return
      }
      const dialog = target.closest<HTMLDialogElement>("dialog")
      if (dialog && (target === dialog || target.closest("[data-mdr-close]"))) {
        event.preventDefault()
        dialog.close()
        return
      }
      if (dialog && target.closest("a[href]")) dialog.close()
      const density = target.closest<HTMLElement>("[data-mdr-density]")
      if (density) {
        document.body.classList.toggle(
          "mdr-density-large",
          density.dataset.mdrDensity === "large",
        )
        root
          .querySelectorAll<HTMLElement>("[data-mdr-density]")
          .forEach((button) =>
            button.setAttribute("aria-pressed", String(button === density)),
          )
      }
      const tab = target.closest<HTMLAnchorElement>(
        ".woocommerce-tabs ul.tabs a",
      )
      if (tab) {
        event.preventDefault()
        selectTab(tab)
      }
      const swatch = target.closest<HTMLButtonElement>("[data-mdr-select]")
      if (swatch && !swatch.disabled) {
        const select = selects[Number(swatch.dataset.mdrSelect)]
        select.value =
          select.value === swatch.dataset.value
            ? ""
            : swatch.dataset.value || ""
        refreshSwatches()
      }
      if (target.closest(".reset_variations")) {
        event.preventDefault()
        selects.forEach((select) => {
          select.value = ""
        })
        refreshSwatches()
      }
      const thumb = target.closest<HTMLButtonElement>("[data-mdr-image-index]")
      if (thumb) {
        images.forEach((image, index) => {
          image.dataset.active = String(
            index === Number(thumb.dataset.mdrImageIndex),
          )
        })
        gallery
          ?.querySelectorAll<HTMLButtonElement>("[data-mdr-image-index]")
          .forEach((button) => {
            button.setAttribute("aria-pressed", String(button === thumb))
            button
              .querySelector("img")
              ?.classList.toggle("flex-active", button === thumb)
          })
      }
      const imageLink = target.closest<HTMLAnchorElement>(
        ".woocommerce-product-gallery__image a",
      )
      if (imageLink) {
        event.preventDefault()
        showImage(
          imageLink.href,
          imageLink.querySelector("img")?.alt || page.title,
        )
      }
      if (target.closest("[data-mdr-zoom]")) {
        const image = gallery?.querySelector<HTMLImageElement>(
          '[data-active="true"] img',
        )
        if (image) showImage(image.src, image.alt)
      }
    }

    const keydown = (event: KeyboardEvent) => {
      const current = tabLinks.indexOf(event.target as HTMLAnchorElement)
      if (current < 0) return
      let next: number
      if (
        event.key === (locale.direction === "rtl" ? "ArrowLeft" : "ArrowRight")
      )
        next = (current + 1) % tabLinks.length
      else if (
        event.key === (locale.direction === "rtl" ? "ArrowRight" : "ArrowLeft")
      )
        next = (current - 1 + tabLinks.length) % tabLinks.length
      else if (event.key === "Home") next = 0
      else if (event.key === "End") next = tabLinks.length - 1
      else return
      event.preventDefault()
      selectTab(tabLinks[next])
      tabLinks[next].focus()
    }

    const submit = (event: Event) => {
      event.preventDefault()
      const form = event.target as HTMLFormElement
      if (form.matches("form.cart")) {
        if (selects.some((select) => !select.value)) {
          latestStore.current.notify("اختر المقاس والخيارات أولًا.")
          return
        }
        const product = catalog.find(
          (item) => item.id === Number(form.dataset.mdrProductId),
        )
        if (!product) return
        const variation = matchingVariations()[0]
        if (
          variations.length &&
          (!variation?.is_in_stock || !variation.is_purchasable)
        ) {
          latestStore.current.notify("هذا الاختيار غير متوفر في المصدر.")
          return
        }
        const options = selects
          .map(
            (select) =>
              select.selectedOptions[0]?.dataset.mdrSourceLabel ||
              select.selectedOptions[0]?.textContent ||
              "",
          )
          .join(" / ")
        const quantity = Number(
          form.querySelector<HTMLInputElement>(".qty")?.value || 1,
        )
        latestStore.current.addToCart(
          product.id,
          quantity,
          options,
          variation?.display_price ?? product.price,
        )
      } else {
        latestStore.current.notify(
          "هذا النموذج للعرض فقط. لم تُرسل أو تُحفظ أي بيانات.",
        )
      }
    }

    root.addEventListener("click", click)
    root.addEventListener("keydown", keydown)
    root.addEventListener("submit", submit)
    const onChange = () => refreshSwatches()
    cartForm?.addEventListener("change", onChange)
    cleanups.push(() => {
      root.removeEventListener("click", click)
      root.removeEventListener("keydown", keydown)
      root.removeEventListener("submit", submit)
      cartForm?.removeEventListener("change", onChange)
    })
    return () => {
      root
        .querySelectorAll<HTMLDialogElement>("dialog[open]")
        .forEach((dialog) => dialog.close())
      additions.forEach((element) => element.remove())
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [container, page, query, enabled, navigate, t, locale.direction])
}
