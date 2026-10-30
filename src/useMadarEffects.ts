import { useEffect } from "react"
import { trailImages } from "./data"
import { useI18n } from "./i18n/context"

export function useMadarEffects(routeKey = "/") {
  const { locale } = useI18n()
  useEffect(() => {
    const root = document.documentElement
    root.lang = locale.lang
    root.dir = locale.direction
    root.classList.add("mdr-js")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const cleanups: Array<() => void> = []

    const header = document.querySelector("[data-mdr-header]")
    if (header) {
      const onScroll = () =>
        header.classList.toggle("is-scrolled", window.scrollY > 8)
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true })
      cleanups.push(() => window.removeEventListener("scroll", onScroll))
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".mdr-reveal, ul.products > li.product, ul.wc-block-product-template > li",
      ),
    )
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible")
              io.unobserve(e.target)
            }
          }),
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      )
      targets.forEach((el, i) => {
        el.classList.add("mdr-will-reveal")
        el.style.setProperty("--mdr-delay", `${(i % 4) * 70}ms`)
        io.observe(el)
      })
      const t = window.setTimeout(
        () => targets.forEach((el) => el.classList.add("is-visible")),
        2500,
      )
      cleanups.push(() => {
        io.disconnect()
        window.clearTimeout(t)
      })
    }

    const scene = document.getElementById("motion-scroll")
    if (scene && !reduce) {
      const update = () => {
        const b = scene.getBoundingClientRect()
        const max = Math.max(1, b.height - window.innerHeight)
        scene.style.setProperty(
          "--scene-progress",
          String(Math.max(0, Math.min(1, -b.top / max))),
        )
      }
      update()
      window.addEventListener("scroll", update, { passive: true })
      window.addEventListener("resize", update)
      cleanups.push(() => {
        window.removeEventListener("scroll", update)
        window.removeEventListener("resize", update)
      })
    }

    const trail = document.getElementById("motion-trail")
    if (trail) {
      let lx = 0,
        ly = 0,
        lt = 0
      const timers = new Set<number>()
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || reduce) return
        const b = trail.getBoundingClientRect()
        const x = e.clientX - b.left
        const y = e.clientY - b.top
        const now = Date.now()
        if (now - lt < 100 || Math.hypot(x - lx, y - ly) < 65) return
        lx = x
        ly = y
        lt = now
        const el = document.createElement("img")
        el.className = "motion-trail-image"
        el.src = trailImages[Math.floor(now / 100) % trailImages.length]
        el.alt = ""
        el.setAttribute("aria-hidden", "true")
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.style.setProperty("--trail-turn", `${(now % 24) - 12}deg`)
        trail.appendChild(el)
        const timer = window.setTimeout(() => {
          el.remove()
          timers.delete(timer)
        }, 1100)
        timers.add(timer)
      }
      trail.addEventListener("pointermove", onMove)
      cleanups.push(() => {
        trail.removeEventListener("pointermove", onMove)
        timers.forEach((timer) => window.clearTimeout(timer))
        trail
          .querySelectorAll(".motion-trail-image")
          .forEach((image) => image.remove())
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [routeKey, locale])
}
