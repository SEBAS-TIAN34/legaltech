const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: [true, 'Please provide a case number'],
      unique: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a case title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a case description']
    },
    clientId: {
      type: String,
      required: [true, 'Please provide a client ID']
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'in_progress', 'closed', 'suspended'],
      default: 'draft'
    },
    caseType: {
      type: String,
      enum: ['civil', 'criminal', 'commercial', 'family', 'administrative', 'other'],
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    assignedTo: {
      type: String,
      required: [true, 'Please assign this case to a lawyer']
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    budget: {
      type: Number,
      min: 0
    },
    notes: String,
    documents: [String],
    tags: [String],
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Case', caseSchema);
