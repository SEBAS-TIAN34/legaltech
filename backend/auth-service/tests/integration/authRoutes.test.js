const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

const JWT_SECRET = 'your-secret-key';

const app = require('../../src/server');

describe('Auth Service - Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('debería registrar nuevo usuario exitosamente (mock)', async () => {
      const mockUser = {
        _id: 'new-user-id',
        email: 'new@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'lawyer',
        comparePassword: jest.fn().mockResolvedValue(true),
        updateLastLogin: jest.fn().mockResolvedValue(true)
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'new@test.com',
          password: 'test123',
          role: 'lawyer'
        });

      expect(response.status).toBe(201);
    });

    it('debería rechazar email duplicado (mock)', async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: 'exists@test.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'exists@test.com',
          password: 'test123'
        });

      expect(response.status).toBe(400);
    });

    it('debería validar email requerido', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          password: 'test123'
        });

      expect(response.status).toBe(400);
    });

    it('debería validar password requerido', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('debería iniciar sesión exitosamente (mock)', async () => {
      const mockUser = {
        _id: 'login-user-id',
        email: 'login@test.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        updateLastLogin: jest.fn().mockResolvedValue(true)
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'test123'
        });

      expect(response.status).toBe(200);
    });

    it('debería rechazar credenciales inválidas (mock)', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'wrongpass'
        });

      expect(response.status).toBe(401);
    });

    it('debería rechazar usuario inactivo', async () => {
      User.findOne = jest.fn().mockResolvedValue({ isActive: false });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inactive@test.com',
          password: 'test123'
        });

      expect(response.status).toBe(401);
    });

    it('debería validar formato de email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'test123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /health', () => {
    it('debería retornar estado healthy', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
    });
  });

  describe('Token Validation', () => {
    it('debería validar token JWT correctamente', () => {
      const token = jwt.sign({ userId: 'test-123' }, JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET);
      
      expect(decoded.userId).toBe('test-123');
    });

    it('debería rechazar token inválido', () => {
      expect(() => {
        jwt.verify('invalid-token', JWT_SECRET);
      }).toThrow();
    });

    it('debería rechazar token con firma incorrecta', () => {
      const token = jwt.sign({ userId: 'test' }, 'wrong-secret');
      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow();
    });
  });
});