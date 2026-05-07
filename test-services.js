const http = require('http');

const services = [
  { name: 'Auth Service', port: 3001, path: '/health' },
  { name: 'Cases Service', port: 3002, path: '/health' },
  { name: 'Clients Service', port: 3003, path: '/health' },
  { name: 'Documents Service', port: 3004, path: '/health' },
  { name: 'Time Tracking Service', port: 3005, path: '/health' },
  { name: 'Billing Service', port: 3006, path: '/health' },
  { name: 'Notifications Service', port: 3007, path: '/health' },
  { name: 'Dashboard Service', port: 3008, path: '/health' }
];

function checkService(service) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${service.port}${service.path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          name: service.name,
          port: service.port,
          status: res.statusCode === 200 ? 'OK' : 'ERROR',
          message: res.statusCode === 200 ? JSON.parse(data).status || 'Running' : `HTTP ${res.statusCode}`
        });
      });
    });
    req.on('error', () => {
      resolve({
        name: service.name,
        port: service.port,
        status: 'DOWN',
        message: 'No response'
      });
    });
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({
        name: service.name,
        port: service.port,
        status: 'TIMEOUT',
        message: 'Connection timeout'
      });
    });
  });
}

async function testAllServices() {
  console.log('\n🔍 LegalTech - Verificación de Microservicios\n');
  console.log('═══════════════════════════════════════════════════\n');

  const results = await Promise.all(services.map(checkService));

  let allOk = true;
  results.forEach(r => {
    const icon = r.status === 'OK' ? '✅' : '❌';
    console.log(`${icon} ${r.name.padEnd(25)} | Puerto: ${r.port} | ${r.message}`);
    if (r.status !== 'OK') allOk = false;
  });

  console.log('\n═══════════════════════════════════════════════════\n');

  if (allOk) {
    console.log('🎉 Todos los servicios están funcionando correctamente!\n');
  } else {
    console.log('⚠️  Algunos servicios no están respondiendo. Verifica Docker.\n');
  }

  return allOk;
}

if (require.main === module) {
  testAllServices();
}

module.exports = { testAllServices };