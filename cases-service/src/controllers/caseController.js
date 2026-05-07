const Case = require('../models/Case');
// const auditLogger = require('../middleware/auditLogger');

exports.createCase = async (req, res) => {
  try {
    const { caseNumber, title, description, clientId, caseType, priority, assignedTo, startDate, budget, notes } = req.body;

    if (!caseNumber || !title || !clientId || !caseType) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields: caseNumber, title, clientId, caseType' });
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
      createdBy: req.user?.userId
    });

    // await auditLogger.create({
    //   entity: 'Case',
    //   entityId: caseData.id,
    //   description: `Nuevo caso creado: ${caseNumber} - ${title}`,
    //   newValues: { caseNumber, title, caseType, priority, clientId },
    //   user: req.user,
    //   req
    // });

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: caseData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.findAll({ order: [['createdAt', 'DESC']] });
    res.json({
      success: true,
      data: cases,
      count: cases.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findByPk(req.params.id);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    res.json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const caseData = await Case.findByPk(req.params.id);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const oldValues = { 
      caseNumber: caseData.caseNumber, 
      title: caseData.title, 
      status: caseData.status,
      priority: caseData.priority 
    };

    const { caseNumber, title, description, clientId, caseType, priority, status, assignedTo, startDate, endDate, budget, notes } = req.body;

    await caseData.update({
      caseNumber: caseNumber || caseData.caseNumber,
      title: title || caseData.title,
      description: description || caseData.description,
      clientId: clientId || caseData.clientId,
      caseType: caseType || caseData.caseType,
      priority: priority || caseData.priority,
      status: status || caseData.status,
      assignedTo: assignedTo !== undefined ? assignedTo : caseData.assignedTo,
      startDate: startDate || caseData.startDate,
      endDate: endDate !== undefined ? endDate : caseData.endDate,
      budget: budget !== undefined ? budget : caseData.budget,
      notes: notes !== undefined ? notes : caseData.notes
    });

    // await auditLogger.update({
    //   entity: 'Case',
    //   entityId: caseData.id,
    //   description: `Caso actualizado: ${caseData.caseNumber}`,
    //   oldValues,
    //   newValues: { caseNumber, title, status, priority },
    //   user: req.user,
    //   req
    // });

    res.json({ success: true, message: 'Case updated successfully', data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findByPk(req.params.id);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    await caseData.destroy();
    res.json({ success: true, message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCaseStats = async (req, res) => {
  try {
    const cases = await Case.findAll();
    const stats = {
      total: cases.length,
      byStatus: {
        draft: cases.filter(c => c.status === 'draft').length,
        open: cases.filter(c => c.status === 'open').length,
        in_progress: cases.filter(c => c.status === 'in_progress').length,
        closed: cases.filter(c => c.status === 'closed').length,
        suspended: cases.filter(c => c.status === 'suspended').length
      },
      byPriority: {
        low: cases.filter(c => c.priority === 'low').length,
        medium: cases.filter(c => c.priority === 'medium').length,
        high: cases.filter(c => c.priority === 'high').length
      }
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};