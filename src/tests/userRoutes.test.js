// tests/userRoutes.test.js
import request from 'supertest';
import app from '../src/index.js';
import db from '../config/database.js';
import jwt from 'jsonwebtoken';

let token;
beforeAll(async () => {
  // Connexion pour obtenir un token
  const response = await request(app)
    .post('/api/users/login')
    .send({ email: 'aissatou@gmail.com', password: 'password1' });
  token = response.body.token;
});

describe('User Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ name: 'New User', email: 'newuser@gmail.com', password: 'password6', type: 'client' });
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.token).toBeDefined();
  });

  it('should login a user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'aissatou@gmail.com', password: 'password1' });
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.token).toBeDefined();
  });

  it('should logout a user', async () => {
    const response = await request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
  });

  it('should get a user by id', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should update a user', async () => {
    const response = await request(app)
      .put('/api/users/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Name');
  });

  it('should delete a user', async () => {
    const response = await request(app)
      .delete('/api/users/5')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get user profile', async () => {
    const response = await request(app)
      .get('/api/users/1/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });
});

afterAll(() => {
  // Clean up and reset the database if necessary
});
