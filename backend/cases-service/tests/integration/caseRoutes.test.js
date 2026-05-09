const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('../../src/models/Case');

const app = require('../../src/index');
const Case = require('../../src/models/Case');

describe('Cases Service - Integration Tests', () => {
  
  describe('POST /api/cases', () => {
    it('debería crear caso exitosamente', async () => {
      const mockCase = {
        _id: 'case-id-123',
        caseNumber: 'CASE-2024-TEST',
        title: 'Caso de Prueba',
        caseType: 'civil',
        priority: 'high',
        status: 'open'
      };

      Case.create = jest.fn().mockResolvedValue(mockCase);

      const response = await request(app)
        .post('/api/cases')
        .send({
          caseNumber: 'CASE-2024-TEST',
          title: 'Caso de Prueba',
          description: 'Descripción de prueba',
          caseType: 'civil',
          priority: 'high',
          clientId: 'client-id-123',
          assignedTo: 'Abogado Test',
          startDate: '2024-01-01'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('debería rechazar caso sin número', async () => {
      const response = await request(app)
        .post('/api/cases')
        .send({
          title: 'Caso sin número',
          caseType: 'civil'
        });

      expect(response.status).toBe(400);
    });

    it('debería validar tipo de caso', async () => {
      const response = await request(app)
        .post('/api/cases')
        .send({
          caseNumber: 'CASE-2024-001',
          title: 'Caso inválido',
          caseType: 'invalid-type'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/cases', () => {
    it('debería listar todos los casos', async () => {
      const mockCases = [
        { _id: '1', caseNumber: 'CASE-001', title: 'Caso 1' },
        { _id: '2', caseNumber: 'CASE-002', title: 'Caso 2' }
      ];

      Case.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCases)
      });

      const response = await request(app).get('/api/cases');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('debería filtrar casos por status', async () => {
      const mockCases = [
        { _id: '1', status: 'open' }
      ];

      Case.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCases)
      });

      const response = await request(app).get('/api/cases?status=open');

      expect(response.status).toBe(200);
    });

    it('debería filtrar casos por priority', async () => {
      const response = await request(app).get('/api/cases?priority=high');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/cases/:id', () => {
    it('debería obtener caso por ID', async () => {
      const mockCase = {
        _id: 'case-123',
        caseNumber: 'CASE-001',
        title: 'Caso específico'
      };

      Case.findById = jest.fn().mockResolvedValue(mockCase);

      const response = await request(app).get('/api/cases/case-123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('debería retornar 404 para caso no existente', async () => {
      Case.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/cases/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/cases/:id', () => {
    it('debería actualizar caso', async () => {
      const updatedCase = {
        _id: 'case-123',
        title: 'Caso actualizado'
      };

      Case.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCase);

      const response = await request(app)
        .put('/api/cases/case-123')
        .send({ title: 'Caso actualizado' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/cases/:id', () => {
    it('debería eliminar caso', async () => {
      Case.findByIdAndDelete = jest.fn().mockResolvedValue({});

      const response = await request(app).delete('/api/cases/case-123');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/cases/client/:clientId', () => {
    it('debería obtener casos de un cliente', async () => {
      const mockCases = [
        { _id: '1', clientId: 'client-123' },
        { _id: '2', clientId: 'client-123' }
      ];

      Case.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCases)
      });

      const response = await request(app).get('/api/cases/client/client-123');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /health', () => {
    it('debería retornar estado healthy', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});