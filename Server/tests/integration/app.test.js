import request from 'supertest';
import app from '../../src/app.js';

describe('App Integration Tests', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/unknown');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });

  it('should have basic security headers from helmet', async () => {
    const res = await request(app).get('/api/v1/auth/login'); // Any route
    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    expect(res.headers).toHaveProperty('x-frame-options');
  });
});
