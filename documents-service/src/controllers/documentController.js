const Document = require('../models/Document');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, caseId, clientId, documentType, fileName, filePath, fileSize, mimeType } = req.body;

    if (!title || !fileName) {
      return res.status(400).json({ success: false, message: 'Please provide title and fileName' });
    }

    const doc = await Document.create({
      title,
      description,
      caseId,
      clientId,
      documentType: documentType || 'other',
      fileName,
      filePath,
      fileSize: parseInt(fileSize) || 0,
      mimeType,
      uploadedBy: req.user?.userId || null,
      isPublic: false
    });

    res.status(201).json({ success: true, message: 'Document created successfully', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const { caseId, clientId, documentType } = req.query;
    const where = {};
    if (caseId) where.caseId = caseId;
    if (clientId) where.clientId = clientId;
    if (documentType) where.documentType = documentType;

    const docs = await Document.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: docs, count: docs.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (doc.filePath) {
      try { fs.unlinkSync(doc.filePath); } catch (e) { }
    }

    await doc.destroy();
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Download endpoint', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocumentsByCase = async (req, res) => {
  try {
    const docs = await Document.findAll({ where: { caseId: req.params.caseId }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};