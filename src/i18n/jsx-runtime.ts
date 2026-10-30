import { jsx as reactJsx, Fragment } from "react/jsx-runtime"
import type { ElementType, Key } from "react"
import { LocalizedElement } from "./LocalizedElement"
import { staticChildrenProps } from "./static-children"
export { Fragment }
export type { JSX } from "react/jsx-runtime"

export const jsx = (type: ElementType, props: unknown, key?: Key) =>
  reactJsx(LocalizedElement, { elementType: type, elementProps: props }, key)
export const jsxs = (type: ElementType, props: unknown, key?: Key) =>
  reactJsx(
    LocalizedElement,
    { elementType: type, elementProps: staticChildrenProps(props) },
    key,
  )
