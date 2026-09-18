import { Router, Request, Response } from 'express';
import { Order, ApiResponse } from '@ecommerce/shared-types';

export const ordersRouter = Router();

const orders: Order[] = [];

// POST /api/orders
ordersRouter.post('/', (req: Request, res: Response) => {
  const { items, totalAmount, customer, currency = 'USD' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Cannot place order with an empty cart.'
    };
    return res.status(400).json(response);
  }

  const newOrder: Order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    items,
    totalAmount: Number(totalAmount) || 0,
    currency,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    customer: customer || {
      name: 'Alex Morgan',
      email: 'alex.morgan@nisum.com',
      shippingAddress: '789 Nisum Way, Silicon Valley, CA'
    }
  };

  orders.unshift(newOrder);

  const response: ApiResponse<Order> = {
    success: true,
    data: newOrder,
    message: 'Order created and confirmed successfully.'
  };

  res.status(201).json(response);
});

// GET /api/orders
ordersRouter.get('/', (req: Request, res: Response) => {
  const response: ApiResponse<Order[]> = {
    success: true,
    data: orders
  };
  res.json(response);
});
