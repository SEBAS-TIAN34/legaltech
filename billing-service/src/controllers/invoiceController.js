const Invoice = require('../models/Invoice');
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

const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
};

exports.createInvoice = async (req, res) => {
  try {
    const { clientId, caseId, items, tax, dueDate, notes } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    await validateToken(token);

    const invoiceNumber = await generateInvoiceNumber();

    const itemsWithTotal = items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));

    const subtotal = itemsWithTotal.reduce((sum, item) => sum + item.total, 0);

    const invoice = new Invoice({
      invoiceNumber,
      clientId,
      caseId,
      items: itemsWithTotal,
      subtotal,
      tax: tax || 0,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { clientId, status, startDate, endDate } = req.query;
    
    const filter = {};
    if (clientId) filter.clientId = clientId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(filter)
      .populate('clientId', 'firstName lastName email')
      .populate('caseId', 'caseNumber title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId', 'firstName lastName email phone address')
      .populate('caseId', 'caseNumber title');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { items, tax, dueDate, notes, status } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (items) {
      invoice.items = items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice
      }));
    }
    if (typeof tax === 'number') invoice.tax = tax;
    if (dueDate) invoice.dueDate = new Date(dueDate);
    if (notes) invoice.notes = notes;
    if (status) invoice.status = status;

    await invoice.save();

    res.status(200).json({
      success: true,
      message: 'Invoice updated',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice.status = 'paid';
    invoice.paidDate = new Date();

    await invoice.save();

    res.status(200).json({
      success: true,
      message: 'Invoice marked as paid',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Cannot delete paid invoice' });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Invoice deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await Invoice.find({ clientId: req.params.clientId })
      .populate('caseId', 'caseNumber title')
      .sort({ createdAt: -1 });

    const totalPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalPending = invoices
      .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + inv.total, 0);

    res.status(200).json({
      success: true,
      count: invoices.length,
      totalPaid,
      totalPending,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};