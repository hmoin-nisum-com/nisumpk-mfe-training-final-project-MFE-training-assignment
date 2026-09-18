import { create } from 'zustand';
import { Currency, AppNotification } from '@ecommerce/shared-types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  membership: 'Standard' | 'Silver' | 'Gold VIP';
}

export interface AppState {
  // Application Data
  user: UserProfile;
  currency: Currency;
  exchangeRates: Record<Currency, number>;
  cartCount: number;
  activeView: 'products' | 'cart' | 'architecture';
  toasts: AppNotification[];

  // Actions
  setCurrency: (currency: Currency) => void;
  setCartCount: (count: number) => void;
  incrementCartCount: (by?: number) => void;
  setActiveView: (view: 'products' | 'cart' | 'architecture') => void;
  addToast: (toast: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79
};

/**
 * Global Shared Store for the E-Commerce Micro Frontend platform
 */
export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 'usr_nisum_101',
    name: 'Sarah Jenkins',
    email: 'sarah.j@nisum.com',
    membership: 'Gold VIP'
  },
  currency: 'USD',
  exchangeRates: DEFAULT_RATES,
  cartCount: 0,
  activeView: 'products',
  toasts: [],

  setCurrency: (currency: Currency) => set({ currency }),

  setCartCount: (count: number) => set({ cartCount: Math.max(0, count) }),

  incrementCartCount: (by = 1) =>
    set((state) => ({ cartCount: Math.max(0, state.cartCount + by) })),

  setActiveView: (activeView) => set({ activeView }),

  addToast: (toast) =>
    set((state) => {
      const id = 'toast_' + Math.random().toString(36).substr(2, 9);
      const newToast: AppNotification = {
        ...toast,
        id,
        timestamp: Date.now()
      };
      return { toasts: [...state.toasts, newToast] };
    }),

  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
}));
