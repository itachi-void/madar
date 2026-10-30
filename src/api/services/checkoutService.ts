/**
 * WooCommerce Store API Checkout Service (/wc/store/v1/checkout)
 * Handles retrieving checkout configurations and submitting real orders.
 */

import { apiClient } from '../client';
import type {
  CheckoutOrderPayload,
  CheckoutOrderResponse,
  PlacedOrderReceipt,
} from '../types';

const LAST_ORDER_KEY = 'madar_last_order';
const isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

export const checkoutService = {
  /**
   * Fetch current checkout state, addresses, and fees from Store API.
   */
  async getCheckoutData(): Promise<CheckoutOrderResponse> {
    return apiClient.get<CheckoutOrderResponse>('/wc/store/v1/checkout');
  },

  /**
   * Submit real checkout request to WooCommerce Store API.
   * On success, creates a real order in WooCommerce and returns order_id and order_key.
   */
  async placeOrder(payload: CheckoutOrderPayload): Promise<CheckoutOrderResponse> {
    return apiClient.post<CheckoutOrderResponse>('/wc/store/v1/checkout', payload);
  },

  /**
   * Save last placed order receipt to sessionStorage for confirmation page display.
   */
  saveLastOrder(receipt: PlacedOrderReceipt): void {
    if (!isBrowser) return;
    try {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(receipt));
    } catch {
      // Ignore sessionStorage errors
    }
  },

  /**
   * Retrieve last placed order receipt from sessionStorage.
   */
  getLastOrder(): PlacedOrderReceipt | null {
    if (!isBrowser) return null;
    try {
      const data = sessionStorage.getItem(LAST_ORDER_KEY);
      return data ? (JSON.parse(data) as PlacedOrderReceipt) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear stored receipt.
   */
  clearLastOrder(): void {
    if (!isBrowser) return;
    try {
      sessionStorage.removeItem(LAST_ORDER_KEY);
    } catch {
      // Ignore
    }
  },
};
