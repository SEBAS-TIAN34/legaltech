const AuditLog = require('../models/AuditLog');

const auditLogger = {
  /**
   * Registrar una acción en el log de auditoría
   * @param {Object} options
   * @param {string} options.action - CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
   * @param {string} options.entity - Case, Client, Document, User, etc.
   * @param {string} options.entityId - ID de la entidad afectada
   * @param {string} options.description - Descripción de la acción
   * @param {Object} options.oldValues - Valores anteriores (para UPDATE)
   * @param {Object} options.newValues - Valores nuevos (para CREATE/UPDATE)
   * @param {Object} options.user - Usuario que realiza la acción (del token)
   * @param {Object} options.req - Request de Express para obtener IP y User-Agent
   */
  async log({ action, entity, entityId, description, oldValues, newValues, user, req }) {
    try {
      const ipAddress = req ? (req.ip || req.connection?.remoteAddress || 'unknown') : 'unknown';
      const userAgent = req ? (req.get('User-Agent') || 'unknown') : 'unknown';

      await AuditLog.create({
        userId: user?.userId || user?.id || null,
        action,
        entity,
        entityId,
        description,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress,
        userAgent
      });

      console.log(`[AUDIT] ${action} on ${entity}: ${description}`);
    } catch (error) {
      console.error('[AUDIT ERROR]', error.message);
    }
  },

  // Métodos convenientes para tipos comunes de acciones
  async create({ entity, entityId, description, newValues, user, req }) {
    return this.log({ action: 'CREATE', entity, entityId, description, newValues, user, req });
  },

  async update({ entity, entityId, description, oldValues, newValues, user, req }) {
    return this.log({ action: 'UPDATE', entity, entityId, description, oldValues, newValues, user, req });
  },

  async delete({ entity, entityId, description, oldValues, user, req }) {
    return this.log({ action: 'DELETE', entity, entityId, description, oldValues, user, req });
  },

  async login({ user, description, req }) {
    return this.log({ action: 'LOGIN', entity: 'User', entityId: user?.id, description, newValues: { email: user?.email }, user, req });
  },

  async logout({ user, description, req }) {
    return this.log({ action: 'LOGOUT', entity: 'User', entityId: user?.id, description, user, req });
  }
};

module.exports = auditLogger;