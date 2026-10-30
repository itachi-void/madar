/**
 * WooCommerce Store API Cart Service (/wc/store/v1/cart)
 * Manages adding items, variations, updating quantities, removing items, coupons, and totals.
 */

import { apiClient } from '../client';
import type {
  StoreCart,
  AddToCartParams,
  UpdateCartItemParams,
} from '../types';

export const cartService = {
  /**
   * Fetch current session-persisted cart.
   * Store API returns or rotates Cart-Token via headers automatically.
   */
  async getCart(): Promise<StoreCart> {
    return apiClient.get<StoreCart>('/wc/store/v1/cart');
  },

  /**
   * Add a product or variation to cart.
   * If variable, passes variation attributes array.
   */
  async addItem(params: AddToCartParams): Promise<StoreCart> {
    const payload: {
      id: number;
      quantity: number;
      variation?: Array<{ attribute: string; value: string }>;
    } = {
      id: params.id,
      quantity: params.quantity && params.quantity > 0 ? params.quantity : 1,
    };

    if (params.variation && params.variation.length > 0) {
      payload.variation = params.variation;
    }

    return apiClient.post<StoreCart>('/wc/store/v1/cart/add-item', payload);
  },

  /**
   * Update quantity of a line item by key.
   * Setting quantity to 0 removes the item.
   */
  async updateItem(params: UpdateCartItemParams): Promise<StoreCart> {
    if (params.quantity <= 0) {
      return this.removeItem(params.key);
    }
    return apiClient.post<StoreCart>('/wc/store/v1/cart/update-item', {
      key: params.key,
      quantity: params.quantity,
    });
  },

  /**
   * Remove a line item from the cart completely by key.
   */
  async removeItem(key: string): Promise<StoreCart> {
    return apiClient.post<StoreCart>('/wc/store/v1/cart/remove-item', { key });
  },

  /**
   * Apply discount coupon code to current cart.
   */
  async applyCoupon(code: string): Promise<StoreCart> {
    return apiClient.post<StoreCart>('/wc/store/v1/cart/apply-coupon', {
      code: code.trim(),
    });
  },

  /**
   * Remove previously applied coupon code from cart.
   */
  async removeCoupon(code: string): Promise<StoreCart> {
    return apiClient.post<StoreCart>('/wc/store/v1/cart/remove-coupon', {
      code: code.trim(),
    });
  },

  /**
   * Helper to format WooCommerce Store API minor-unit amounts.
   * E.g. "79000" with minor_unit 2 -> "790.00 ج.م"
   */
  formatAmount(
    amountString: string | number | null | undefined,
    currencySymbol = 'ج.م',
    minorUnit = 2,
  ): string {
    if (amountString === null || amountString === undefined) {
      return `0.00 ${currencySymbol}`;
    }
    const num = typeof amountString === 'number' ? amountString : parseFloat(amountString);
    if (isNaN(num)) return `0.00 ${currencySymbol}`;

    const major = num / Math.pow(10, minorUnit);
    return `${major.toLocaleString('en-US', {
      minimumFractionDigits: minorUnit,
      maximumFractionDigits: minorUnit,
    })} ${currencySymbol}`;
  },
};
