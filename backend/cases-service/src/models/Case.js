const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Case = sequelize.define('Case', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  caseNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  caseType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('draft', 'open', 'in_progress', 'closed', 'suspended'),
    defaultValue: 'draft'
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'cases',
  timestamps: true
});

module.exports = Case;