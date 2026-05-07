const axios = require('axios');
const { performance } = require('perf_hooks');

const SERVICES = [
  { name: 'Auth', url: 'http://localhost:3001/health' },
  { name: 'Cases', url: 'http://localhost:3002/health' },
  { name: 'Clients', url: 'http://localhost:3003/health' },
  { name: 'Documents', url: 'http://localhost:3004/health' },
  { name: 'TimeTracking', url: 'http://localhost:3005/health' },
  { name: 'Billing', url: 'http://localhost:3006/health' },
  { name: 'Notifications', url: 'http://localhost:3007/health' },
  { name: 'Dashboard', url: 'http://localhost:3008/health' }
];

const TOTAL_USERS = 500;
const ITERATIONS_PER_USER = 10;

async function makeRequest(url, method = 'GET', data = null) {
  const start = performance.now();
  try {
    const config = { method, url, timeout: 5000 };
    if (data) config.data = data;
    await axios(config);
    return { success: true, time: performance.now() - start };
  } catch (error) {
    return { success: false, time: performance.now() - start, error: error.message };
  }
}

async function stressTest() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('     PRUEBA DE ESTRÉS - LEGALTECH MICROSERVICIOS (500 usuarios)');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log(`Usuarios virtuales: ${TOTAL_USERS}`);
  console.log(`Iteraciones por usuario: ${ITERATIONS_PER_USER}`);
  console.log(`Total de peticiones: ${TOTAL_USERS * ITERATIONS_PER_USER}\n`);
  
  const results = [];
  
  for (const service of SERVICES) {
    console.log(`🧪 Probando ${service.name}...`);
    
    let successCount = 0;
    let failCount = 0;
    let totalTime = 0;
    let minTime = Infinity;
    let maxTime = 0;
    const times = [];
    
    const promises = [];
    
    for (let i = 0; i < TOTAL_USERS * ITERATIONS_PER_USER; i++) {
      promises.push(
        makeRequest(service.url).then(result => {
          if (result.success) {
            successCount++;
            times.push(result.time);
            totalTime += result.time;
            if (result.time < minTime) minTime = result.time;
            if (result.time > maxTime) maxTime = result.time;
          } else {
            failCount++;
          }
        })
      );
    }
    
    await Promise.all(promises);
    
    const avgTime = times.length > 0 ? totalGame / times.length : 0;
    const p95 = times.length > 0 
      ? times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)] 
      : 0;
    
    results.push({
      name: service.name,
      success: successCount,
      failed: failCount,
      avgTime: avgTime.toFixed(2),
      minTime: minTime === Infinity ? 0 : minTime.toFixed(2),
      maxTime: maxTime.toFixed(2),
      p95: p95.toFixed(2),
      throughput: ((successCount / 60) * 1000).toFixed(2)
    });
    
    console.log(`   ✅ Éxitos: ${successCount}, ❌ Fallos: ${failCount}`);
    console.log(`   ⏱️ Tiempo promedio: ${avgTime.toFixed(2)}ms\n`);
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                        RESUMEN DE RESULTADOS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Servicio'.padEnd(20) + 'Éxitos'.padEnd(10) + 'Fallos'.padEnd(10) + 'Tiempo Avg'.padEnd(12) + 'P95'.padEnd(10) + 'Throughput');
  console.log('-'.repeat(75));
  
  results.forEach(r => {
    console.log(
      r.name.padEnd(20) + 
      r.success.toString().padEnd(10) + 
      r.failed.toString().padEnd(10) + 
      r.avgTime.padEnd(12) + 
      r.p95.padEnd(10) + 
      r.throughput
    );
  });
  
  const totalSuccess = results.reduce((sum, r) => sum + r.success, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const successRate = ((totalSuccess / (totalSuccess + totalFailed)) * 100).toFixed(2);
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`Tasa de éxito total: ${successRate}%`);
  console.log('═══════════════════════════════════════════════════════════════');
  
  return { results, successRate };
}

stressTest()
  .then(result => {
    console.log('\n✅ Prueba de estrés completada');
    process.exit(result.successRate >= 95 ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error en prueba de estrés:', error.message);
    process.exit(1);
  });