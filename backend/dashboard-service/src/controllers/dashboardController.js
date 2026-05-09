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

exports.getStats = async (req, res) => {
  try {
    const [usersRes, casesRes, clientsRes, invoicesRes, documentsRes, timeEntriesRes] = await Promise.allSettled([
      axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/users`),
      axios.get(`${process.env.CASES_SERVICE_URL}/api/cases`),
      axios.get(`${process.env.CLIENTS_SERVICE_URL}/api/clients`),
      axios.get(`${process.env.BILLING_SERVICE_URL}/api/invoices`),
      axios.get(`${process.env.DOCUMENTS_SERVICE_URL}/api/documents`),
      axios.get(`${process.env.TIME_TRACKING_SERVICE_URL}/api/time-entries`)
    ]);

    const users = usersRes.status === 'fulfilled' ? usersRes.data.data.count || 0 : 0;
    const cases = casesRes.status === 'fulfilled' ? casesRes.data.data.count || 0 : 0;
    const clients = clientsRes.status === 'fulfilled' ? clientsRes.data.data.count || 0 : 0;
    const documents = documentsRes.status === 'fulfilled' ? documentsRes.data.data.count || 0 : 0;
    const timeEntries = timeEntriesRes.status === 'fulfilled' ? timeEntriesRes.data.data.count || 0 : 0;

    let totalRevenue = 0;
    let pendingAmount = 0;
    if (invoicesRes.status === 'fulfilled') {
      const invoices = invoicesRes.data.data.data || [];
      totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0);
      pendingAmount = invoices
        .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
        .reduce((sum, inv) => sum + inv.total, 0);
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers: users,
        totalCases: cases,
        totalClients: clients,
        totalDocuments: documents,
        totalTimeEntries: timeEntries,
        totalRevenue,
        pendingAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCasesStats = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.CASES_SERVICE_URL}/api/cases`);
    const cases = response.data.data.data || [];

    const byStatus = {
      draft: cases.filter(c => c.status === 'draft').length,
      open: cases.filter(c => c.status === 'open').length,
      in_progress: cases.filter(c => c.status === 'in_progress').length,
      closed: cases.filter(c => c.status === 'closed').length,
      suspended: cases.filter(c => c.status === 'suspended').length
    };

    const byType = {};
    cases.forEach(c => {
      byType[c.caseType] = (byType[c.caseType] || 0) + 1;
    });

    const byPriority = {
      low: cases.filter(c => c.priority === 'low').length,
      medium: cases.filter(c => c.priority === 'medium').length,
      high: cases.filter(c => c.priority === 'high').length
    };

    res.status(200).json({
      success: true,
      data: {
        total: cases.length,
        byStatus,
        byType,
        byPriority
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFinancialStats = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.BILLING_SERVICE_URL}/api/invoices`);
    const invoices = response.data.data.data || [];

    const paid = invoices.filter(inv => inv.status === 'paid');
    const pending = invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled');
    const overdue = invoices.filter(inv => inv.status === 'overdue');

    const totalPaid = paid.reduce((sum, inv) => sum + inv.total, 0);
    const totalPending = pending.reduce((sum, inv) => sum + inv.total, 0);
    const totalOverdue = overdue.reduce((sum, inv) => sum + inv.total, 0);

    res.status(200).json({
      success: true,
      data: {
        totalInvoices: invoices.length,
        paidCount: paid.length,
        pendingCount: pending.length,
        overdueCount: overdue.length,
        totalPaid,
        totalPending,
        totalOverdue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductivityStats = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.TIME_TRACKING_SERVICE_URL}/api/time-entries`);
    const timeEntries = response.data.data.data || [];

    const totalMinutes = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalBillable = timeEntries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const byUser = {};
    timeEntries.forEach(entry => {
      const userId = entry.userId?._id || entry.userId;
      if (userId) {
        byUser[userId] = (byUser[userId] || 0) + (entry.duration || 0);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalTimeEntries: timeEntries.length,
        totalMinutes,
        totalBillable,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        byUser
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClientsStats = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.CLIENTS_SERVICE_URL}/api/clients`);
    const clients = response.data.data.data || [];

    const byType = {
      individual: clients.filter(c => c.clientType === 'individual').length,
      company: clients.filter(c => c.clientType === 'company').length
    };

    const byStatus = {
      active: clients.filter(c => c.isActive !== false).length,
      inactive: clients.filter(c => c.isActive === false).length
    };

    res.status(200).json({
      success: true,
      data: {
        totalClients: clients.length,
        byType,
        byStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};