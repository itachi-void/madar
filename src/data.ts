import catalog from "./content/catalog.json"

const img = (name: string) => `/images/${name}.jpg`

export const productPath = (slugOrId: string | number) => {
  if (typeof slugOrId === "string" && slugOrId) {
    const clean = slugOrId.replace(/^\/product\//, "").replace(/\/$/, "");
    return `/product/${clean}/`;
  }
  if (typeof slugOrId === "number") {
    const found = catalog.find((product) => product.id === slugOrId);
    if (found?.path) return found.path;
  }
  return "/shop/";
};

export const products = [
  {
    id: 141,
    cat: "MEN",
    name: "معطف الصوف البكر بلون الجمل",
    main: img("coat-camel"),
    alt: img("coat-camel-alt"),
    price: 1490,
    was: 1890,
    note: "قصّة عادية أو مريحة · خياران للّون",
  },
  {
    id: 98,
    cat: "MEN",
    name: "بدلة إيقاع المدينة الكحلية",
    main: img("suit-navy"),
    alt: img("suit-navy-alt"),
    price: 2190,
    was: 2490,
    note: "قصّة عادية أو مريحة · خياران للّون",
  },
  {
    id: 86,
    cat: "MEN",
    name: "كنزة الكشمير بالياقة العالية",
    main: img("knit-cream"),
    alt: img("knit-cream-alt"),
    price: 790,
    was: null,
    note: "قصّة عادية أو مريحة · خياران للّون",
  },
  {
    id: 111,
    cat: "KIDS",
    name: "جاكيت المغامرات الشتوي للأطفال",
    main: img("kids-adventure"),
    alt: img("kids-adventure-alt"),
    price: 520,
    was: null,
    note: "مقاسات عمرية · خياران للّون",
  },
]

export const trailImages = [
  "coat-camel",
  "kids-adventure",
  "suit-navy",
  "knit-cream",
].map(img)
export { img }

export const formatPrice = (n: number | null | undefined, currency = "ج.م") => {
  if (n === null || n === undefined) return "";
  return `${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 })} ${currency}`;
};
