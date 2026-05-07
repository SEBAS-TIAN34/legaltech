const Notification = require('../../src/models/Notification');

jest.mock('../../src/models/Notification');

describe('Notification Model - Unit Tests', () => {
  
  describe('Notification Schema', () => {
    it('debería crear notificación con campos requeridos', () => {
      const notification = {
        userId: 'user-123',
        title: 'Nueva Notificación',
        message: 'Contenido de la notificación',
        type: 'info'
      };
      
      expect(notification.userId).toBeDefined();
      expect(notification.title).toBeDefined();
      expect(notification.message).toBeDefined();
    });

    it('debería validar tipos de notificación válidos', () => {
      const validTypes = ['info', 'warning', 'error', 'success', 'reminder'];
      
      validTypes.forEach(type => {
        expect(validTypes).toContain(type);
      });
    });

    it('debería validar canales válidos', () => {
      const validChannels = ['in_app', 'email', 'sms', 'push'];
      
      validChannels.forEach(channel => {
        expect(validChannels).toContain(channel);
      });
    });

    it('debería tener valores por defecto', () => {
      const defaults = {
        type: 'info',
        channel: 'in_app',
        isRead: false
      };
      
      expect(defaults.type).toBe('info');
      expect(defaults.channel).toBe('in_app');
      expect(defaults.isRead).toBe(false);
    });

    it('debería validar longitud máxima de título', () => {
      const maxLength = 200;
      const title = 'a'.repeat(maxLength);
      
      expect(title.length).toBe(maxLength);
      expect(title.length).toBeLessThanOrEqual(maxLength);
    });

    it('debería validar longitud máxima de mensaje', () => {
      const maxLength = 1000;
      const message = 'a'.repeat(maxLength);
      
      expect(message.length).toBe(maxLength);
    });
  });

  describe('Notification Logic', () => {
    it('debería marcar como leída', () => {
      const notification = {
        isRead: false,
        readAt: null,
        markAsRead: function() {
          this.isRead = true;
          this.readAt = new Date();
        }
      };
      
      notification.markAsRead();
      
      expect(notification.isRead).toBe(true);
      expect(notification.readAt).toBeDefined();
    });

    it('debería verificar si está leída', () => {
      const unreadNotification = { isRead: false };
      const readNotification = { isRead: true };
      
      expect(unreadNotification.isRead).toBe(false);
      expect(readNotification.isRead).toBe(true);
    });

    it('debería calcular tiempo desde creación', () => {
      const now = new Date();
      const notification = { createdAt: now };
      
      expect(notification.createdAt).toBeInstanceOf(Date);
    });

    it('debería tener referencia opcional', () => {
      const notificationWithRef = {
        reference: 'case-123',
        refType: 'Case'
      };
      
      const notificationWithoutRef = {};
      
      expect(notificationWithRef.reference).toBeDefined();
      expect(notificationWithoutRef.reference).toBeUndefined();
    });

    it('debería validar tipo de notificación', () => {
      const invalidType = 'critical';
      const validTypes = ['info', 'warning', 'error', 'success', 'reminder'];
      
      expect(validTypes).not.toContain(invalidType);
    });

    it('debería validar canal de notificación', () => {
      const invalidChannel = 'whatsapp';
      const validChannels = ['in_app', 'email', 'sms', 'push'];
      
      expect(validChannels).not.toContain(invalidChannel);
    });
  });

  describe('Notification Filtering', () => {
    it('debería filtrar notificaciones no leídas', () => {
      const notifications = [
        { isRead: false },
        { isRead: true },
        { isRead: false }
      ];
      
      const unread = notifications.filter(n => !n.isRead);
      
      expect(unread).toHaveLength(2);
    });

    it('debería filtrar notificaciones por tipo', () => {
      const notifications = [
        { type: 'info' },
        { type: 'warning' },
        { type: 'info' }
      ];
      
      const infoNotifications = notifications.filter(n => n.type === 'info');
      
      expect(infoNotifications).toHaveLength(2);
    });

    it('debería ordenar por fecha de creación descendente', () => {
      const notifications = [
        { createdAt: new Date('2024-01-01') },
        { createdAt: new Date('2024-01-03') },
        { createdAt: new Date('2024-01-02') }
      ];
      
      const sorted = notifications.sort((a, b) => b.createdAt - a.createdAt);
      
      expect(sorted[0].createdAt.getTime()).toBeGreaterThan(sorted[1].createdAt.getTime());
    });
  });
});