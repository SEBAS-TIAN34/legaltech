const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/Notification');
jest.mock('jsonwebtoken');

const app = require('../../src/index');
const Notification = require('../../src/models/Notification');

const JWT_SECRET = 'your-secret-key';

describe('Notifications Service - Integration Tests', () => {
  let token;
  
  beforeAll(() => {
    token = jwt.sign({ userId: 'test-user-123' }, JWT_SECRET);
  });

  describe('POST /api/notifications', () => {
    it('debería crear notificación exitosamente', async () => {
      const mockNotification = {
        _id: 'notif-id-123',
        userId: 'user-123',
        title: 'Nueva Notificación',
        message: 'Contenido',
        type: 'info'
      };

      Notification.create = jest.fn().mockResolvedValue(mockNotification);

      const response = await request(app)
        .post('/api/notifications/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: 'user-123',
          title: 'Nueva Notificación',
          message: 'Contenido',
          type: 'info'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('debería rechazar notificación sin título', async () => {
      const response = await request(app)
        .post('/api/notifications/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: 'user-123',
          message: 'Sin título'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/notifications', () => {
    it('debería listar notificaciones del usuario', async () => {
      const mockNotifications = [
        { _id: '1', title: 'Notif 1' },
        { _id: '2', title: 'Notif 2' }
      ];

      Notification.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockNotifications)
      });

      const response = await request(app)
        .get('/api/notifications/')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('debería filtrar por tipo', async () => {
      const response = await request(app)
        .get('/api/notifications/?type=warning')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('debería marcar notificación como leída', async () => {
      const updatedNotification = {
        _id: 'notif-123',
        isRead: true,
        readAt: new Date()
      };

      Notification.findById = jest.fn().mockResolvedValue(updatedNotification);
      updatedNotification.save = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .put('/api/notifications/notif-123/read')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/notifications/read-all', () => {
    it('debería marcar todas como leídas', async () => {
      Notification.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 5 });

      const response = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'user-123' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('debería eliminar notificación', async () => {
      const mockNotification = { _id: 'notif-123' };
      
      Notification.findById = jest.fn().mockResolvedValue(mockNotification);
      Notification.findByIdAndDelete = jest.fn().mockResolvedValue(mockNotification);

      const response = await request(app)
        .delete('/api/notifications/notif-123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /health', () => {
    it('debería retornar estado healthy', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
    });
  });
});