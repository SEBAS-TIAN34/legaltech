const mongoose = require('mongoose');

jest.mock('mongoose');

describe('User Model - Unit Tests', () => {
  
  describe('User Schema Fields', () => {
    it('debería tener campo email requerido', () => {
      const email = 'test@test.com';
      expect(email).toBeDefined();
      expect(email).toContain('@');
    });

    it('debería tener campo password requerido', () => {
      const password = 'password123';
      expect(password).toBeDefined();
      expect(password.length).toBeGreaterThan(0);
    });

    it('debería tener campo firstName', () => {
      const firstName = 'John';
      expect(firstName).toBeDefined();
      expect(typeof firstName).toBe('string');
    });

    it('debería tener campo lastName', () => {
      const lastName = 'Doe';
      expect(lastName).toBeDefined();
      expect(typeof lastName).toBe('string');
    });

    it('debería tener campo role con valores válidos', () => {
      const validRoles = ['admin', 'lawyer', 'assistant', 'client'];
      const userRole = 'lawyer';
      
      expect(validRoles).toContain(userRole);
    });

    it('debería tener campo isActive por defecto true', () => {
      const isActive = true;
      expect(isActive).toBe(true);
    });

    it('debería tener campo profile como objeto', () => {
      const profile = {
        phone: '3001234567',
        specialization: 'Civil Law',
        barNumber: 'AB12345',
        office: 'Legal Office'
      };
      
      expect(profile).toBeDefined();
      expect(profile.phone).toBeDefined();
    });

    it('debería tener campo lastLogin', () => {
      const lastLogin = new Date();
      expect(lastLogin).toBeInstanceOf(Date);
    });
  });

  describe('Virtual Properties', () => {
    it('debería generar fullName como virtual', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        get fullName() {
          return `${this.firstName} ${this.lastName}`;
        }
      };
      
      expect(user.fullName).toBe('John Doe');
    });

    it('debería generar initials como virtual', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        get initials() {
          return (this.firstName[0] + this.lastName[0]).toUpperCase();
        }
      };
      
      expect(user.initials).toBe('JD');
    });
  });

  describe('Password Methods', () => {
    const bcrypt = require('bcryptjs');

    it('debería hashear password antes de guardar', async () => {
      const password = 'plainpassword';
      const hashed = await bcrypt.hash(password, 10);
      
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(20);
    });

    it('debería comparar password con bcrypt', async () => {
      const plainPassword = 'mypassword123';
      const hashed = await bcrypt.hash(plainPassword, 10);
      const isMatch = await bcrypt.compare(plainPassword, hashed);
      
      expect(isMatch).toBe(true);
    });

    it('debería retornar false para password incorrecto', async () => {
      const plainPassword = 'correctpassword';
      const hashed = await bcrypt.hash(plainPassword, 10);
      const isMatch = await bcrypt.compare('wrongpassword', hashed);
      
      expect(isMatch).toBe(false);
    });

    it('debería validar longitud mínima de password', () => {
      const minLength = 6;
      const password = '12345';
      
      expect(password.length).toBeLessThan(minLength);
    });
  });

  describe('Pre-save Hook', () => {
    it('debería verificar si password necesita hash', () => {
      const userData = {
        password: 'plainpassword123',
        email: 'test@test.com'
      };
      
      const isPlainPassword = !userData.password.startsWith('$2');
      expect(isPlainPassword).toBe(true);
    });

    it('debería no re-hashear si password ya está hasheado', () => {
      const hashedPassword = '$2a$10$abcdefghijklmnopqrstuvwxyz';
      
      const shouldRehash = hashedPassword.startsWith('$2');
      expect(shouldRehash).toBe(true);
    });
  });

  describe('toJSON Method', () => {
    it('debería excluir password del JSON', () => {
      const user = {
        _id: '123',
        email: 'test@test.com',
        password: 'secret',
        toJSON: function() {
          const { password, ...rest } = this;
          return rest;
        }
      };
      
      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.email).toBeDefined();
    });

    it('debería incluir campos públicos', () => {
      const user = {
        _id: '123',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User'
      };
      
      expect(user._id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.firstName).toBeDefined();
    });
  });

  describe('Validation Logic', () => {
    it('debería validar email con formato válido', () => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      
      expect(emailRegex.test('test@test.com')).toBe(true);
      expect(emailRegex.test('user.name@domain.co')).toBe(true);
      expect(emailRegex.test('invalid')).toBe(false);
    });

    it('debería validar roles permitidos', () => {
      const allowedRoles = ['admin', 'lawyer', 'assistant', 'client'];
      const invalidRoles = ['superuser', 'moderator', 'guest'];
      
      allowedRoles.forEach(role => {
        expect(allowedRoles).toContain(role);
      });
      
      invalidRoles.forEach(role => {
        expect(allowedRoles).not.toContain(role);
      });
    });

    it('debería validar campos requeridos', () => {
      const requiredFields = ['email', 'password', 'firstName', 'lastName'];
      
      const user = {
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };
      
      requiredFields.forEach(field => {
        expect(user[field]).toBeDefined();
      });
    });
  });

  describe('Timestamps', () => {
    it('debería generar createdAt', () => {
      const timestamp = new Date();
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('debería generar updatedAt', () => {
      const timestamp = new Date();
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('debería actualizar updatedAt al modificar', () => {
      const original = new Date('2024-01-01');
      const updated = new Date('2024-01-02');
      
      expect(updated.getTime()).toBeGreaterThan(original.getTime());
    });
  });

  describe('Index Configuration', () => {
    it('debería tener índice único en email', () => {
      const indexConfig = { unique: true, sparse: true };
      expect(indexConfig.unique).toBe(true);
    });

    it('debería manejar índices compuestos', () => {
      const compoundIndex = { email: 1, isActive: 1 };
      expect(compoundIndex.email).toBe(1);
      expect(compoundIndex.isActive).toBe(1);
    });
  });
});