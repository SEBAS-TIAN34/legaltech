const AuditLog = require('../models/AuditLog');
const auditLogger = {
  async log({ action, entity, entityId, description, oldValues, newValues, user, req }) {
    try {
      await AuditLog.create({
        userId: user?.userId || user?.id || null,
        action, entity, entityId, description,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: req?.ip || 'unknown'
      });
    } catch (e) { console.error('[AUDIT]', e.message); }
  },
  async create(o) { return this.log({ ...o, action: 'CREATE' }); },
  async update(o) { return this.log({ ...o, action: 'UPDATE' }); },
  async delete(o) { return this.log({ ...o, action: 'DELETE' }); }
};
module.exports = auditLogger;