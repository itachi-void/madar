import { cloneElement, isValidElement, type ReactNode } from "react"

// The adapter replaces React's static JSX call, so retain stable sibling keys
// through public element APIs rather than React's private validation flags.
export function staticChildrenProps(props: unknown) {
  const value = props as Record<string, unknown> | null
  if (!value || !Array.isArray(value.children)) return props
  return {
    ...value,
    children: (value.children as ReactNode[]).map((child, index) =>
      isValidElement(child) && child.key === null
        ? cloneElement(child, { key: `locale-static-${index}` })
        : child,
    ),
  }
}
