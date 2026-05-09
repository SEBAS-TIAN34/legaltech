const TimeEntry = require('../models/TimeEntry');
// const auditLogger = require('../middleware/auditLogger');

exports.createTimeEntry = async (req, res) => {
  try {
    const { description, duration, caseId, billable, date, notes } = req.body;

    if (!description || !duration || !date) {
      return res.status(400).json({ success: false, message: 'Please provide description, duration, and date' });
    }

    const entry = await TimeEntry.create({
      description,
      duration: parseInt(duration),
      caseId,
      userId: req.user?.userId || null,
      billable: billable !== false,
      date,
      notes
    });

    // await auditLogger.create({
    //   entity: 'TimeEntry',
    //   entityId: entry.id,
    //   description: `Tiempo registrado: ${description} (${duration} min) - Caso: ${caseId || 'N/A'}`,
    //   newValues: { description, duration, caseId, billable },
    //   user: req.user,
    //   req
    // });

    res.status(201).json({ success: true, message: 'Time entry created', data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTimeEntries = async (req, res) => {
  try {
    const { caseId, userId, startDate, endDate } = req.query;
    const where = {};
    if (caseId) where.caseId = caseId;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.$gte = new Date(startDate);
      if (endDate) where.date.$lte = new Date(endDate);
    }

    const entries = await TimeEntry.findAll({ where, order: [['date', 'DESC']] });
    res.json({ success: true, data: entries, count: entries.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTimeEntryById = async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTimeEntry = async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    const { description, duration, caseId, billable, date, notes } = req.body;
    await entry.update({
      description: description || entry.description,
      duration: duration ? parseInt(duration) : entry.duration,
      caseId: caseId !== undefined ? caseId : entry.caseId,
      billable: billable !== undefined ? billable : entry.billable,
      date: date || entry.date,
      notes: notes !== undefined ? notes : entry.notes
    });

    res.json({ success: true, message: 'Time entry updated', data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTimeEntry = async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    await entry.destroy();
    res.json({ success: true, message: 'Time entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTimeStats = async (req, res) => {
  try {
    const entries = await TimeEntry.findAll();
    const totalMinutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
    const billableMinutes = entries.filter(e => e.billable).reduce((sum, e) => sum + (e.duration || 0), 0);

    res.json({
      success: true,
      data: {
        totalEntries: entries.length,
        totalMinutes,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        billableMinutes,
        billableHours: Math.round(billableMinutes / 60 * 10) / 10
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTimeEntries = async (req, res) => {
  try {
    const { caseId, userId } = req.query;
    const where = {};
    if (caseId) where.caseId = caseId;
    if (userId) where.userId = userId;
    const entries = await TimeEntry.findAll({ where, order: [['date', 'DESC']] });
    res.json({ success: true, data: entries, count: entries.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTimeEntriesByCase = async (req, res) => {
  try {
    const entries = await TimeEntry.findAll({ where: { caseId: req.params.caseId }, order: [['date', 'DESC']] });
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.stopTimeEntry = async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }
    res.json({ success: true, message: 'Time entry stopped', data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};