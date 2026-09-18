import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './components/ProductCard';
import { Product } from '@ecommerce/shared-types';
import { NISUM } from '@ecommerce/events';
import { useAppStore } from '@ecommerce/state';

const mockProduct: Product = {
  id: 'prod_99',
  name: 'Test Mechanical Keyboard',
  description: 'Custom switches and RGB',
  price: 150,
  category: 'Electronics',
  rating: 4.8,
  stock: 12,
  image: 'https://example.com/keyboard.jpg',
  badge: 'Popular'
};

describe('Product MFE - ProductCard Component', () => {
  beforeEach(() => {
    useAppStore.setState({
      currency: 'USD',
      cartCount: 0
    });
  });

  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Mechanical Keyboard')).toBeInTheDocument();
    expect(screen.getByText('Custom switches and RGB')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('12 in stock')).toBeInTheDocument();
  });

  test('emits cart:item-added event and increments global cart count when clicked', () => {
    const emitSpy = jest.spyOn(NISUM, 'emit');

    render(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /Add to Cart/i });
    fireEvent.click(addButton);

    // Verify NISUM.emit was called with cart:item-added and product details
    expect(emitSpy).toHaveBeenCalledWith(
      'cart:item-added',
      expect.objectContaining({
        product: mockProduct,
        quantity: 1
      })
    );

    // Verify Global State was updated
    expect(useAppStore.getState().cartCount).toBe(1);

    emitSpy.mockRestore();
  });
});
