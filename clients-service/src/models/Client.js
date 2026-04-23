const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true
    },
    documentType: {
      type: String,
      enum: ['CC', 'NIT', 'Pasaporte', 'CE'],
      required: true
    },
    documentNumber: {
      type: String,
      required: [true, 'Please provide a document number'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Colombia'
      }
    },
    clientType: {
      type: String,
      enum: ['individual', 'company'],
      default: 'individual'
    },
    companyName: String,
    taxId: String,
    occupation: String,
    isActive: {
      type: Boolean,
      default: true
    },
    notes: String,
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

module.exports = mongoose.model('Client', clientSchema);
