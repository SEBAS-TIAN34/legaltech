const AuditLog = require('../models/AuditLog');

const auditLogger = {
  async log({ action, entity, entityId, description, oldValues, newValues, user, req }) {
    try {
      const ipAddress = req?.ip || req?.connection?.remoteAddress || 'unknown';
      
      await AuditLog.create({
        userId: user?.userId || user?.id || null,
        action,
        entity,
        entityId,
        description,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress
      });
    } catch (error) {
      console.error('[AUDIT ERROR]', error.message);
    }
  },

  async create({ entity, entityId, description, newValues, user, req }) {
    return this.log({ action: 'CREATE', entity, entityId, description, newValues, user, req });
  },

  async update({ entity, entityId, description, oldValues, newValues, user, req }) {
    return this.log({ action: 'UPDATE', entity, entityId, description, oldValues, newValues, user, req });
  },

  async delete({ entity, entityId, description, oldValues, user, req }) {
    return this.log({ action: 'DELETE', entity, entityId, description, oldValues, user, req });
  }
};

module.exports = auditLogger;