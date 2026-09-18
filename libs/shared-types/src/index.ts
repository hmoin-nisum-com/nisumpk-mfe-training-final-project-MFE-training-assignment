/**
 * Product Interface representing e-commerce catalog items
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Base price in USD
  category: 'Electronics' | 'Wearables' | 'Audio' | 'Accessories';
  rating: number;
  stock: number;
  image: string;
  badge?: string;
  featured?: boolean;
}

/**
 * Item present in the shopping cart
 */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // Base price in USD
  quantity: number;
  image: string;
  category: string;
}

/**
 * Calculated order & cart summary
 */
export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

/**
 * Customer order confirmation
 */
export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  currency: Currency;
  status: 'confirmed' | 'processing' | 'shipped';
  createdAt: string;
  customer: {
    name: string;
    email: string;
    shippingAddress: string;
  };
}

/**
 * Supported global currencies
 */
export type Currency = 'USD' | 'EUR' | 'GBP';

/**
 * Global application toast notification
 */
export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
  duration?: number;
}

/**
 * Generic API response envelope
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Payloads for the NISUM Event-Driven Architecture
 */
export interface CartItemAddedPayload {
  product: Product;
  quantity: number;
  timestamp: number;
}

export interface CartUpdatedPayload {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface OrderCreatedPayload {
  order: Order;
}

export interface NotificationShowPayload {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export interface CurrencyChangedPayload {
  currency: Currency;
  rate: number;
}

/**
 * Type-safe map of all supported global event names to their payload types
 */
export interface NisumEventMap {
  'cart:item-added': CartItemAddedPayload;
  'cart:updated': CartUpdatedPayload;
  'order:created': OrderCreatedPayload;
  'notification:show': NotificationShowPayload;
  'currency:changed': CurrencyChangedPayload;
  [customEvent: string]: any;
}

/**
 * Global Event Bus interface attached to window.NISUM
 */
export interface NisumEventBus {
  emit<K extends keyof NisumEventMap>(event: K, payload?: NisumEventMap[K]): void;
  emit(event: string, payload?: any): void;
  listener<K extends keyof NisumEventMap>(
    event: K,
    handler: (payload: NisumEventMap[K]) => void
  ): () => void;
  listener(event: string, handler: (payload: any) => void): () => void;
  getHistory?(): Array<{ event: string; payload: any; timestamp: number }>;
}

declare global {
  interface Window {
    NISUM?: NisumEventBus;
  }
}
