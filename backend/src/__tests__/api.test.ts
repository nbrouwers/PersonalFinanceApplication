import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

let app: any;
let agent: any;

describe('Transactions API', () => {
  beforeAll(async () => {
    app = (await import('../src/index')).default;
    agent = request.agent(app);
  });

  afterAll(async () => {
    await app.close?.();
  });

  it('GET /health returns ok', async () => {
    const res = await agent.get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/transactions returns array', async () => {
    const res = await agent.get('/api/v1/transactions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });

  it('GET /api/v1/categories returns array', async () => {
    const res = await agent.get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/budgets returns array', async () => {
    const res = await agent.get('/api/v1/budgets');
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/reports/summary returns summary', async () => {
    const res = await agent.get('/api/v1/reports/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('income');
    expect(res.body).toHaveProperty('expense');
    expect(res.body).toHaveProperty('net');
  });
});