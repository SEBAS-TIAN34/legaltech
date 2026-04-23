const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const protect = require('../middleware/auth');

router.post('/', protect, invoiceController.createInvoice);
router.get('/', protect, invoiceController.getInvoices);
router.get('/client/:clientId', protect, invoiceController.getInvoicesByClient);
router.get('/:id', protect, invoiceController.getInvoiceById);
router.put('/:id', protect, invoiceController.updateInvoice);
router.put('/:id/pay', protect, invoiceController.markAsPaid);
router.delete('/:id', protect, invoiceController.deleteInvoice);

module.exports = router;