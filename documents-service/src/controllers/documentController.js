const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// @route   POST /documents
// @desc    Upload a new document
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const { caseId, description, documentType } = req.body;

    if (!caseId) {
      // Delete uploaded file if caseId is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Please provide a case ID' });
    }

    const documentData = await Document.create({
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      filePath: req.file.path,
      caseId,
      description,
      documentType: documentType || 'otro',
      uploadedBy: req.user?.id || 'system'
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: documentData
    });
  } catch (error) {
    // Delete uploaded file in case of error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /documents
// @desc    Get all documents
// @access  Private
exports.getAllDocuments = async (req, res) => {
  try {
    const { caseId, documentType } = req.query;
    let query = {};

    if (caseId) query.caseId = caseId;
    if (documentType) query.documentType = documentType;

    const documents = await Document.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /documents/:id
// @desc    Get document by ID
// @access  Private
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /documents/:id/download
// @desc    Download document
// @access  Private
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const filePath = path.resolve(document.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(filePath, document.originalFileName);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /documents/:id
// @desc    Delete document
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Delete file from server
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocumentsByCase = async (req, res) => {
  try {
    const documents = await Document.find({ caseId: req.params.caseId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
