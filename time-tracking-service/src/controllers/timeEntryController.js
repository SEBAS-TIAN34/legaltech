const TimeEntry = require('../models/TimeEntry');
const axios = require('axios');

const validateToken = async (token) => {
  try {
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

exports.createTimeEntry = async (req, res) => {
  try {
    const { caseId, description, billable, hourlyRate } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await validateToken(token);

    const timeEntry = new TimeEntry({
      caseId,
      userId: user.id,
      description,
      billable: billable !== false,
      hourlyRate: hourlyRate || 0,
      startTime: new Date(),
      status: 'running'
    });

    await timeEntry.save();

    res.status(201).json({
      success: true,
      message: 'Time entry created',
      data: timeEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTimeEntries = async (req, res) => {
  try {
    const { caseId, userId, startDate, endDate } = req.query;
    
    const filter = {};
    if (caseId) filter.caseId = caseId;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const timeEntries = await TimeEntry.find(filter)
      .populate('caseId', 'caseNumber title')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: timeEntries.length,
      data: timeEntries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTimeEntryById = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findById(req.params.id)
      .populate('caseId', 'caseNumber title')
      .populate('userId', 'name email');

    if (!timeEntry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    res.status(200).json({
      success: true,
      data: timeEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTimeEntry = async (req, res) => {
  try {
    const { description, billable, hourlyRate, endTime } = req.body;
    
    const timeEntry = await TimeEntry.findById(req.params.id);

    if (!timeEntry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    if (description) timeEntry.description = description;
    if (typeof billable === 'boolean') timeEntry.billable = billable;
    if (hourlyRate) timeEntry.hourlyRate = hourlyRate;
    if (endTime) {
      timeEntry.endTime = new Date(endTime);
      timeEntry.status = 'completed';
      timeEntry.duration = Math.floor((timeEntry.endTime - timeEntry.startTime) / 1000 / 60);
    }

    await timeEntry.save();

    res.status(200).json({
      success: true,
      message: 'Time entry updated',
      data: timeEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.stopTimeEntry = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findById(req.params.id);

    if (!timeEntry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    if (timeEntry.status !== 'running') {
      return res.status(400).json({ success: false, message: 'Time entry is not running' });
    }

    timeEntry.endTime = new Date();
    timeEntry.status = 'completed';
    timeEntry.duration = Math.floor((timeEntry.endTime - timeEntry.startTime) / 1000 / 60);

    await timeEntry.save();

    res.status(200).json({
      success: true,
      message: 'Time entry stopped',
      data: timeEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTimeEntry = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findById(req.params.id);

    if (!timeEntry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    await TimeEntry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Time entry deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTimeEntriesByCase = async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find({ caseId: req.params.caseId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const totalMinutes = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalBillable = timeEntries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    res.status(200).json({
      success: true,
      count: timeEntries.length,
      totalMinutes,
      totalBillable,
      data: timeEntries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};