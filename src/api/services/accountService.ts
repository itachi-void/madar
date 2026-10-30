/**
 * Madar Customer Account & Authentication Service (/madar/v1/auth & /madar/v1/me)
 */

import { apiClient } from '../client';
import { tokenStorage } from '../tokenStorage';
import type {
  CustomerUser,
  AuthResponse,
  CustomerOrder,
} from '../types';

export const accountService = {
  /**
   * Login customer and store X-Madar-Token.
   */
  async login(login: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/madar/v1/auth/login', {
      login: login.trim(),
      password,
    });
    if (res.token) {
      tokenStorage.setCustomerToken(res.token);
    }
    return res;
  },

  /**
   * Register a new customer and store X-Madar-Token.
   */
  async register(params: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/madar/v1/auth/register', {
      email: params.email.trim(),
      password: params.password,
      first_name: params.first_name?.trim() || '',
      last_name: params.last_name?.trim() || '',
    });
    if (res.token) {
      tokenStorage.setCustomerToken(res.token);
    }
    return res;
  },

  /**
   * Logout current customer session and clear stored token.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/madar/v1/auth/logout');
    } catch {
      // Continue cleanup even if server session is already invalid
    } finally {
      tokenStorage.clearCustomerToken();
    }
  },

  /**
   * Fetch current authenticated customer profile.
   */
  async getProfile(): Promise<CustomerUser> {
    return apiClient.get<CustomerUser>('/madar/v1/me');
  },

  /**
   * Update customer profile, billing, or shipping address.
   */
  async updateProfile(data: Partial<CustomerUser> | Record<string, unknown>): Promise<CustomerUser> {
    return apiClient.put<CustomerUser>('/madar/v1/me', data);
  },

  /**
   * Fetch order history for the current customer.
   */
  async getOrders(): Promise<CustomerOrder[]> {
    return apiClient.get<CustomerOrder[]>('/madar/v1/me/orders');
  },

  /**
   * Request password reset email.
   */
  async lostPassword(login: string, lang = 'eg'): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/madar/v1/auth/password/lost', {
      login: login.trim(),
      lang,
    });
  },

  /**
   * Reset password with key.
   */
  async resetPassword(params: {
    key: string;
    login: string;
    password: string;
  }): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/madar/v1/auth/password/reset', params);
  },
};
