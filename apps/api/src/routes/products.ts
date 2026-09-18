import { Router, Request, Response } from 'express';
import { INITIAL_PRODUCTS } from '../data/products';
import { Product, ApiResponse } from '@ecommerce/shared-types';

export const productsRouter = Router();

// In-memory products store
const products: Product[] = [...INITIAL_PRODUCTS];

// GET /api/products (supports ?category=... & search=...)
productsRouter.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;

  let filtered = [...products];

  if (category && typeof category === 'string' && category !== 'All') {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && typeof search === 'string') {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  const response: ApiResponse<Product[]> = {
    success: true,
    data: filtered
  };

  res.json(response);
});

// GET /api/products/:id
productsRouter.get('/:id', (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    const response: ApiResponse<null> = {
      success: false,
      error: `Product with ID '${req.params.id}' not found.`
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<Product> = {
    success: true,
    data: product
  };

  res.json(response);
});
