const express = require('express');
const router = express.Router();
const timeEntryController = require('../controllers/timeEntryController');
const protect = require('../middleware/auth');

router.post('/', protect, timeEntryController.createTimeEntry);
router.get('/', protect, timeEntryController.getTimeEntries);
router.get('/case/:caseId', protect, timeEntryController.getTimeEntriesByCase);
router.get('/:id', protect, timeEntryController.getTimeEntryById);
router.put('/:id', protect, timeEntryController.updateTimeEntry);
router.put('/:id/stop', protect, timeEntryController.stopTimeEntry);
router.delete('/:id', protect, timeEntryController.deleteTimeEntry);

module.exports = router;