const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'Please provide a file name']
    },
    fileSize: {
      type: Number,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: [true, 'Please provide a file path']
    },
    originalFileName: String,
    caseId: {
      type: String,
      required: [true, 'Please provide a case ID']
    },
    description: String,
    uploadedBy: {
      type: String,
      required: true
    },
    documentType: {
      type: String,
      enum: [
        'demanda',
        'contrato',
        'prueba',
        'sentencia',
        'recurso',
        'certificado',
        'poder',
        'auto',
        'otro'
      ],
      default: 'otro'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    tags: [String],
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

module.exports = mongoose.model('Document', documentSchema);
