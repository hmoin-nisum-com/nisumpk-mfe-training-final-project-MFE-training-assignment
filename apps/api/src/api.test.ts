import request from 'supertest';
import { app } from './index';

describe('Backend Express API', () => {
  test('GET /api/health returns UP status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('ecommerce-api-backend');
  });

  test('GET /api/products returns catalog array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0]).toHaveProperty('price');
  });

  test('GET /api/products?category=Audio filters items', async () => {
    const res = await request(app).get('/api/products?category=Audio');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.data.forEach((p: any) => {
      expect(p.category.toLowerCase()).toBe('audio');
    });
  });

  test('GET /api/products/:id returns specific product', async () => {
    const res = await request(app).get('/api/products/prod_01');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('prod_01');
  });

  test('GET /api/products/non_existent returns 404', async () => {
    const res = await request(app).get('/api/products/non_existent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('Cart API workflow: GET, POST, PUT, DELETE', async () => {
    // 1. Initial cart
    const getRes = await request(app).get('/api/cart');
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);

    // 2. Add item
    const postRes = await request(app)
      .post('/api/cart')
      .send({
        productId: 'prod_test_99',
        name: 'Supertest Gadget',
        price: 50.0,
        quantity: 1,
        category: 'Electronics'
      });
    expect(postRes.status).toBe(201);
    expect(postRes.body.data.totalItems).toBeGreaterThan(0);

    const addedItem = postRes.body.data.items.find(
      (i: any) => i.productId === 'prod_test_99'
    );
    expect(addedItem).toBeDefined();

    // 3. Update quantity
    const putRes = await request(app)
      .put(`/api/cart/${addedItem.id}`)
      .send({ quantity: 3 });
    expect(putRes.status).toBe(200);
    const updatedItem = putRes.body.data.items.find(
      (i: any) => i.productId === 'prod_test_99'
    );
    expect(updatedItem.quantity).toBe(3);

    // 4. Delete item
    const delRes = await request(app).delete(`/api/cart/${addedItem.id}`);
    expect(delRes.status).toBe(200);
  });

  test('POST /api/orders places order and returns confirmation', async () => {
    const orderPayload = {
      items: [
        {
          id: 'item_1',
          productId: 'prod_01',
          name: 'Headphones',
          price: 299.99,
          quantity: 1,
          image: '',
          category: 'Audio'
        }
      ],
      totalAmount: 323.99,
      currency: 'USD',
      customer: {
        name: 'Test Customer',
        email: 'test@customer.com',
        shippingAddress: '456 Test Ave'
      }
    };

    const res = await request(app).post('/api/orders').send(orderPayload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('confirmed');
    expect(res.body.data.customer.name).toBe('Test Customer');
  });
});
