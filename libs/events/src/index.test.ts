import { NISUM } from './index';

describe('Global Event System (window.NISUM)', () => {
  beforeEach(() => {
    // Clear any existing window listeners if needed
  });

  test('should attach NISUM to global window object', () => {
    expect(window.NISUM).toBeDefined();
    expect(typeof window.NISUM?.emit).toBe('function');
    expect(typeof window.NISUM?.listener).toBe('function');
  });

  test('should successfully emit and receive events with payload', (done) => {
    const testPayload = {
      product: {
        id: 'test_1',
        name: 'Test Headphones',
        description: 'Quality sound',
        price: 99.99,
        category: 'Audio' as const,
        rating: 4.8,
        stock: 10,
        image: ''
      },
      quantity: 2,
      timestamp: Date.now()
    };

    const unsubscribe = NISUM.listener('cart:item-added', (data) => {
      try {
        expect(data).toEqual(testPayload);
        expect(data.product.id).toBe('test_1');
        expect(data.quantity).toBe(2);
        unsubscribe();
        done();
      } catch (err) {
        done(err);
      }
    });

    NISUM.emit('cart:item-added', testPayload);
  });

  test('should allow unsubscribing from events', () => {
    const handler = jest.fn();
    const unsubscribe = NISUM.listener('notification:show', handler);

    NISUM.emit('notification:show', { message: 'Message 1', type: 'info' });
    expect(handler).toHaveBeenCalledTimes(1);

    // Unsubscribe and emit again
    unsubscribe();
    NISUM.emit('notification:show', { message: 'Message 2', type: 'info' });
    expect(handler).toHaveBeenCalledTimes(1); // Should not have been called a second time
  });

  test('should record event history for diagnostic tracking', () => {
    NISUM.emit('order:created', {
      order: {
        id: 'ord_123',
        items: [],
        totalAmount: 150,
        currency: 'USD',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        customer: { name: 'Alice', email: 'alice@test.com', shippingAddress: '123 St' }
      }
    });

    const history = NISUM.getHistory ? NISUM.getHistory() : [];
    expect(history.length).toBeGreaterThan(0);
    const lastEvent = history.find((e) => e.event === 'order:created');
    expect(lastEvent).toBeDefined();
    expect(lastEvent?.payload.order.id).toBe('ord_123');
  });
});
