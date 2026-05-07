const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Usuario que realizó la acción'
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Tipo de acción: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.'
  },
  entity: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Nombre de la entidad: Case, Client, Document, User, etc.'
  },
  entityId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID de la entidad afectada'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción detallada de la acción'
  },
  oldValues: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Valores anteriores (para UPDATE)'
  },
  newValues: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Valores nuevos (para CREATE y UPDATE)'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'Dirección IP del cliente'
  },
  userAgent: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Navegador/dispositivo del cliente'
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['action'] },
    { fields: ['entity'] },
    { fields: ['entityId'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = AuditLog;