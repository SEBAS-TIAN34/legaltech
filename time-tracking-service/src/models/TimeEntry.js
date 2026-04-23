const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  billable: {
    type: Boolean,
    default: true
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['running', 'paused', 'completed'],
    default: 'running'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

timeEntrySchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000 / 60);
  }
  next();
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);