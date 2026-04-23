# Integración de Servicios

## 🔗 Comunicación Entre Microservicios

Los microservicios pueden comunicarse entre sí pero siguen el principio de **loose coupling**. Aquí se describe cómo hacerlo:

### 1. Cases Service → Users Service

El servicio de casos puede verificar que un usuario existe antes de asignarle un caso:

```javascript
// En cases-service/src/controllers/caseController.js
const axios = require('axios');

const verifyUser = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.USERS_SERVICE_URL}/api/auth/users/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.INTERNAL_AUTH_TOKEN}`
        }
      }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error verifying user:', error);
    return false;
  }
};
```

### 2. Cases Service → Clients Service

Verificar cliente antes de crear caso:

```javascript
const verifyClient = async (clientId) => {
  try {
    const response = await axios.get(
      `${process.env.CLIENTS_SERVICE_URL}/api/clients/${clientId}`
    );
    return response.data.success;
  } catch (error) {
    return false;
  }
};
```

### 3. Documents Service → Cases Service

Verificar que el caso existe antes de asignar documento:

```javascript
const verifyCaseExists = async (caseId) => {
  try {
    const response = await axios.get(
      `${process.env.CASES_SERVICE_URL}/api/cases/${caseId}`
    );
    return response.data.success;
  } catch (error) {
    return false;
  }
};
```

---

## 🔐 API Gateway (Opcional)

Para centralizar el acceso a todos los servicios, se puede añadir un API Gateway:

```javascript
// api-gateway/server.js
const express = require('express');
const httpProxy = require('express-http-proxy');

const app = express();

app.use('/api/auth', httpProxy(`${process.env.USERS_SERVICE}`));
app.use('/api/cases', httpProxy(`${process.env.CASES_SERVICE}`));
app.use('/api/clients', httpProxy(`${process.env.CLIENTS_SERVICE}`));
app.use('/api/documents', httpProxy(`${process.env.DOCUMENTS_SERVICE}`));

app.listen(3000, () => console.log('API Gateway running on port 3000'));
```

Agregar al docker-compose.yml:

```yaml
api-gateway:
  build:
    context: ./api-gateway
  ports:
    - "3000:3000"
  environment:
    USERS_SERVICE: http://users-service:3001
    CASES_SERVICE: http://cases-service:3002
    CLIENTS_SERVICE: http://clients-service:3003
    DOCUMENTS_SERVICE: http://documents-service:3004
  depends_on:
    - users-service
    - cases-service
    - clients-service
    - documents-service
```

---

## 📨 Event-Driven Architecture (Opcional)

### Con RabbitMQ

Para comunicación asíncrona entre servicios:

```yaml
# En docker-compose.yml
rabbitmq:
  image: rabbitmq:3-management
  ports:
    - "5672:5672"
    - "15672:15672"
  environment:
    RABBITMQ_DEFAULT_USER: guest
    RABBITMQ_DEFAULT_PASS: guest
```

### Ejemplo: Notificar cuando se crea un caso

```javascript
// En cases-service
const amqp = require('amqplib');

async function publishEvent(event) {
  const connection = await amqp.connect('amqp://guest:guest@rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertExchange('legaltech_events', 'topic', { durable: true });
  
  channel.publish(
    'legaltech_events',
    'case.created',
    Buffer.from(JSON.stringify(event))
  );
}

// Cuando se crea un caso
exports.createCase = async (req, res) => {
  // ... crear caso ...
  
  await publishEvent({
    type: 'case.created',
    caseId: caseData._id,
    clientId: caseData.clientId
  });
};
```

### Suscribirse a eventos en Documents Service

```javascript
// En documents-service
async function subscribeToEvents() {
  const connection = await amqp.connect('amqp://guest:guest@rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertExchange('legaltech_events', 'topic', { durable: true });
  
  const q = await channel.assertQueue('documents_queue', { durable: true });
  await channel.bindQueue(q.queue, 'legaltech_events', 'case.*');
  
  channel.consume(q.queue, (msg) => {
    const event = JSON.parse(msg.content.toString());
    handleCaseEvent(event);
  });
}
```

---

## 🔄 Service Discovery (Opcional)

Para entornos más complejos, se puede usar Consul:

```yaml
consul:
  image: consul:latest
  ports:
    - "8500:8500"
  command: agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0
```

---

## 📊 Base de Datos Distribuida

### Patrón: Saga para Transacciones Distribuidas

```javascript
// Crear caso + Crear entrada en audit

async function createCaseWithAudit(caseData) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Step 1: Crear caso
    const newCase = await Case.create([caseData], { session });
    
    // Step 2: Crear audit log
    const auditLog = await AuditLog.create([{
      action: 'CASE_CREATED',
      caseId: newCase[0]._id,
      timestamp: new Date()
    }], { session });
    
    await session.commitTransaction();
    return newCase[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

---

## 🚀 Próximos Pasos

1. **Circuit Breaker Pattern** - Usar biblioteca como `opossum`
2. **Load Balancing** - Usar Nginx o Kong
3. **Caching** - Implementar Redis
4. **Monitoring** - ELK Stack o Datadog
5. **Rate Limiting** - express-rate-limit
6. **Logging Centralizado** - ELK o Splunk

---

**Documentación de Integración - LegalTech Microservices**
