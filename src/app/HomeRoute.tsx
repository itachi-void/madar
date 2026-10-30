import { Navigate, useSearchParams } from "react-router"
import Home from "../components/Home"
import { MissingPage } from "./MissingPage"

export function HomeRoute() {
  const [search] = useSearchParams()
  if (search.get("page_id") === "3")
    return <Navigate to="/policies/#privacy" replace />
  return search.has("page_id") ? <MissingPage sourceMissing /> : <Home />
}
