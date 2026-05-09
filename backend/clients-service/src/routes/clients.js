const express = require('express');
const router = express.Router();
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientCases
} = require('../controllers/clientController');
const protect = require('../middleware/auth');

router.post('/', protect, createClient);
router.get('/', protect, getAllClients);
router.get('/:id', protect, getClientById);
router.get('/:id/cases', protect, getClientCases);
router.put('/:id', protect, updateClient);
router.delete('/:id', protect, deleteClient);

module.exports = router;