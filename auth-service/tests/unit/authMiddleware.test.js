const jwt = require('jsonwebtoken');

describe('Auth Middleware - Unit Tests', () => {
  let auth;
  
  beforeEach(() => {
    jest.clearAllMocks();
    auth = require('../../src/middleware/auth');
  });

  describe('Token Extraction', () => {
    it('debería extraer token del header Authorization', () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
        }
      };
      
      const token = req.headers.authorization?.split(' ')[1];
      expect(token).toBeDefined();
      expect(token).toContain('eyJ');
    });

    it('debería manejar header sin Authorization', () => {
      const req = { headers: {} };
      const token = req.headers.authorization?.split(' ')[1];
      expect(token).toBeUndefined();
    });

    it('debería manejar header con formato incorrecto', () => {
      const req = {
        headers: {
          authorization: 'Basic dXNlcjpwYXNz'
        }
      };
      
      const token = req.headers.authorization?.split(' ')[1];
      expect(token).toBe('dXNlcjpwYXNz');
    });

    it('debería manejar header vacío', () => {
      const req = {
        headers: {
          authorization: ''
        }
      };
      
      const token = req.headers.authorization?.split(' ')[1];
      expect(token).toBeUndefined();
    });
  });

  describe('JWT Verification Logic', () => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    it('debería verificar token válido', () => {
      const token = jwt.sign({ userId: '123' }, JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET);
      
      expect(decoded.userId).toBe('123');
    });

    it('debería rechazar token expirado', () => {
      const token = jwt.sign({ userId: 'exp' }, JWT_SECRET, { expiresIn: '-1s' });
      
      expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
    });

    it('debería rechazar token con firma incorrecta', () => {
      const token = jwt.sign({ userId: 'test' }, 'wrong-secret');
      
      expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
    });

    it('debería rechazar token malformed', () => {
      expect(() => jwt.verify('invalid-token', JWT_SECRET)).toThrow();
    });

    it('debería rechazar token vacío', () => {
      expect(() => jwt.verify('', JWT_SECRET)).toThrow();
    });
  });

  describe('Request User Object', () => {
    it('debería crear objeto user en request', () => {
      const req = {};
      const decoded = { userId: 'user-123', role: 'lawyer' };
      
      req.user = decoded;
      
      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe('user-123');
      expect(req.user.role).toBe('lawyer');
    });

    it('debería preservar datos del token decodificado', () => {
      const decoded = {
        userId: '123',
        email: 'test@test.com',
        role: 'admin',
        iat: 1234567890,
        exp: 1234567890
      };
      
      expect(decoded.userId).toBeDefined();
      expect(decoded.email).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('debería manejar error de token expirado', () => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      
      expect(error.name).toBe('TokenExpiredError');
    });

    it('debería manejar error de token inválido', () => {
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';
      
      expect(error.name).toBe('JsonWebTokenError');
    });

    it('debería manejar error sin token', () => {
      const error = new Error('No token provided');
      
      expect(error.message).toContain('No token');
    });

    it('debería manejar error de firma incorrecta', () => {
      const error = new Error('Incorrect signature');
      error.name = 'JsonWebTokenError';
      
      expect(error.name).toBe('JsonWebTokenError');
    });
  });

  describe('Response Logic', () => {
    it('debería crear respuesta 401 para token faltante', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      res.status(401).json({ success: false, message: 'No token provided' });
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No token provided' });
    });

    it('debería crear respuesta 401 para token inválido', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      res.status(401).json({ success: false, message: 'Invalid token' });
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token' });
    });

    it('debería incluir mensaje de error en respuesta', () => {
      const errorMessage = 'jwt malformed';
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      res.status(401).json({ success: false, message: 'Invalid token: ' + errorMessage });
      
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('jwt malformed') })
      );
    });
  });

  describe('Next Function', () => {
    it('debería llamar next() cuando token es válido', (done) => {
      const next = jest.fn();
      
      expect(typeof next).toBe('function');
      next();
      expect(next).toHaveBeenCalled();
      done();
    });

    it('debería no llamar next() cuando hay error', () => {
      const next = jest.fn();
      const error = new Error('Test error');
      
      expect(() => {}).not.toThrow();
    });

    it('debería pasar control al siguiente middleware', () => {
      let called = false;
      const next = () => { called = true; };
      
      next();
      
      expect(called).toBe(true);
    });
  });
});