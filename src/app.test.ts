import request from 'supertest';
import { app, server as httpServer } from './app'; // Import app and server
import mongoose from 'mongoose';

// Mock the logger
jest.mock('./config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Mock service initializations called in app.ts
jest.mock('./config/db', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined), // Mocks connectDb
}));

jest.mock('./config/kafka', () => ({
  initKafka: jest.fn().mockResolvedValue(undefined), // Mocks initKafka
  // producer and consumer mocks might still be needed if other parts of the app use them directly
  producer: {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
  },
  consumer: {
    connect: jest.fn().mockResolvedValue(undefined),
    run: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('./config/redis', () => ({
  initRedis: jest.fn().mockResolvedValue(undefined), // Mocks initRedis
  redisClient: { // If redisClient is used directly elsewhere or by initRedis internally
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    quit: jest.fn().mockResolvedValue(undefined),
  }
}));

jest.mock('./kafka/consumer', () => ({
  startConsumer: jest.fn().mockResolvedValue(undefined), // Mocks startConsumer
}));

jest.mock('./socket', () => ({
  initSocketIO: jest.fn(), // Mocks initSocketIO
}));

describe('Health Check Endpoint', () => {
  // No specific beforeAll needed for /health with these mocks

  afterAll(async () => {
    // It's good practice to disconnect mongoose if it was ever connected,
    // though our mocks should prevent actual connections during this test.
    await mongoose.disconnect();
    // httpServer.close() is removed for now to see if it's the cause of the timeout.
    // Supertest should manage its own server instances.
    // The server in app.ts should not be listening in test environment.
  });

  it('should return 200 OK with status: "ok" for GET /health', async () => {
    const response = await request(app).get('/health'); // app is the express instance
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
