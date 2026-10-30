import { RouterProvider } from "react-router"
import { router } from "./routes"
import { AccountProvider } from "./AccountContext"
import { CartProvider } from "./CartContext"
import { PreviewProvider } from "./PreviewStore"
import "../theme/wordpress.css"
import "../theme/madar.css"
import "../theme/routes.css"
import "../theme/commerce.css"

export default function App() {
  return (
    <AccountProvider>
      <CartProvider>
        <PreviewProvider>
          <RouterProvider router={router} />
        </PreviewProvider>
      </CartProvider>
    </AccountProvider>
  )
}
