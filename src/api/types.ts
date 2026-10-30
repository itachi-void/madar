/**
 * Madar API Types
 * Strictly aligned with madar-headless v1.1.0 and WooCommerce Store API responses.
 */

export type LocaleCode = 'eg' | 'sa' | 'en' | 'fr' | 'es';

export interface ApiErrorResponse {
  code: string;
  message: string;
  data?: {
    status: number;
    [key: string]: unknown;
  };
}

export interface StorePaymentMethod {
  id: string;
  title: string;
}

export interface CountryFieldRequirements {
  state: boolean;
  postcode: boolean;
  city: boolean;
  address_1: boolean;
}

export interface CountryInfo {
  name: string;
  states: Record<string, string>;
  required: CountryFieldRequirements;
}

export interface StoreSettings {
  name: string;
  currency: string;
  currency_symbol: string;
  price_decimals: number;
  locales: LocaleCode[];
  payment_methods: StorePaymentMethod[];
  countries: Record<string, CountryInfo>;
  default_country: string;
  size_charts: Record<string, unknown>;
  store_api: string;
}

export type ProductImageRole = 'on_model' | 'front' | 'back' | 'detail_1' | 'detail_2' | 'gallery' | 'variation' | 'main' | 'detail' | 'macro';

export interface ProductImage {
  id: number;
  url: string;
  width: number;
  height: number;
  alt: string;
  role?: ProductImageRole;
  concept?: boolean;
}

export interface ProductAttributeOption {
  value: string;
  label: string;
}

export interface ProductAttribute {
  key: string;
  name: string;
  label: string;
  variation: boolean;
  options: ProductAttributeOption[];
}

export interface ProductVariation {
  id: number;
  sku: string;
  attributes: Record<string, string>;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  in_stock: boolean;
  purchasable: boolean;
  stock_quantity: number | null;
  image: ProductImage | null;
}

export interface ProductHotspot {
  id: string;
  x: number;
  y: number;
  view: string;
  image_role: string;
  label: string;
  text: string;
}

export interface ProductModelInfo {
  height_cm: number | null;
  size: string;
}

export interface ProductPriceSummary {
  min: number | null;
  max: number | null;
  regular_min: number | null;
  currency: string;
  on_sale: boolean;
}

export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
}

export interface ProductMadarMeta {
  styling_only: boolean;
  pairs: number[];
  materials: number[];
  hotspots: ProductHotspot[];
  fit: string;
  care: string;
  size_chart: string;
  model: ProductModelInfo | null;
}

export interface Product {
  id: number;
  slug: string;
  path: string;
  sku: string;
  type: 'simple' | 'variable';
  name: string;
  short_description: string;
  description: string;
  categories: ProductCategory[];
  audience: 'men' | 'kids' | string;
  price: ProductPriceSummary;
  in_stock: boolean;
  purchasable: boolean;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  madar: ProductMadarMeta;
}

export interface Look {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  audience: string;
  occasion: string;
  palette: string;
  products: number[];
  image: ProductImage | null;
  detail_image: ProductImage | null;
}

export interface Material {
  id: number;
  slug: string;
  name: string;
  story: string;
  care: string;
  composition: string | null;
  products: number[];
  image: ProductImage | null;
}

export interface CatalogQueryParams {
  lang?: LocaleCode | string;
  audience?: 'men' | 'kids' | '';
  ids?: number[] | string;
}

// ==========================================
// WooCommerce Store API Cart Interfaces (/wc/store/v1/cart)
// ==========================================

export interface StoreCartItemPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: unknown | null;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreCartItemTotals {
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total: string;
  line_total_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
}

export interface StoreCartItemVariation {
  raw_attribute: string;
  attribute: string;
  value: string;
}

export interface StoreCartItemQuantityLimits {
  minimum: number;
  maximum: number;
  multiple_of: number;
  editable: boolean;
}

export interface StoreCartItem {
  key: string;
  id: number;
  type: string;
  quantity: number;
  quantity_limits: StoreCartItemQuantityLimits;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  permalink: string;
  images: Array<{
    id: number;
    src: string;
    thumbnail: string;
    name: string;
    alt: string;
  }>;
  variation: StoreCartItemVariation[];
  prices: StoreCartItemPrices;
  totals: StoreCartItemTotals;
}

export interface StoreCartTotals {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string | null;
  total_shipping_tax: string | null;
  total_price: string;
  total_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreCartCoupon {
  code: string;
  discount_type: string;
  totals: {
    total_discount: string;
    total_discount_tax: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
  };
}

export interface StoreCart {
  items: StoreCartItem[];
  coupons: StoreCartCoupon[];
  totals: StoreCartTotals;
  items_count: number;
  needs_payment: boolean;
  needs_shipping: boolean;
  errors?: Array<{ code: string; message: string }>;
}

export interface AddToCartVariationParam {
  attribute: string;
  value: string;
}

export interface AddToCartParams {
  id: number;
  quantity?: number;
  variation?: AddToCartVariationParam[];
}

export interface UpdateCartItemParams {
  key: string;
  quantity: number;
}

// ==========================================
// WooCommerce Store API Checkout Interfaces (/wc/store/v1/checkout)
// ==========================================

export interface StoreAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode?: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface CheckoutOrderPayload {
  billing_address: StoreAddress;
  shipping_address?: StoreAddress;
  customer_note?: string;
  payment_method: string;
  payment_data?: Array<{ key: string; value: string }>;
}

export interface CheckoutOrderResponse {
  order_id: number;
  status: string;
  order_key: string;
  order_number: string;
  customer_note: string;
  customer_id: number;
  billing_address: StoreAddress;
  shipping_address: StoreAddress;
  payment_method: string;
  payment_result?: {
    payment_status: string;
    redirect_url?: string;
    payment_details?: Array<{ key: string; value: string }>;
  };
}

export interface PlacedOrderReceipt {
  orderId: number;
  orderNumber: string;
  orderKey: string;
  status: string;
  date: string;
  paymentMethod: string;
  paymentMethodTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressFormatted: string;
  customerNote?: string;
  lines: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    options: string;
    image?: string;
  }>;
  totalFormatted: string;
  subtotalFormatted?: string;
}

// ==========================================
// Customer Account & Auth Interfaces (/madar/v1/auth & /madar/v1/me)
// ==========================================

export interface CustomerUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing: StoreAddress;
  shipping: StoreAddress;
}

export interface AuthResponse {
  token: string;
  expires_at: string;
  user: CustomerUser;
}

export interface CustomerOrderLine {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  sku: string;
  price: number;
  image?: string;
}

export interface CustomerOrder {
  id: number;
  status: string;
  currency: string;
  date_created: string;
  total: string;
  billing: StoreAddress;
  shipping: StoreAddress;
  payment_method: string;
  payment_method_title: string;
  line_items: CustomerOrderLine[];
}



