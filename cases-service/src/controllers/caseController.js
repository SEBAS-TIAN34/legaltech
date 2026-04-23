const Case = require('../models/Case');
const axios = require('axios');

// @route   POST /cases
// @desc    Create a new case
// @access  Private
exports.createCase = async (req, res) => {
  try {
    const { caseNumber, title, description, clientId, caseType, priority, assignedTo, startDate, budget, notes } = req.body;

    if (!caseNumber || !title || !description || !clientId || !caseType || !assignedTo || !startDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const caseData = await Case.create({
      caseNumber,
      title,
      description,
      clientId,
      caseType,
      priority: priority || 'medium',
      assignedTo,
      startDate,
      budget,
      notes,
      status: 'draft',
      createdBy: req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: caseData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /cases
// @desc    Get all cases
// @access  Private
exports.getAllCases = async (req, res) => {
  try {
    const { status, clientId, assignedTo } = req.query;
    let query = {};

    if (status) query.status = status;
    if (clientId) query.clientId = clientId;
    if (assignedTo) query.assignedTo = assignedTo;

    const cases = await Case.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /cases/:id
// @desc    Get case by ID
// @access  Private
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    res.status(200).json({
      success: true,
      data: caseData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /cases/:id
// @desc    Update case
// @access  Private
exports.updateCase = async (req, res) => {
  try {
    const { title, description, status, priority, endDate, budget, notes } = req.body;

    let caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (title) caseData.title = title;
    if (description) caseData.description = description;
    if (status) caseData.status = status;
    if (priority) caseData.priority = priority;
    if (endDate) caseData.endDate = endDate;
    if (budget) caseData.budget = budget;
    if (notes) caseData.notes = notes;

    caseData.updatedAt = Date.now();
    await caseData.save();

    res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      data: caseData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /cases/:id
// @desc    Delete case
// @access  Private/Admin
exports.deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findByIdAndDelete(req.params.id);

    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCaseStats = async (req, res) => {
  try {
    const total = await Case.countDocuments();
    const byStatus = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byType = await Case.aggregate([
      { $group: { _id: '$caseType', count: { $sum: 1 } } }
    ]);
    const byPriority = await Case.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byType: byType.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
