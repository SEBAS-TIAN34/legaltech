const http = require('http');

const services = [
  { name: 'Auth', port: 3001, path: '/health' },
  { name: 'Cases', port: 3002, path: '/health' },
  { name: 'Clients', port: 3003, path: '/health' },
  { name: 'Documents', port: 3004, path: '/health' },
  { name: 'Time Tracking', port: 3005, path: '/health' },
  { name: 'Billing', port: 3006, path: '/health' },
  { name: 'Notifications', port: 3007, path: '/health' },
  { name: 'Dashboard', port: 3008, path: '/health' }
];

const endpoints = [
  { service: 'Auth', port: 3001, method: 'POST', path: '/api/auth/register', data: { firstName: 'Test', lastName: 'User', email: 'test' + Date.now() + '@test.com', password: 'test123', role: 'admin' } },
  { service: 'Auth', port: 3001, method: 'POST', path: '/api/auth/login', data: { email: 'test@test.com', password: 'test123' } },
];

function checkService(service) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${service.port}${service.path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ name: service.name, port: service.port, status: res.statusCode === 200 ? '✅' : '❌', data: data });
      });
    });
    req.on('error', () => resolve({ name: service.name, port: service.port, status: '❌', data: 'No response' }));
    req.setTimeout(3000, () => { req.destroy(); resolve({ name: service.name, port: service.port, status: '⏱️', data: 'Timeout' }); });
  });
}

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const data = JSON.stringify(endpoint.data);
    const req = http.request({ hostname: '127.0.0.1', port: endpoint.port, path: endpoint.path, method: endpoint.method, headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ service: endpoint.service, endpoint: endpoint.path, status: res.statusCode, response: body.substring(0, 200) }));
    });
    req.on('error', () => resolve({ service: endpoint.service, endpoint: endpoint.path, status: 'ERROR', response: 'Connection failed' }));
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║     LegalTech - Suite de Pruebas Automatizadas     ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log('┌────────────────────────────────────────────────────────────┐');
  console.log('│ 1. VERIFICACIÓN DE SERVICIOS (Health Checks)            │');
  console.log('└────────────────────────────────────────────────────────────┘\n');

  const results = await Promise.all(services.map(checkService));
  results.forEach(r => console.log(`  ${r.status} ${r.name.padEnd(20)} (Puerto: ${r.port})`));

  const allHealthy = results.filter(r => r.status === '✅').length;
  console.log(`\n  Resultado: ${allHealthy}/${results.length} servicios activos\n`);

  console.log('┌────────────────────────────────────────────────────────────┐');
  console.log('│ 2. PRUEBAS DE ENDPOINTS                                  │');
  console.log('└────────────────────────────────────────────────────────────┘\n');

  const endpointResults = await Promise.all(endpoints.map(testEndpoint));
  endpointResults.forEach(r => console.log(`  ${r.status === 200 || r.status === 201 ? '✅' : '❌'} ${r.service.padEnd(15)} ${r.endpoint.padEnd(30)} → HTTP ${r.status}`));

  console.log('\n┌────────────────────────────────────────────────────────────┐');
  console.log('│ 3. RESUMEN                                                │');
  console.log('└────────────────────────────────────────────────────────────┘\n');

  if (allHealthy === services.length) {
    console.log('  🎉 Todos los microservicios están funcionando correctamente!\n');
    console.log('  📋 Endpoints disponibles:\n');
    console.log('    • Auth Service:      http://localhost:3001/api/auth/*');
    console.log('    • Cases Service:    http://localhost:3002/api/cases/*');
    console.log('    • Clients Service:  http://localhost:3003/api/clients/*');
    console.log('    • Documents:        http://localhost:3004/api/documents/*');
    console.log('    • Time Tracking:    http://localhost:3005/api/time-entries/*');
    console.log('    • Billing:          http://localhost:3006/api/invoices/*');
    console.log('    • Notifications:    http://localhost:3007/api/notifications/*');
    console.log('    • Dashboard:        http://localhost:3008/api/dashboard/*\n');
  } else {
    console.log('  ⚠️ Algunos servicios no responden. Verifica Docker.\n');
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
}

runTests();