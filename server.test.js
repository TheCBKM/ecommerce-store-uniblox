const request = require('supertest');
const app = require('./server');

describe('Express App API', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('userId');
  });

  it('should return all items', async () => {
    const res = await request(app)
      .get('/items')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  // Add more tests for other routes...

  // Example: Test for adding an item to a user's cart
  it('should add an item to the user cart', async () => {
    // First, create a user to get a userId
    const userRes = await request(app)
      .post('/users')
      .send();
    const userId = userRes.body.userId;

    // Then, add an item to this user's cart
    const res = await request(app)
      .post(`/users/${userId}/cart`)
      .send({ itemId: 1 }); // Assuming item with id 1 exists
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: 1 })]));
  });

});
