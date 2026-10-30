import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  accountService,
  tokenStorage,
  type CustomerUser,
  type CustomerOrder,
  ApiClientError,
} from "../api"
import { useI18n } from "../i18n/context"

interface AccountContextValue {
  user: CustomerUser | null
  isAuthenticated: boolean
  loading: boolean
  orders: CustomerOrder[]
  ordersLoading: boolean
  error: string | null
  login: (login: string, pass: string) => Promise<{ ok: boolean; error?: string }>
  register: (params: {
    email: string
    password: string
    first_name?: string
    last_name?: string
  }) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (
    data: Partial<CustomerUser> | Record<string, unknown>,
  ) => Promise<{ ok: boolean; error?: string }>
  refreshOrders: () => Promise<void>
  refreshProfile: () => Promise<void>
  clearError: () => void
}

const AccountContext = createContext<AccountContextValue | null>(null)

export function AccountProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const refreshProfile = useCallback(async () => {
    const token = tokenStorage.getCustomerToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const profile = await accountService.getProfile()
      setUser(profile)
    } catch (err) {
      console.warn("Failed to restore customer session:", err)
      tokenStorage.clearCustomerToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshOrders = useCallback(async () => {
    if (!tokenStorage.getCustomerToken()) return
    setOrdersLoading(true)
    try {
      const list = await accountService.getOrders()
      setOrders(list)
    } catch (err) {
      console.error("Failed to load customer orders:", err)
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  useEffect(() => {
    if (user) {
      refreshOrders()
    } else {
      setOrders([])
    }
  }, [user, refreshOrders])

  const login = useCallback(
    async (loginStr: string, pass: string): Promise<{ ok: boolean; error?: string }> => {
      setError(null)
      try {
        const res = await accountService.login(loginStr, pass)
        setUser(res.user)
        return { ok: true }
      } catch (err) {
        console.error("Login failed:", err)
        const errMsg =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
            ? err.message
            : t("اسم المستخدم أو كلمة المرور غير صحيحة.")
        setError(errMsg)
        return { ok: false, error: errMsg }
      }
    },
    [t],
  )

  const register = useCallback(
    async (params: {
      email: string
      password: string
      first_name?: string
      last_name?: string
    }): Promise<{ ok: boolean; error?: string }> => {
      setError(null)
      try {
        const res = await accountService.register(params)
        setUser(res.user)
        return { ok: true }
      } catch (err) {
        console.error("Registration failed:", err)
        const errMsg =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
            ? err.message
            : t("تعذر إنشاء الحساب، يرجى التحقق من صحة البيانات.")
        setError(errMsg)
        return { ok: false, error: errMsg }
      }
    },
    [t],
  )

  const logout = useCallback(async () => {
    try {
      await accountService.logout()
    } finally {
      setUser(null)
      setOrders([])
    }
  }, [])

  const updateProfile = useCallback(
    async (
      data: Partial<CustomerUser> | Record<string, unknown>,
    ): Promise<{ ok: boolean; error?: string }> => {
      setError(null)
      try {
        const updated = await accountService.updateProfile(data)
        setUser(updated)
        return { ok: true }
      } catch (err) {
        console.error("Update profile failed:", err)
        const errMsg =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
            ? err.message
            : t("تعذر حفظ التعديلات.")
        setError(errMsg)
        return { ok: false, error: errMsg }
      }
    },
    [t],
  )

  return (
    <AccountContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        orders,
        ordersLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        refreshOrders,
        refreshProfile,
        clearError,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return ctx
}
