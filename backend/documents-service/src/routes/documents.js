const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');
const {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
  getDocumentsByCase
} = require('../controllers/documentController');
const protect = require('../middleware/auth');

router.post('/', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getAllDocuments);
router.get('/case/:caseId', protect, getDocumentsByCase);
router.get('/:id', protect, getDocumentById);
router.get('/:id/download', protect, downloadDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;