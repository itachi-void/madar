import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  cartService,
  type StoreCart,
  type StoreCartItem,
  type AddToCartParams,
  ApiClientError,
} from "../api"
import { useI18n } from "../i18n/context"

interface CartContextValue {
  cart: StoreCart | null
  items: StoreCartItem[]
  itemsCount: number
  totalFormatted: string
  subtotalFormatted: string
  discountFormatted: string
  loading: boolean
  actionLoading: boolean
  error: string | null
  message: string
  addItem: (params: AddToCartParams) => Promise<boolean>
  updateQuantity: (key: string, quantity: number) => Promise<boolean>
  removeItem: (key: string) => Promise<boolean>
  applyCoupon: (code: string) => Promise<{ ok: boolean; message?: string }>
  removeCoupon: (code: string) => Promise<boolean>
  refreshCart: () => Promise<void>
  dismissMessage: () => void
  notify: (msg: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const [cart, setCart] = useState<StoreCart | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>("")

  const dismissMessage = useCallback(() => setMessage(""), [])
  const notify = useCallback((msg: string) => setMessage(msg), [])

  const refreshCart = useCallback(async () => {
    try {
      setError(null)
      const data = await cartService.getCart()
      setCart(data)
    } catch (err) {
      console.error("Failed to load WooCommerce cart:", err)
      setError(err instanceof Error ? err.message : t("تعذر تحميل سلة المشتريات"))
    } finally {
      setLoading(false)
    }
  }, [t])

  // Initial cart load
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = useCallback(
    async (params: AddToCartParams): Promise<boolean> => {
      setActionLoading(true)
      setError(null)
      try {
        const updated = await cartService.addItem(params)
        setCart(updated)
        notify(t("أُضيفت القطعة إلى سلة مشترياتك."))
        return true
      } catch (err) {
        console.error("Failed to add item to cart:", err)
        const errMsg =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
            ? err.message
            : t("تعذر إضافة القطعة لسلة المشتريات.")
        setError(errMsg)
        notify(errMsg)
        return false
      } finally {
        setActionLoading(false)
      }
    },
    [t, notify],
  )

  const updateQuantity = useCallback(
    async (key: string, quantity: number): Promise<boolean> => {
      setActionLoading(true)
      setError(null)
      try {
        const updated = await cartService.updateItem({ key, quantity })
        setCart(updated)
        return true
      } catch (err) {
        console.error("Failed to update item quantity:", err)
        const errMsg = err instanceof Error ? err.message : t("تعذر تحديث الكمية.")
        setError(errMsg)
        notify(errMsg)
        return false
      } finally {
        setActionLoading(false)
      }
    },
    [t, notify],
  )

  const removeItem = useCallback(
    async (key: string): Promise<boolean> => {
      setActionLoading(true)
      setError(null)
      try {
        const updated = await cartService.removeItem(key)
        setCart(updated)
        notify(t("تمت إزالة القطعة من السلة."))
        return true
      } catch (err) {
        console.error("Failed to remove item:", err)
        const errMsg = err instanceof Error ? err.message : t("تعذر إزالة القطعة.")
        setError(errMsg)
        notify(errMsg)
        return false
      } finally {
        setActionLoading(false)
      }
    },
    [t, notify],
  )

  const applyCoupon = useCallback(
    async (code: string): Promise<{ ok: boolean; message?: string }> => {
      setActionLoading(true)
      try {
        const updated = await cartService.applyCoupon(code)
        setCart(updated)
        notify(t("تم تطبيق كود الخصم بنجاح."))
        return { ok: true }
      } catch (err) {
        console.error("Failed to apply coupon:", err)
        const errMsg =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
            ? err.message
            : t("كود الخصم غير صالح.")
        notify(errMsg)
        return { ok: false, message: errMsg }
      } finally {
        setActionLoading(false)
      }
    },
    [t, notify],
  )

  const removeCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      setActionLoading(true)
      try {
        const updated = await cartService.removeCoupon(code)
        setCart(updated)
        notify(t("تمت إزالة كود الخصم."))
        return true
      } catch (err) {
        console.error("Failed to remove coupon:", err)
        return false
      } finally {
        setActionLoading(false)
      }
    },
    [t, notify],
  )

  const items = cart?.items || []
  const itemsCount = cart?.items_count ?? items.reduce((sum, i) => sum + i.quantity, 0)

  const currencySymbol = cart?.totals?.currency_symbol === "EGP" ? "ج.م" : (cart?.totals?.currency_symbol || "ج.م")
  const minorUnit = cart?.totals?.currency_minor_unit ?? 2

  const totalFormatted = cartService.formatAmount(
    cart?.totals?.total_price,
    currencySymbol,
    minorUnit,
  )
  const subtotalFormatted = cartService.formatAmount(
    cart?.totals?.total_items,
    currencySymbol,
    minorUnit,
  )
  const discountFormatted = cartService.formatAmount(
    cart?.totals?.total_discount,
    currencySymbol,
    minorUnit,
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemsCount,
        totalFormatted,
        subtotalFormatted,
        discountFormatted,
        loading,
        actionLoading,
        error,
        message,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        refreshCart,
        dismissMessage,
        notify,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}
