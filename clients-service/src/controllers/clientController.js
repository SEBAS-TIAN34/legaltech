const Client = require('../models/Client');

exports.createClient = async (req, res) => {
  try {
    const { firstName, lastName, documentType, documentNumber, email, phone, address, clientType, companyName, taxId, notes } = req.body;

    if (!firstName || !lastName || !documentType || !documentNumber) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields: firstName, lastName, documentType, documentNumber' });
    }

    const client = await Client.create({
      firstName,
      lastName,
      documentType,
      documentNumber,
      email,
      phone,
      address,
      clientType: clientType || 'individual',
      companyName,
      taxId,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const { clientType, isActive } = req.query;
    const where = {};
    if (clientType) where.clientType = clientType;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const clients = await Client.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: clients, count: clients.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const { firstName, lastName, documentType, documentNumber, email, phone, address, clientType, companyName, taxId, notes, isActive } = req.body;

    await client.update({
      firstName: firstName || client.firstName,
      lastName: lastName || client.lastName,
      documentType: documentType || client.documentType,
      documentNumber: documentNumber || client.documentNumber,
      email: email || client.email,
      phone: phone || client.phone,
      address: address !== undefined ? address : client.address,
      clientType: clientType || client.clientType,
      companyName: companyName !== undefined ? companyName : client.companyName,
      taxId: taxId !== undefined ? taxId : client.taxId,
      notes: notes !== undefined ? notes : client.notes,
      isActive: isActive !== undefined ? isActive : client.isActive
    });

    res.json({ success: true, message: 'Client updated successfully', data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await client.destroy();
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClientCases = async (req, res) => {
  res.json({ success: true, message: 'Client cases endpoint', data: [] });
};