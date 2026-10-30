/**
 * Madar Token & Session Storage
 * Safe localStorage persistence for Cart-Token, Customer X-Madar-Token, and Locale.
 */

const CART_TOKEN_KEY = 'madar_cart_token';
const WC_NONCE_KEY = 'madar_wc_nonce';
const CUSTOMER_TOKEN_KEY = 'madar_customer_token';
const LANGUAGE_KEY = 'madar_current_lang';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const tokenStorage = {
  // Cart-Token (Session-less Cart persistence)
  getCartToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(CART_TOKEN_KEY);
  },

  setCartToken(token: string | null): void {
    if (!isBrowser) return;
    if (token) {
      localStorage.setItem(CART_TOKEN_KEY, token.trim());
    } else {
      localStorage.removeItem(CART_TOKEN_KEY);
    }
  },

  clearCartToken(): void {
    if (!isBrowser) return;
    localStorage.removeItem(CART_TOKEN_KEY);
  },

  // WooCommerce Store API Nonce
  getNonce(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(WC_NONCE_KEY);
  },

  setNonce(nonce: string | null): void {
    if (!isBrowser) return;
    if (nonce) {
      localStorage.setItem(WC_NONCE_KEY, nonce.trim());
    } else {
      localStorage.removeItem(WC_NONCE_KEY);
    }
  },

  clearNonce(): void {
    if (!isBrowser) return;
    localStorage.removeItem(WC_NONCE_KEY);
  },

  // Customer X-Madar-Token (Customer authentication)
  getCustomerToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  },

  setCustomerToken(token: string | null): void {
    if (!isBrowser) return;
    if (token) {
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token.trim());
    } else {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    }
  },

  clearCustomerToken(): void {
    if (!isBrowser) return;
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  },

  // Active Storefront Language / Locale
  getLanguage(): string {
    if (!isBrowser) return 'eg';
    return localStorage.getItem(LANGUAGE_KEY) || 'eg';
  },

  setLanguage(lang: string): void {
    if (!isBrowser) return;
    localStorage.setItem(LANGUAGE_KEY, lang.trim());
  },
};
