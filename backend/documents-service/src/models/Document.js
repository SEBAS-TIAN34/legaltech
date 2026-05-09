const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  documentType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'documents',
  timestamps: true
});

module.exports = Document;