import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import { useAppStore } from '@ecommerce/state';

// Mock remote module imports for Jest environment
jest.mock('mfe_product/ProductList', () => {
  return function MockProductList() {
    return <div data-testid="mock-product-list">Mock Remote Product List</div>;
  };
}, { virtual: true });

jest.mock('mfe_cart/CartView', () => {
  return function MockCartView() {
    return <div data-testid="mock-cart-view">Mock Remote Cart View</div>;
  };
}, { virtual: true });

jest.mock('mfe_cart/CartBadge', () => {
  return function MockCartBadge(props: any) {
    return (
      <button data-testid="mock-cart-badge" onClick={props.onClick}>
        Cart (0)
      </button>
    );
  };
}, { virtual: true });

describe('Gateway Shell Application', () => {
  beforeEach(() => {
    useAppStore.setState({
      activeView: 'products',
      currency: 'USD',
      cartCount: 0
    });
  });

  test('renders gateway shell header and branding', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('NISUM STORE')).toBeInTheDocument();
    expect(screen.getByText('Micro Frontend Platform')).toBeInTheDocument();
    expect(screen.getByText('Catalog (MFE 1)')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart (MFE 2)')).toBeInTheDocument();
    expect(screen.getByText('Architecture & Health')).toBeInTheDocument();
  });

  test('navigates between views when navigation buttons are clicked', async () => {
    await act(async () => {
      render(<App />);
    });

    // Default view is products
    expect(screen.getByTestId('mock-product-list')).toBeInTheDocument();

    // Click Cart button
    const cartButton = screen.getByText('Shopping Cart (MFE 2)');
    await act(async () => {
      fireEvent.click(cartButton);
    });
    expect(screen.getByTestId('mock-cart-view')).toBeInTheDocument();

    // Click Architecture button
    const archButton = screen.getByText('Architecture & Health');
    await act(async () => {
      fireEvent.click(archButton);
    });
    expect(screen.getByText('Micro Frontend Platform Topology')).toBeInTheDocument();
  });

  test('updates global currency through header dropdown', async () => {
    await act(async () => {
      render(<App />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: 'EUR' } });
    });

    expect(useAppStore.getState().currency).toBe('EUR');
  });
});
