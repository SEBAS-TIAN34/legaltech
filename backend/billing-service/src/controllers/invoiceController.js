const Invoice = require('../models/Invoice');
// const auditLogger = require('../middleware/auditLogger');

const generateInvoiceNumber = async () => {
  const count = await Invoice.count();
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
};

exports.createInvoice = async (req, res) => {
  try {
    const {
      clientId,
      caseId,
      items,
      taxRate,
      dueDate,
      notes,
      description,
      total,
      subtotal,
      tax,
      status,
      paidAmount
    } = req.body;
    let invoiceItems = items;

    if (typeof invoiceItems === 'string') {
      try {
        invoiceItems = JSON.parse(invoiceItems);
      } catch (error) {
        invoiceItems = null;
      }
    }

    if (!Array.isArray(invoiceItems) && total !== undefined) {
      invoiceItems = [{
        description: description || notes || 'Servicios legales',
        quantity: 1,
        unitPrice: parseFloat(total) || 0
      }];
    }

    if (!clientId || !Array.isArray(invoiceItems) || invoiceItems.length === 0 || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide clientId, items, and dueDate' });
    }

    const invoiceNumber = await generateInvoiceNumber();
    const itemsWithTotal = invoiceItems.map(item => ({
      ...item,
      quantity: parseFloat(item.quantity) || 1,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: (parseFloat(item.quantity) || 1) * (parseFloat(item.unitPrice) || 0)
    }));

    const calculatedSubtotal = subtotal !== undefined
      ? parseFloat(subtotal) || 0
      : itemsWithTotal.reduce((sum, item) => sum + item.total, 0);
    const calculatedTax = tax !== undefined
      ? parseFloat(tax) || 0
      : (calculatedSubtotal * (parseFloat(taxRate) || 0)) / 100;
    const calculatedTotal = total !== undefined
      ? parseFloat(total) || 0
      : calculatedSubtotal + calculatedTax;
    const normalizedStatus = ['draft', 'pending', 'paid', 'overdue', 'cancelled'].includes(status)
      ? status
      : 'draft';

    const invoice = await Invoice.create({
      invoiceNumber,
      clientId,
      caseId,
      status: normalizedStatus,
      issueDate: new Date(),
      dueDate,
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      total: calculatedTotal,
      paidAmount: paidAmount !== undefined ? parseFloat(paidAmount) || 0 : 0,
      notes: notes || description,
      items: itemsWithTotal
    });

    // await auditLogger.create({
    //   entity: 'Invoice',
    //   entityId: invoice.id,
    //   description: `Factura creada: ${invoiceNumber} - Cliente: ${clientId} - Total: $${total}`,
    //   newValues: { invoiceNumber, clientId, total },
    //   user: req.user,
    //   req
    // });

    res.status(201).json({ success: true, message: 'Invoice created successfully', data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const { clientId, status } = req.query;
    const where = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const invoices = await Invoice.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: invoices, count: invoices.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const { status, paidAmount, notes } = req.body;
    await invoice.update({
      status: status || invoice.status,
      paidAmount: paidAmount !== undefined ? paidAmount : invoice.paidAmount,
      notes: notes !== undefined ? notes : invoice.notes
    });

    res.json({ success: true, message: 'Invoice updated', data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    await invoice.destroy();
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoiceStats = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    const stats = {
      total: invoices.length,
      draft: invoices.filter(i => i.status === 'draft').length,
      pending: invoices.filter(i => i.status === 'pending').length,
      paid: invoices.filter(i => i.status === 'paid').length,
      overdue: invoices.filter(i => i.status === 'overdue').length,
      totalAmount: invoices.reduce((sum, i) => sum + parseFloat(i.total || 0), 0),
      paidAmount: invoices.reduce((sum, i) => sum + parseFloat(i.paidAmount || 0), 0)
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { clientId, status } = req.query;
    const where = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    const invoices = await Invoice.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: invoices, count: invoices.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ 
      where: { clientId: req.params.clientId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    await invoice.update({ status: 'paid', paidAmount: invoice.total });
    res.json({ success: true, message: 'Invoice marked as paid', data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
