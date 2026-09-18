import React, { useEffect, useState, useCallback } from 'react';
import { CartItem, CartSummary, Order, CartItemAddedPayload } from '@ecommerce/shared-types';
import { Card, Button, Badge, Loader } from '@ecommerce/shared-ui';
import { NISUM } from '@ecommerce/events';
import { useAppStore } from '@ecommerce/state';
import { formatCurrency, fetchJson, API_BASE_URL } from '@ecommerce/utilities';

export const CartView: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Global State
  const currency = useAppStore((state) => state.currency);
  const exchangeRates = useAppStore((state) => state.exchangeRates);
  const user = useAppStore((state) => state.user);
  const setCartCount = useAppStore((state) => state.setCartCount);
  const addToast = useAppStore((state) => state.addToast);

  // Calculate summary metrics
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal > 0 ? subtotal * 0.08 : 0;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const discount = subtotal > 200 ? 20.0 : 0;
  const total = Math.max(0, subtotal + tax + shipping - discount);

  // Synchronize cart count with Global State & emit event
  useEffect(() => {
    setCartCount(totalItems);

    NISUM.emit('cart:updated', {
      items,
      totalItems,
      totalAmount: Number(total.toFixed(2))
    });
  }, [items, totalItems, total, setCartCount]);

  // Load cart from Backend API
  const fetchCartFromApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJson<{ success: boolean; data?: CartSummary; error?: string }>(
        `${API_BASE_URL}/api/cart`
      );
      if (res.success && res.data) {
        setItems(res.data.items || []);
      }
    } catch (err: any) {
      console.warn('[CartView] Could not load cart from backend:', err.message);
      // Fallback to local items if backend unreachable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartFromApi();
  }, [fetchCartFromApi]);

  // Register Global Event Listener for cart:item-added (Communication between MFEs)
  useEffect(() => {
    const unsubscribe = NISUM.listener('cart:item-added', (payload: CartItemAddedPayload) => {
      console.info('[Cart MFE] Received "cart:item-added" event from Product MFE:', payload);

      if (!payload || !payload.product) return;
      const { product, quantity = 1 } = payload;

      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.productId === product.id);
        if (existingItem) {
          return prevItems.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          const newItem: CartItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            category: product.category
          };
          return [...prevItems, newItem];
        }
      });

      // Synchronize added item with Backend API asynchronously
      fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          category: product.category
        })
      }).catch((e) => console.warn('[Cart MFE API sync notice]:', e.message));
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Update item quantity
  const handleUpdateQuantity = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const updatedQuantity = item.quantity + delta;

    if (updatedQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: updatedQuantity } : i))
    );

    try {
      await fetch(`${API_BASE_URL}/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: updatedQuantity })
      });
    } catch (e: any) {
      console.warn('[Cart update API notice]:', e.message);
    }
  };

  // Remove single item
  const handleRemoveItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (item) {
      addToast({
        message: `Removed "${item.name}" from cart`,
        type: 'info'
      });
    }

    try {
      await fetch(`${API_BASE_URL}/api/cart/${id}`, {
        method: 'DELETE'
      });
    } catch (e: any) {
      console.warn('[Cart delete API notice]:', e.message);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    setItems([]);
    try {
      await fetch(`${API_BASE_URL}/api/cart`, { method: 'DELETE' });
    } catch (e: any) {
      console.warn('[Cart clear API notice]:', e.message);
    }
  };

  // Checkout process
  const handleCheckout = async () => {
    if (items.length === 0) return;

    setCheckingOut(true);
    setError(null);

    try {
      const orderRequest = {
        items,
        totalAmount: Number(total.toFixed(2)),
        currency,
        customer: {
          name: user.name,
          email: user.email,
          shippingAddress: '789 Nisum Enterprise Blvd, Suite 400'
        }
      };

      const res = await fetchJson<{ success: boolean; data?: Order; error?: string }>(
        `${API_BASE_URL}/api/orders`,
        {
          method: 'POST',
          body: JSON.stringify(orderRequest)
        }
      );

      if (res.success && res.data) {
        setPlacedOrder(res.data);
        setItems([]);

        // Emit global order:created event
        NISUM.emit('order:created', { order: res.data });

        // Emit global notification:show event
        NISUM.emit('notification:show', {
          message: `Order #${res.data.id} confirmed successfully!`,
          type: 'success',
          duration: 5000
        });

        addToast({
          message: `Order #${res.data.id} placed successfully!`,
          type: 'success'
        });

        // Clear backend cart
        fetch(`${API_BASE_URL}/api/cart`, { method: 'DELETE' }).catch(() => {});
      } else {
        setError(res.error || 'Failed to place order.');
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed due to network error.');
    } finally {
      setCheckingOut(false);
    }
  };

  // Render order confirmation screen if order was just placed
  if (placedOrder) {
    return (
      <Card style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
        <Badge variant="success">Order Confirmed</Badge>
        <h2 style={{ fontSize: '1.75rem', margin: '16px 0 8px 0', color: 'var(--color-text-main)' }}>
          Thank you for your purchase!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Your order has been placed and is currently being processed.
        </p>

        <div
          style={{
            backgroundColor: 'var(--color-bg-main)',
            borderRadius: 'var(--border-radius-md)',
            padding: '16px 20px',
            textAlign: 'left',
            marginBottom: '24px',
            border: '1px solid var(--color-border)',
            fontSize: '0.9rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Order ID:</span>
            <span style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>{placedOrder.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Customer:</span>
            <span style={{ fontWeight: 600 }}>{placedOrder.customer.name} ({user.membership})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Charged:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>
              {formatCurrency(placedOrder.totalAmount, placedOrder.currency, exchangeRates)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Date:</span>
            <span>{new Date(placedOrder.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>

        <Button variant="primary" onClick={() => setPlacedOrder(null)}>
          Continue Shopping
        </Button>
      </Card>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 700 }}>
            Shopping Cart
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Customer: {user.name} • {user.membership}
          </span>
        </div>

        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearCart}>
            Clear Cart
          </Button>
        )}
      </div>

      {loading && <Loader label="Loading cart contents..." />}

      {error && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--border-radius-md)',
            color: '#fca5a5',
            marginBottom: '20px'
          }}
        >
          {error}
        </div>
      )}

      {!loading && items.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Your shopping cart is empty</h3>
          <p style={{ color: 'var(--color-text-muted)', margin: '0 0 20px 0', fontSize: '0.9rem' }}>
            Explore the product catalog and click "Add to Cart" to see cross-MFE events in action!
          </p>
        </Card>
      )}

      {!loading && items.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <Card
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '16px 20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Unit Price: {formatCurrency(item.price, currency, exchangeRates)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {/* Quantity controls */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'var(--color-bg-main)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '4px 8px',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-main)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          width: '24px',
                          height: '24px'
                        }}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-main)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          width: '24px',
                          height: '24px'
                        }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div style={{ minWidth: '90px', textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary-light)' }}>
                        {formatCurrency(itemTotal, currency, exchangeRates)}
                      </span>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary Card */}
          <Card
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '24px',
              border: '1px solid var(--color-border)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 600 }}>
              Order Summary ({currency})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal ({totalItems} items):</span>
                <span>{formatCurrency(subtotal, currency, exchangeRates)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Estimated Tax (8%):</span>
                <span>{formatCurrency(tax, currency, exchangeRates)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Shipping:</span>
                <span>{shipping === 0 ? <Badge variant="success">Free</Badge> : formatCurrency(shipping, currency, exchangeRates)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>VIP Discount:</span>
                  <span>-{formatCurrency(discount, currency, exchangeRates)}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  marginTop: '6px',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '1.25rem',
                  fontWeight: 700
                }}
              >
                <span>Total:</span>
                <span style={{ color: 'var(--color-primary-light)' }}>
                  {formatCurrency(total, currency, exchangeRates)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleCheckout}
              isLoading={checkingOut}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Proceed to Checkout ({formatCurrency(total, currency, exchangeRates)})
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
