import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react"
import catalog from "../content/catalog.json"
import { useCart } from "./CartContext"

export type CatalogProduct = typeof catalog[number]
export type CartLine = {
  key: string
  productId: number
  quantity: number
  price: number
  options: string
}

export type CheckoutPreview = {
  lines: CartLine[]
  total: number
  payment: "cod" | "card"
}

type PreviewStore = {
  cart: CartLine[]
  favorites: number[]
  message: string
  notify: (message: string) => void
  toggleFavorite: (id: number) => void
  addToCart: (
    productId: number,
    quantity: number,
    options: string,
    price: number,
  ) => void
  setQuantity: (key: string, quantity: number) => void
  dismissMessage: () => void
  demoAccount: boolean
  setDemoAccount: (active: boolean) => void
  checkoutPreview: CheckoutPreview | null
  completeCheckout: (payment: CheckoutPreview["payment"]) => void
}

const Store = createContext<PreviewStore | null>(null)

export function PreviewProvider({ children }: { children: ReactNode }) {
  const {
    items,
    addItem: cartAddItem,
    updateQuantity: cartUpdateQty,
    removeItem: cartRemoveItem,
    message: cartMsg,
    notify: cartNotify,
    dismissMessage: cartDismiss,
  } = useCart()

  const [favorites, setFavorites] = useState<number[]>([])
  const [demoAccount, setDemoAccount] = useState(false)
  const [checkoutPreview, setCheckoutPreview] =
    useState<CheckoutPreview | null>(null)

  const toggleFavorite = (id: number) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    )

  // Map real WooCommerce Store API items into CartLine shape
  const cart: CartLine[] = useMemo(() => {
    return items.map((i) => {
      const minor = i.prices?.currency_minor_unit ?? 2
      const unitPrice = (parseFloat(i.prices?.price || "0") || 0) / Math.pow(10, minor)
      const optionsStr = i.variation?.map((v) => `${v.attribute}: ${v.value}`).join(", ") || ""
      return {
        key: i.key,
        productId: i.id,
        quantity: i.quantity,
        price: unitPrice,
        options: optionsStr,
      }
    })
  }, [items])

  const addToCart = (
    productId: number,
    quantity: number,
    _options: string,
    _price: number,
  ) => {
    cartAddItem({ id: productId, quantity })
  }

  const setQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      cartRemoveItem(key)
    } else {
      cartUpdateQty(key, quantity)
    }
  }

  const completeCheckout = (payment: CheckoutPreview["payment"]) => {
    if (!cart.length) return
    setCheckoutPreview({
      lines: cart.map((line) => ({ ...line })),
      total: cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
      payment,
    })
    cartDismiss()
  }

  return (
    <Store.Provider
      value={{
        cart,
        favorites,
        message: cartMsg,
        notify: cartNotify,
        toggleFavorite,
        addToCart,
        setQuantity,
        dismissMessage: cartDismiss,
        demoAccount,
        setDemoAccount,
        checkoutPreview,
        completeCheckout,
      }}
    >
      {children}
    </Store.Provider>
  )
}

export function usePreviewStore() {
  const store = useContext(Store)
  if (!store) throw new Error("PreviewProvider is required")
  return store
}

export { catalog }
