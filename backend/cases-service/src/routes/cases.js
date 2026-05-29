const express = require('express');
const router = express.Router();
const {
  createCase,
  getAllCases,
  getCaseById,
  updateCase,
  takeCase,
  deleteCase,
  getCaseStats
} = require('../controllers/caseController');
const protect = require('../middleware/auth');

router.post('/', protect, createCase);
router.get('/', protect, getAllCases);
router.get('/stats', protect, getCaseStats);
router.put('/:id/take', protect, takeCase);
router.get('/:id', protect, getCaseById);
router.put('/:id', protect, updateCase);
router.delete('/:id', protect, deleteCase);

module.exports = router;
