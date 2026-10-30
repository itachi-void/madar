/**
 * Madar Catalog Service
 * Handles settings, products, looks, materials, and order confirmations via /madar/v1.
 */

import { apiClient } from '../client';
import type {
  StoreSettings,
  Product,
  Look,
  Material,
  CatalogQueryParams,
} from '../types';

function normalizeLang(lang?: string): string | undefined {
  if (!lang) return undefined;
  const l = lang.toLowerCase();
  if (l === 'ar-eg' || l === 'ar' || l === 'eg') return 'eg';
  if (l === 'ar-sa' || l === 'sa') return 'sa';
  if (l === 'en' || l === 'en-us' || l === 'en-gb') return 'en';
  if (l === 'fr') return 'fr';
  if (l === 'es') return 'es';
  return lang;
}

export const catalogService = {
  /**
   * Fetch global store configuration, currencies, locales, size charts, and supported payment methods.
   */
  async getSettings(): Promise<StoreSettings> {
    return apiClient.get<StoreSettings>('/madar/v1/settings');
  },

  /**
   * Fetch full catalog or filtered by audience (men/kids) or product IDs.
   */
  async getProducts(params?: CatalogQueryParams): Promise<Product[]> {
    const query: Record<string, unknown> = {};

    const cleanLang = normalizeLang(params?.lang);
    if (cleanLang) query.lang = cleanLang;
    if (params?.audience) query.audience = params.audience;
    if (params?.ids) {
      query.ids = Array.isArray(params.ids) ? params.ids.join(',') : params.ids;
    }

    const headers = cleanLang ? { 'X-Madar-Lang': cleanLang } : undefined;
    return apiClient.get<Product[]>('/madar/v1/products', query, { headers });
  },

  /**
   * Fetch a single product by numeric ID.
   */
  async getProduct(id: number, lang?: string): Promise<Product> {
    const query: Record<string, unknown> = {};
    const cleanLang = normalizeLang(lang);
    if (cleanLang) query.lang = cleanLang;

    const headers = cleanLang ? { 'X-Madar-Lang': cleanLang } : undefined;
    return apiClient.get<Product>(`/madar/v1/products/${id}`, query, { headers });
  },

  /**
   * Fetch a single product by URL slug (Arabic or English).
   */
  async getProductBySlug(slug: string, lang?: string): Promise<Product> {
    const query: Record<string, unknown> = { slug };
    const cleanLang = normalizeLang(lang);
    if (cleanLang) query.lang = cleanLang;

    const headers = cleanLang ? { 'X-Madar-Lang': cleanLang } : undefined;
    return apiClient.get<Product>('/madar/v1/product-by-slug', query, { headers });
  },

  /**
   * Fetch editorial curated looks (Orbit / Lookbook).
   */
  async getLooks(lang?: string): Promise<Look[]> {
    const query: Record<string, unknown> = {};
    if (lang) query.lang = lang;

    return apiClient.get<Look[]>('/madar/v1/looks', query);
  },

  /**
   * Fetch material library items (fabrics, stories, composition, care).
   */
  async getMaterials(lang?: string): Promise<Material[]> {
    const query: Record<string, unknown> = {};
    if (lang) query.lang = lang;

    return apiClient.get<Material[]>('/madar/v1/materials', query);
  },

  /**
   * Fetch order confirmation payload using order ID and secret order key.
   */
  async getOrderConfirmation(orderId: number, orderKey: string): Promise<unknown> {
    return apiClient.get('/madar/v1/orders/confirmation', {
      order: orderId,
      key: orderKey,
    });
  },
};
