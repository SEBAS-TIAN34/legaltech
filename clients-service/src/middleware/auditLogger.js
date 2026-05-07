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
  async create(options) { return this.log({ ...options, action: 'CREATE' }); },
  async update(options) { return this.log({ ...options, action: 'UPDATE' }); },
  async delete(options) { return this.log({ ...options, action: 'DELETE' }); }
};

module.exports = auditLogger;