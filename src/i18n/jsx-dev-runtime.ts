import { jsxDEV as reactJsxDEV, Fragment } from "react/jsx-dev-runtime"
import type { ElementType, Key } from "react"
import { LocalizedElement } from "./LocalizedElement"
import { staticChildrenProps } from "./static-children"
export { Fragment }
export type { JSX } from "react/jsx-dev-runtime"

export const jsxDEV = (
  type: ElementType,
  props: unknown,
  key?: Key,
  _static?: boolean,
  source?: {
    fileName: string
    lineNumber: number
    columnNumber: number
  },
  self?: unknown,
) =>
  reactJsxDEV(
    LocalizedElement,
    {
      elementType: type,
      elementProps: _static ? staticChildrenProps(props) : props,
    },
    key,
    false,
    source,
    self,
  )
