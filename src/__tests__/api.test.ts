import { config } from 'dotenv';
import express, { json } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import request from 'supertest';

import connectDB from '../config/db';
import { requestLogger } from '../middleware/loggerMiddleware';
import { responseMiddleware } from '../middleware/responseMiddleware';
import User from '../models/User';
import authRoutes from '../routes/authRoutes';
import blockRoutes from '../routes/blockRoutes';
import followRoutes from '../routes/followRoutes';

config();

const app = express();
const server = http.createServer(app);

app.use(json());
app.use(requestLogger);
app.use(responseMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/block', blockRoutes);

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
});

describe('API Tests', () => {
  it('should register two users successfully', async () => {
    const response1 = await request(app).post('/api/auth/register').send({
      username: 'testUser1',
      email: 'test1@example.com',
      password: 'testPassword',
    });
    expect(response1.status).toBe(201);

    const response2 = await request(app).post('/api/auth/register').send({
      username: 'testUser2',
      email: 'test2@example.com',
      password: 'testPassword',
    });
    expect(response2.status).toBe(201);
  });

  it('should login successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test2@example.com', password: 'testPassword' });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close(); // Close the database connection
  server.close();
});
