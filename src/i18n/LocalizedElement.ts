import {
  createElement,
  useContext,
  type ElementType,
  type ReactNode,
} from "react"
import { LocaleContext } from "./context"
import { localePath } from "./config"

// Localize during React rendering, never by mutating React-owned DOM text.
// Shared source copy and product identifiers remain canonical and unchanged.
export function LocalizedElement({
  elementType,
  elementProps,
}: {
  elementType: ElementType
  elementProps: Record<string, unknown> | null
}) {
  const { locale, t } = useContext(LocaleContext)
  if (!elementProps || locale.code === "eg")
    return createElement(elementType, elementProps)
  const props = { ...elementProps }
  const translateNode = (node: ReactNode): ReactNode => {
    if (typeof node === "string") return t(node)
    if (Array.isArray(node)) return node.map(translateNode)
    return node
  }
  if (props.translate !== "no") {
    if ("children" in props)
      props.children = translateNode(props.children as ReactNode)
    for (const name of [
      "alt",
      "title",
      "placeholder",
      "aria-label",
      "label",
      "hint",
      "error",
      "eyebrow",
    ]) {
      if (typeof props[name] === "string")
        props[name] = t(props[name] as string)
    }
  }
  if (!props["data-locale-switch"]) {
    if (typeof props.href === "string")
      props.href = localePath(props.href, locale.code)
    if (typeof props.to === "string")
      props.to = localePath(props.to, locale.code)
  }
  return createElement(elementType, props)
}
