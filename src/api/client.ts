/**
 * Centralized Madar API Client
 * Manages fetch requests, headers, tokens, and errors across madar/v1 and wc/store/v1.
 */

import { tokenStorage } from './tokenStorage';
import type { ApiErrorResponse } from './types';

export class ApiClientError extends Error {
  public code: string;
  public status: number;
  public raw?: unknown;

  constructor(message: string, code = 'unknown_error', status = 500, raw?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.raw = raw;
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Default to local WordPress domain or Vite env override
    const metaEnv = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
    const envUrl = metaEnv?.VITE_API_URL;
    this.baseUrl = (baseUrl || envUrl || 'http://madar.local/wp-json').replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private prepareHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers();

    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    // Language / Locale
    const currentLang = tokenStorage.getLanguage();
    if (currentLang) {
      headers.set('X-Madar-Lang', currentLang);
    }

    // Customer Session Token
    const customerToken = tokenStorage.getCustomerToken();
    if (customerToken) {
      headers.set('X-Madar-Token', customerToken);
    }

    // WooCommerce Store API Cart-Token
    const cartToken = tokenStorage.getCartToken();
    if (cartToken) {
      headers.set('Cart-Token', cartToken);
    }

    // WooCommerce Store API Nonce
    const nonce = tokenStorage.getNonce();
    if (nonce) {
      headers.set('Nonce', nonce);
    }

    if (customHeaders) {
      Object.entries(customHeaders).forEach(([k, v]) => {
        headers.set(k, v);
      });
    }

    return headers;
  }

  private handleResponseHeaders(response: Response): void {
    // WooCommerce Store API returns or rotates the Cart-Token
    const newCartToken = response.headers.get('Cart-Token');
    if (newCartToken) {
      tokenStorage.setCartToken(newCartToken);
    }

    const newNonce = response.headers.get('Nonce');
    if (newNonce) {
      tokenStorage.setNonce(newNonce);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    this.handleResponseHeaders(response);

    if (response.status === 204) {
      return {} as T;
    }

    let data: unknown;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errData = data as ApiErrorResponse | null;
      const code = errData?.code || `http_${response.status}`;
      const message = errData?.message || response.statusText || 'Request failed';

      // If token expired, clear it
      if (response.status === 401 && code === 'madar_invalid_token') {
        tokenStorage.clearCustomerToken();
      }

      throw new ApiClientError(message, code, response.status, data);
    }

    return data as T;
  }

  public async get<T>(path: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, params);
    const headers = this.prepareHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: options?.signal,
    });

    return this.handleResponse<T>(response);
  }

  public async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path);
    const headers = this.prepareHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    return this.handleResponse<T>(response);
  }

  public async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path);
    const headers = this.prepareHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path);
    const headers = this.prepareHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      signal: options?.signal,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
