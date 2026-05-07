const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: true },
  action: { type: DataTypes.STRING(50), allowNull: false },
  entity: { type: DataTypes.STRING(50), allowNull: false },
  entityId: { type: DataTypes.UUID, allowNull: true },
  description: { type: DataTypes.TEXT },
  oldValues: { type: DataTypes.JSONB },
  newValues: { type: DataTypes.JSONB },
  ipAddress: { type: DataTypes.STRING(45) }
}, { tableName: 'audit_logs', timestamps: true, underscored: true });
module.exports = AuditLog;