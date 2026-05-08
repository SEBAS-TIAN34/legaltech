const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function test() {
  // Test 1: Register
  console.log('1. Testing register...');
  const registerData = JSON.stringify({ firstName: 'Admin', lastName: 'User', email: 'admin@test.com', password: '123456', role: 'admin' });
  const registerRes = await makeRequest({
    hostname: 'localhost', port: 3001, path: '/api/auth/register',
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': registerData.length }
  }, registerData);
  console.log('Register:', registerRes.body);

  // Test 2: Login
  console.log('\n2. Testing login...');
  const loginData = JSON.stringify({ email: 'admin@test.com', password: '123456' });
  const loginRes = await makeRequest({
    hostname: 'localhost', port: 3001, path: '/api/auth/login',
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
  }, loginData);
  const loginJson = JSON.parse(loginRes.body);
  const token = loginJson.data?.token || '';
  console.log('Login:', loginRes.body);

  if (!token) return;

  // Test 3: Create Client
  console.log('\n3. Testing create client...');
  const clientData = JSON.stringify({ firstName: 'Juan', lastName: 'Perez', documentType: 'CC', documentNumber: '12345678', email: 'juan@test.com', clientType: 'individual' });
  const clientRes = await makeRequest({
    hostname: 'localhost', port: 3003, path: '/api/clients/',
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': clientData.length, 'Authorization': `Bearer ${token}` }
  }, clientData);
  console.log('Create Client:', clientRes.body);
  const clientJson = JSON.parse(clientRes.body);
  const clientId = clientJson.data?.id || 'test-client-id';

  // Test 4: Create Case
  console.log('\n4. Testing create case...');
  const caseData = JSON.stringify({ caseNumber: 'CASE-001', title: 'Test Case', description: 'Test description', clientId: clientId, caseType: 'civil', priority: 'high' });
  const caseRes = await makeRequest({
    hostname: 'localhost', port: 3002, path: '/api/cases/',
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': caseData.length, 'Authorization': `Bearer ${token}` }
  }, caseData);
  console.log('Create Case:', caseRes.body);

  console.log('\n✅ All API tests completed!');
}

test().catch(console.error);