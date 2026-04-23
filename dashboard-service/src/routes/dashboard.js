const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const protect = require('../middleware/auth');

router.get('/stats', protect, dashboardController.getStats);
router.get('/cases', protect, dashboardController.getCasesStats);
router.get('/financial', protect, dashboardController.getFinancialStats);
router.get('/productivity', protect, dashboardController.getProductivityStats);
router.get('/clients', protect, dashboardController.getClientsStats);

module.exports = router;