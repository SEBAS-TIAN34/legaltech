const axios = require('axios');

const API = {
  auth: 'http://localhost:3001/api/auth',
  cases: 'http://localhost:3002/api/cases',
  clients: 'http://localhost:3003/api/clients',
  documents: 'http://localhost:3004/api/documents',
  timetracking: 'http://localhost:3005/api/time-entries',
  billing: 'http://localhost:3006/api/invoices',
  notifications: 'http://localhost:3007/api/notifications',
  dashboard: 'http://localhost:3008/api/dashboard'
};

let token = '';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: token ? `Bearer ${token}` : ''
});

async function testHealth() {
  console.log('\n🔍 [1] Test Health Checks');
  const services = ['auth', 'cases', 'clients', 'documents', 'timetracking', 'billing', 'notifications', 'dashboard'];
  
  for (const service of services) {
    try {
      const res = await axios.get(`http://localhost:300${services.indexOf(service) + 1}/health`);
      console.log(`  ✅ ${service}: ${res.data.success || res.data.status || 'OK'}`);
    } catch (e) {
      console.log(`  ❌ ${service}: ${e.message}`);
    }
  }
}

async function testAuth() {
  console.log('\n🔐 [2] Test Auth Service');
  
  let testEmail = 'test' + Date.now() + '@legaltech.com';
  let testPassword = 'test123';
  
  try {
    const res = await axios.post(`${API.auth}/register`, {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: testPassword,
      role: 'lawyer'
    });
    console.log('  ✅ Register:', res.data.success);
    token = res.data.data?.token;
  } catch (e) {
    console.log('  ⚠️ Register (puede existir):', e.response?.data?.message || e.message);
    testEmail = 'new' + Date.now() + '@test.com';
    testPassword = 'test123';
  }

  try {
    const loginRes = await axios.post(`${API.auth}/login`, {
      email: testEmail,
      password: testPassword
    });
    
    token = loginRes.data.token || loginRes.data.data?.token;
    
    if (token) {
      console.log('  ✅ Login: true - Token received');
      console.log('     Token:', token.substring(0, 50) + '...');
    } else {
      console.log('  ❌ Login: No token in response');
      console.log('     Response:', JSON.stringify(loginRes.data));
    }
  } catch (e) {
    console.log('  ❌ Login:', e.response?.data?.message || e.message);
  }
}

async function testClients() {
  console.log('\n👥 [3] Test Clients Service');
  
  try {
    const res = await axios.post(`${API.clients}/`, {
      firstName: 'Cliente',
      lastName: 'Prueba',
      documentType: 'CC',
      documentNumber: '12345678',
      email: 'cliente@test.com',
      phone: '3001234567',
      clientType: 'individual'
    }, { headers: headers() });
    console.log('  ✅ Create Client:', res.data.success);
    return res.data.data?._id;
  } catch (e) {
    console.log('  ❌ Create Client:', e.response?.data?.message || e.message);
  }
}

async function testCases(clientId) {
  console.log('\n⚖️ [4] Test Cases Service');
  
  try {
    const res = await axios.post(`${API.cases}/`, {
      caseNumber: 'CASE-2024-TEST',
      title: 'Caso de Prueba',
      description: 'Descripcion de prueba',
      caseType: 'civil',
      priority: 'high',
      clientId: clientId || 'test-client-id',
      assignedTo: 'Abogado Test',
      startDate: '2024-01-01'
    }, { headers: headers() });
    console.log('  ✅ Create Case:', res.data.success);
    return res.data.data?._id;
  } catch (e) {
    console.log('  ❌ Create Case:', e.response?.data?.message || e.message);
  }
}

async function testNotifications() {
  console.log('\n🔔 [5] Test Notifications Service');
  
  try {
    const res = await axios.post(`${API.notifications}/`, {
      userId: 'test-user-id',
      title: 'Test Notification',
      message: 'This is a test',
      type: 'info'
    }, { headers: headers() });
    console.log('  ✅ Create Notification:', res.data.success);
  } catch (e) {
    console.log('  ❌ Create Notification:', e.response?.data?.message || e.message);
  }
}

async function testDashboard() {
  console.log('\n📊 [6] Test Dashboard Service');
  
  try {
    const res = await axios.get(`${API.dashboard}/stats`, { headers: headers() });
    console.log('  ✅ Dashboard Stats:', res.data.success);
  } catch (e) {
    console.log('  ❌ Dashboard Stats:', e.response?.data?.message || e.message);
  }
}

async function runTests() {
  console.log('========================================');
  console.log('   PRUEBAS AUTOMATIZADAS - LEGALTECH');
  console.log('========================================');
  
  await testHealth();
  await testAuth();
  const clientId = await testClients();
  await testCases(clientId);
  await testNotifications();
  await testDashboard();
  
  console.log('\n========================================');
  console.log('   PRUEBAS COMPLETADAS');
  console.log('========================================');
}

runTests().catch(console.error);