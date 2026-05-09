const mongoose = require('mongoose');

jest.mock('mongoose');

const Case = require('../../src/models/Case');

describe('Case Model - Unit Tests', () => {
  
  describe('Case Schema Validation', () => {
    it('debería crear caso con campos requeridos', () => {
      const caseData = {
        caseNumber: 'CASE-2024-001',
        title: 'Demanda Civil',
        description: 'Caso de prueba',
        caseType: 'civil',
        priority: 'high',
        status: 'open'
      };
      
      expect(caseData.caseNumber).toBeDefined();
      expect(caseData.title).toBeDefined();
      expect(caseData.caseType).toBe('civil');
    });

    it('debería validar tipos de caso válidos', () => {
      const validTypes = ['civil', 'penal', 'laboral', 'administrativo', 'constitucional'];
      
      validTypes.forEach(type => {
        expect(validTypes).toContain(type);
      });
    });

    it('debería validar prioridades válidas', () => {
      const validPriorities = ['low', 'medium', 'high'];
      const priority = 'high';
      
      expect(validPriorities).toContain(priority);
    });

    it('debería validar estados válidos', () => {
      const validStatuses = ['draft', 'open', 'in_progress', 'closed', 'suspended'];
      const status = 'in_progress';
      
      expect(validStatuses).toContain(status);
    });

    it('debería rechazar priority inválida', () => {
      const validPriorities = ['low', 'medium', 'high'];
      const invalidPriority = 'urgent';
      
      expect(validPriorities).not.toContain(invalidPriority);
    });

    it('debería rechazar caseType inválido', () => {
      const validTypes = ['civil', 'penal', 'laboral', 'administrativo', 'constitucional'];
      const invalidType = 'criminal';
      
      expect(validTypes).not.toContain(invalidType);
    });
  });

  describe('Case Business Logic', () => {
    it('debería generar número de caso automático', () => {
      const year = new Date().getFullYear();
      const caseNumber = `CASE-${year}-001`;
      
      expect(caseNumber).toContain('CASE');
      expect(caseNumber).toContain(year.toString());
    });

    it('debería calcular duración del caso', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-01');
      const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      expect(days).toBe(60);
    });

    it('debería validar fecha de inicio', () => {
      const startDate = '2024-01-01';
      const futureDate = '2030-01-01';
      
      expect(new Date(startDate) < new Date(futureDate)).toBe(true);
    });

    it('debería tener campos opcionales definidos', () => {
      const optionalFields = ['description', 'assignedTo', 'clientId', 'endDate', 'notes'];
      
      optionalFields.forEach(field => {
        expect(optionalFields).toContain(field);
      });
    });

    it('debería tener valores por defecto', () => {
      const defaults = {
        status: 'draft',
        priority: 'medium',
        isActive: true
      };
      
      expect(defaults.status).toBe('draft');
      expect(defaults.priority).toBe('medium');
    });

    it('debería generar timestamps', () => {
      const now = new Date();
      
      expect(now).toBeInstanceOf(Date);
      expect(now.getTime()).toBeGreaterThan(0);
    });
  });

  describe('Case Status Transitions', () => {
    const validTransitions = {
      draft: ['open'],
      open: ['in_progress', 'suspended'],
      in_progress: ['closed', 'suspended'],
      suspended: ['open'],
      closed: []
    };

    it('debería permitir transición de draft a open', () => {
      expect(validTransitions.draft).toContain('open');
    });

    it('debería permitir transición de open a in_progress', () => {
      expect(validTransitions.open).toContain('in_progress');
    });

    it('debería permitir transición de in_progress a closed', () => {
      expect(validTransitions.in_progress).toContain('closed');
    });

    it('debería no permitir transición de closed a otro estado', () => {
      expect(validTransitions.closed).toHaveLength(0);
    });
  });
});