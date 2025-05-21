const request = require('supertest');
const app = require('../src/index');

describe('Express Server', () => {
  test('Server should initialize properly', () => {
    expect(app).toBeDefined();
  });

  describe('GET /', () => {
    test('It should respond with Hello World message', async () => {
      const response = await request(app).get('/');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Hello World!');
    });
  });
});

