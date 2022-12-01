const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Mock',
  lastName: 'User',
  email: 'mock@user.com',
  password: '123123',
};

const registerAndLogin = async () => {
  const agent = request.agent(app);
  const user = await UserService.create(mockUser);
  await agent
    .post('/api/v1/users/sessions')
    .send({ email: mockUser.email, password: mockUser.password });
  return [agent, user];
};

describe('restaurant routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  test('GET api/v1/restaurants returns a list of restaurants', async () => {
    const resp = await request(app).get('/api/v1/restaurants');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "cost": 1,
          "cuisine": "American",
          "id": "1",
          "name": "Pip's Original",
        },
        Object {
          "cost": 3,
          "cuisine": "Italian",
          "id": "2",
          "name": "Mucca Osteria",
        },
        Object {
          "cost": 2,
          "cuisine": "Mediterranean",
          "id": "3",
          "name": "Mediterranean Exploration Company",
        },
        Object {
          "cost": 2,
          "cuisine": "American",
          "id": "4",
          "name": "Salt & Straw",
        },
      ]
    `);
  });

  test('GET /api/v1/restaurants/:restid returns a specific restaurant with nested reviews', async () => {
    const resp = await request(app).get('/api/v1/restaurants/1');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "cost": 1,
        "cuisine": "American",
        "id": "1",
        "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
        "name": "Pip's Original",
        "reviews": Array [
          Object {
            "detail": "Best restaurant ever!",
            "id": "1",
            "restaurantId": "1",
            "stars": 5,
            "userId": "1",
          },
          Object {
            "detail": "Terrible service :(",
            "id": "2",
            "restaurantId": "1",
            "stars": 1,
            "userId": "2",
          },
          Object {
            "detail": "It was fine.",
            "id": "3",
            "restaurantId": "1",
            "stars": 4,
            "userId": "3",
          },
        ],
        "website": "http://www.PipsOriginal.com",
      }
    `);
  });

  test('POST /api/v1/restaurants/:restId/reviews allows authenticated users to create a new review', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ stars: 5, detail: 'It was ok' });
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "detail": "It was ok",
        "id": "4",
        "restaurantId": "1",
        "stars": 5,
        "userId": "4",
      }
    `);
  });

  test('POST /api/v1/restaurants/:restId/reviews returns a 401 if user is not authenticated', async () => {
    const resp = await request(app)
      .post('/api/v1/restaurants/1/reviews')
      .send({ stars: 'a million', detail: 'does not matter should not save' });
    expect(resp.status).toBe(401);
  });
});
