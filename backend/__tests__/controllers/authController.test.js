const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/auth', require('../../routes/auth'));

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const user = {
        username: 'testuser',
        password: 'Test123!'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');

      const userInDb = await User.findOne({ username: user.username });
      expect(userInDb).toBeTruthy();
      expect(userInDb.username).toBe(user.username);
      // Password should be hashed
      expect(userInDb.password).not.toBe(user.password);
    });

    it('should not register a duplicate username', async () => {
      const user = {
        username: 'testuser',
        password: 'Test123!'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(user);

      // Attempt duplicate registration
      const res = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      // First register a user
      const user = {
        username: 'testuser',
        password: 'Test123!'
      };

      await request(app)
        .post('/api/auth/register')
        .send(user);

      // Try to login
      const res = await request(app)
        .post('/api/auth/login')
        .send(user);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');

      // Verify token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.user).toBeTruthy();
    });

    it('should not login with incorrect password', async () => {
      // First register a user
      const user = {
        username: 'testuser',
        password: 'Test123!'
      };

      await request(app)
        .post('/api/auth/register')
        .send(user);

      // Try to login with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: user.username,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });

    it('should not login with non-existent username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'Test123!'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });
  });
});