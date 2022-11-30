const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockAdmin = {
  firstName: 'Mock',
  lastName: 'Admin',
  email: 'admin',
  password: '123123',
};

const mockUser = {
  firstName: 'Mock',
  lastName: 'User',
  email: 'mock@user.com',
  password: '123123',
};

const mockReview = {
  stars: 3,
  detail: 'OK AT BEST',
};

describe('review routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  test('DELETE /api/v1/reviews/:id lets authorized users delete a review', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockAdmin });

    const admin = await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'admin', password: '123123' });
    expect(admin.status).toBe(200);

    await agent.post('/api/v1/restaurants/1/reviews').send(mockReview);
    const resp = await agent.delete('/api/v1/reviews/4');
    expect(resp.status).toBe(200);

    const checkReview = await agent.get('/api/v1/reviews/4');
    expect(checkReview.status).toBe(404);

    const testResp = await request(app).delete('/api/v1/reviews/1');
    expect(testResp.status).toBe(401);
  });

  test('DELETE /api/v1/reviews/:id lets authenticated users delete their own reviews', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });

    const user = await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'mock@user.com', password: '123123' });
    expect(user.status).toBe(200);

    await agent.post('/api/v1/restaurants/1/reviews').send(mockReview);
    const resp = await agent.delete('/api/v1/reviews/4');
    expect(resp.status).toBe(200);

    const checkReview = await agent.get('/api/v1/reviews/4');
    expect(checkReview.status).toBe(404);

    const testResp = await request(app).delete('/api/v1/reviews/1');
    expect(testResp.status).toBe(401);
  });
});
