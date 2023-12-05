const request = require('supertest');
const app = require('./server');

describe('App API Tests', () => {

  // Test for creating a new user
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/users').send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('userId');
    });
  });

  // Test for retrieving all items
  describe('GET /items', () => {
    it('should return all items', async () => {
      const res = await request(app).get('/items').send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  // Test for adding an item to the user's cart
  describe('POST /users/:userId/cart', () => {
    let userId;

    // Creating a new user for the cart tests
    beforeAll(async () => {
      const userRes = await request(app).post('/users').send();
      userId = userRes.body.userId;
    });

    it('should add an item to the user cart', async () => {
      const res = await request(app).post(`/users/${userId}/cart`).send({ itemId: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: 1 })]));
    });

    it('should return 404 for invalid user ID', async () => {
      const res = await request(app).post('/users/invalid/cart').send({ itemId: 1 });
      expect(res.statusCode).toEqual(404);
    });

    it('should return 404 for invalid item ID', async () => {
      const res = await request(app).post(`/users/${userId}/cart`).send({ itemId: 999 });
      expect(res.statusCode).toEqual(404);
    });
  });

  // Test for checking out the user's cart
  describe('POST /users/:userId/checkout', () => {
    let userId;

    // Creating a new user and adding an item to cart
    beforeAll(async () => {
      const userRes = await request(app).post('/users').send();
      userId = userRes.body.userId;
      await request(app).post(`/users/${userId}/cart`).send({ itemId: 1 });
    });

    it('should checkout user cart', async () => {
      const res = await request(app).post(`/users/${userId}/checkout`).send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('checkedOutItems');
      expect(res.body.checkedOutItems.length).toBeGreaterThan(0);
    });

    it('should return 404 for invalid user ID', async () => {
      const res = await request(app).post('/users/invalid/checkout').send();
      expect(res.statusCode).toEqual(404);
    });

    it('should return 404 for empty cart', async () => {
      // Creating a new user with an empty cart
      const newUserRes = await request(app).post('/users').send();
      const newUserId = newUserRes.body.userId;

      const res = await request(app).post(`/users/${newUserId}/checkout`).send();
      expect(res.statusCode).toEqual(404);
    });
  });

  // Test for viewing a user's cart
  describe('GET /users/:userId/cart', () => {
    let userId;
  
    // Creating a new user for the cart tests
    beforeAll(async () => {
      const userRes = await request(app).post('/users').send();
      userId = userRes.body.userId;
      await request(app).post(`/users/${userId}/cart`).send({ itemId: 1 });
    });
  
    it('should return the user cart', async () => {
      const res = await request(app).get(`/users/${userId}/cart`).send();
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    it('should return 404 for invalid user ID', async () => {
      const res = await request(app).get('/users/invalid/cart').send();
      expect(res.statusCode).toEqual(404);
    });
  });
  
  // Test for getting application stats
  describe('GET /admin/stats/', () => {
    it('should return application stats', async () => {
      const res = await request(app).get('/admin/stats/').send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('itemsPurchasedCount');
      expect(res.body).toHaveProperty('totalPurchaseAmount');
      expect(res.body).toHaveProperty('discountAmount');
      expect(res.body).toHaveProperty('discountList');
    });
  });
});