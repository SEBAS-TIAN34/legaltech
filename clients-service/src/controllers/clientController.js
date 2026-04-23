const Client = require('../models/Client');

// @route   POST /clients
// @desc    Create a new client
// @access  Private
exports.createClient = async (req, res) => {
  try {
    const { firstName, lastName, documentType, documentNumber, email, phone, address, clientType, companyName, taxId, notes } = req.body;

    if (!firstName || !lastName || !documentType || !documentNumber || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const clientData = await Client.create({
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
      data: clientData
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Document number already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /clients
// @desc    Get all clients
// @access  Private
exports.getAllClients = async (req, res) => {
  try {
    const { clientType, isActive } = req.query;
    let query = {};

    if (clientType) query.clientType = clientType;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const clients = await Client.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /clients/:id
// @desc    Get client by ID
// @access  Private
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /clients/:id
// @desc    Update client
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, notes } = req.body;

    let client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    if (firstName) client.firstName = firstName;
    if (lastName) client.lastName = lastName;
    if (email) client.email = email;
    if (phone) client.phone = phone;
    if (address) client.address = { ...client.address, ...address };
    if (notes) client.notes = notes;

    client.updatedAt = Date.now();
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /clients/:id
// @desc    Delete client (soft delete)
// @access  Private/Admin
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    client.isActive = false;
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClientCases = async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get(
      `${process.env.CASES_SERVICE_URL || 'http://localhost:3002'}/api/cases?clientId=${req.params.id}`
    );
    res.status(200).json({
      success: true,
      data: response.data.data || []
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: []
    });
  }
};
