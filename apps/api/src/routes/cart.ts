import { Router, Request, Response } from 'express';
import { CartItem, CartSummary, ApiResponse } from '@ecommerce/shared-types';

export const cartRouter = Router();

// In-memory cart store
let cartItems: CartItem[] = [];

/**
 * Calculates current cart summary with tax, shipping, discounts
 */
export function calculateSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal > 0 ? subtotal * 0.08 : 0; // 8% sales tax
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99; // Free shipping over $100
  const discount = subtotal > 200 ? 20.0 : 0; // $20 discount over $200
  const total = Math.max(0, subtotal + tax + shipping - discount);

  return {
    items,
    totalItems,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

// GET /api/cart
cartRouter.get('/', (req: Request, res: Response) => {
  const summary = calculateSummary(cartItems);
  const response: ApiResponse<CartSummary> = {
    success: true,
    data: summary
  };
  res.json(response);
});

// POST /api/cart (add product to cart)
cartRouter.post('/', (req: Request, res: Response) => {
  const { productId, name, price, quantity = 1, image, category } = req.body;

  if (!productId || !name || price === undefined) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Missing required item fields: productId, name, or price.'
    };
    return res.status(400).json(errorResponse);
  }

  const existingIndex = cartItems.findIndex((item) => item.productId === productId);

  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity += Number(quantity);
  } else {
    const newItem: CartItem = {
      id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      productId,
      name,
      price: Number(price),
      quantity: Number(quantity),
      image: image || '',
      category: category || 'General'
    };
    cartItems.push(newItem);
  }

  const summary = calculateSummary(cartItems);
  res.status(201).json({
    success: true,
    data: summary,
    message: 'Item added to cart successfully.'
  });
});

// PUT /api/cart/:id (update quantity)
cartRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || Number(quantity) < 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid quantity provided.'
    });
  }

  const index = cartItems.findIndex((item) => item.id === id || item.productId === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Cart item '${id}' not found.`
    });
  }

  if (Number(quantity) === 0) {
    cartItems.splice(index, 1);
  } else {
    cartItems[index].quantity = Number(quantity);
  }

  const summary = calculateSummary(cartItems);
  res.json({
    success: true,
    data: summary,
    message: 'Cart updated successfully.'
  });
});

// DELETE /api/cart/:id (remove single item)
cartRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = cartItems.length;
  cartItems = cartItems.filter((item) => item.id !== id && item.productId !== id);

  if (cartItems.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: `Cart item '${id}' not found.`
    });
  }

  const summary = calculateSummary(cartItems);
  res.json({
    success: true,
    data: summary,
    message: 'Item removed from cart.'
  });
});

// DELETE /api/cart (clear cart)
cartRouter.delete('/', (req: Request, res: Response) => {
  cartItems = [];
  const summary = calculateSummary(cartItems);
  res.json({
    success: true,
    data: summary,
    message: 'Cart cleared successfully.'
  });
});
