import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartView } from './components/CartView';
import { NISUM } from '@ecommerce/events';
import { useAppStore } from '@ecommerce/state';

// Mock fetch for cart API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: { items: [], totalItems: 0, total: 0 } })
  } as any)
);

describe('Cart MFE - CartView Component', () => {
  beforeEach(() => {
    useAppStore.setState({
      currency: 'USD',
      cartCount: 0,
      user: {
        id: 'u1',
        name: 'Alex Tester',
        email: 'alex@test.com',
        membership: 'Gold VIP'
      }
    });
    jest.clearAllMocks();
  });

  test('renders empty cart state by default', async () => {
    await act(async () => {
      render(<CartView />);
    });

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText(/Your shopping cart is empty/i)).toBeInTheDocument();
  });

  test('receives cart:item-added event from Product MFE and displays item', async () => {
    await act(async () => {
      render(<CartView />);
    });

    // Simulate Product MFE emitting cart:item-added event
    await act(async () => {
      NISUM.emit('cart:item-added', {
        product: {
          id: 'prod_dynamic',
          name: 'Wireless ANC Headphones',
          description: 'Great sound',
          price: 299.99,
          category: 'Audio',
          rating: 4.9,
          stock: 10,
          image: ''
        },
        quantity: 1,
        timestamp: Date.now()
      });
    });

    // Assert that the item was dynamically added to CartView
    expect(screen.getByText('Wireless ANC Headphones')).toBeInTheDocument();
    expect(screen.getByText('Order Summary (USD)')).toBeInTheDocument();
  });
});
