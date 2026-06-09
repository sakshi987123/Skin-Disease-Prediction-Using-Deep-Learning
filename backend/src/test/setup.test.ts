import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import { config } from '../config/config';

describe('Backend Setup Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    if (config.NODE_ENV !== 'test') {
      process.env.NODE_ENV = 'test';
    }
    
    try {
      await mongoose.connect(config.MONGODB_TEST_URI);
      console.log('Connected to test database');
    } catch (error) {
      console.error('Failed to connect to test database:', error);
    }
  });

  afterAll(async () => {
    // Clean up test database
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
  });

  it('should have valid configuration', () => {
    expect(config.NODE_ENV).toBeDefined();
    expect(config.PORT).toBeDefined();
    expect(config.MONGODB_URI).toBeDefined();
    expect(config.JWT_SECRET).toBeDefined();
  });

  it('should connect to database', async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('should have required environment variables', () => {
    const requiredVars = [
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'OTP_SECRET'
    ];

    requiredVars.forEach(varName => {
      expect(process.env[varName]).toBeDefined();
    });
  });
});
