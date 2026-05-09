const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TimeEntry = sequelize.define('TimeEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  billable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'time_entries',
  timestamps: true
});

module.exports = TimeEntry;