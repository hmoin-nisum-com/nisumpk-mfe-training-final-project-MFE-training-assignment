import { Currency } from '@ecommerce/shared-types';

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£'
};

/**
 * Formats a USD base amount to the chosen target currency
 */
export function formatCurrency(
  amountInUSD: number,
  currency: Currency = 'USD',
  rates: Record<Currency, number> = EXCHANGE_RATES
): string {
  const rate = rates[currency] || 1.0;
  const converted = amountInUSD * rate;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${converted.toFixed(2)}`;
}

/**
 * Safely reads environment variables from window/process with fallback
 */
export function getEnv(key: string, fallback: string = ''): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__[key]) {
    return (window as any).__ENV__[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
}

export const API_BASE_URL = getEnv('API_URL', 'http://localhost:3000');

/**
 * Standard fetch helper with error handling and response unwrapping
 */
export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error || errJson.message) {
        errorDetail = errJson.error || errJson.message;
      }
    } catch {
      // ignore json parse error on non-json error responses
    }
    throw new Error(errorDetail);
  }

  return (await response.json()) as T;
}
