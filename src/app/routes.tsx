import { createBrowserRouter } from "react-router"
import pages from "../content/pages.json"
import manifest from "../content/route-manifest.json"
import authoredPages from "../content/authored-pages.json"
import { MissingPage } from "./MissingPage"
import { locales } from "../i18n/config"
import { loadLocale } from "../i18n/context"
import { LocaleLayout, LocaleError } from "../i18n/LocaleLayout"

const sourceMarkup = import.meta.glob<string>("../content/pages/*.html", {
  query: "?raw",
  import: "default",
})

const children = [
  {
    index: true,
    lazy: async () => ({
      Component: (await import("./HomeRoute")).HomeRoute,
    }),
  },
  ...pages
    .filter(
      (page) =>
        ![
          "/cart/",
          "/my-account/",
          "/my-account/lost-password/",
          "/shop/",
          "/product-category/men/",
          "/product-category/kids/",
        ].includes(page.path) && !page.path.startsWith("/product/"),
    )
    .map((page) => ({
      path: page.path.slice(1),
      loader: async () => ({
        ...page,
        html: await sourceMarkup[`../content/pages/${page.contentFile}`](),
      }),
      lazy: async () => ({
        Component: (await import("./SourcePage")).SourcePage,
      }),
    })),
  {
    path: "shop/",
    lazy: async () => ({
      Component: (await import("./CatalogPage")).CatalogPage,
    }),
  },
  {
    path: "shop",
    lazy: async () => ({
      Component: (await import("./CatalogPage")).CatalogPage,
    }),
  },
  {
    path: "product-category/men/",
    lazy: async () => ({
      Component: (await import("./CatalogPage")).MenCatalogPage,
    }),
  },
  {
    path: "product-category/men",
    lazy: async () => ({
      Component: (await import("./CatalogPage")).MenCatalogPage,
    }),
  },
  {
    path: "product-category/kids/",
    lazy: async () => ({
      Component: (await import("./CatalogPage")).KidsCatalogPage,
    }),
  },
  {
    path: "product-category/kids",
    lazy: async () => ({
      Component: (await import("./CatalogPage")).KidsCatalogPage,
    }),
  },
  {
    path: "product/:slug/",
    lazy: async () => ({
      Component: (await import("./ProductDetailPage")).ProductDetailPage,
    }),
  },
  {
    path: "product/:slug",
    lazy: async () => ({
      Component: (await import("./ProductDetailPage")).ProductDetailPage,
    }),
  },
  {
    path: "checkout/",
    lazy: async () => ({
      Component: (await import("./CheckoutPage")).CheckoutPage,
    }),
  },
  {
    path: "checkout/order-received/",
    lazy: async () => ({
      Component: (await import("./CheckoutPage")).CheckoutResult,
    }),
  },
  {
    path: "cart/",
    lazy: async () => ({
      Component: (await import("./PreviewCart")).PreviewCart,
    }),
  },
  ...[
    "my-account/",
    "my-account/orders/",
    "my-account/edit-address/",
    "my-account/edit-account/",
  ].map((path) => ({
    path,
    lazy: async () => ({
      Component: (await import("./AccountPage")).AccountPage,
    }),
  })),
  ...["my-account/lost-password/", "my-account/reset-password/"].map(
    (path) => ({
      path,
      lazy: async () => ({
        Component: (await import("./AccountPage")).PasswordPage,
      }),
    }),
  ),
  ...authoredPages.map((page) => ({
    path: page.path.slice(1),
    lazy: async () => ({
      Component:
        page.path === "/style-finder/"
          ? (await import("./StyleFinderPage")).StyleFinderPage
          : (await import("./InformationPages")).InformationPage,
    }),
  })),
  ...manifest
    .filter(
      (route) =>
        route.sourceStatus === 404 &&
        route.path !== "/" &&
        !authoredPages.some((page) => page.path === route.path) &&
        !route.path.startsWith("/product/") &&
        !route.path.startsWith("/product-category/") &&
        route.path !== "/shop/",
    )
    .map((route) => ({
      path: route.path.slice(1),
      element: <MissingPage sourceMissing />,
    })),
  { path: "*", element: <MissingPage /> },
]

export const router = createBrowserRouter(
  locales.map((locale) => ({
    path: locale.prefix || "/",
    id: `locale-${locale.code}`,
    loader: () => loadLocale(locale),
    Component: LocaleLayout,
    ErrorBoundary: LocaleError,
    children,
  })),
)
