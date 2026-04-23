# 📊 Arquitectura de LegalTech Microservicios

## 🏗️ Diagrama de Servicios

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTES / FRONTEND                          │
│                  (Web, Mobile, Desktop)                          │
└────────────────┬────────────────────────────────┬────────────────┘
                 │                                │
         ┌───────▼────────┐           ┌──────────▼────────┐
         │  HTTP Request  │           │ HTTP Request      │
         │   (API Call)   │           │  (API Call)       │
         └───────┬────────┘           └──────────┬────────┘
                 │                                │
    ┌────────────┴───────────────────────────────┴────────┐
    │                  API GATEWAY (Optional)             │
    │              (Nginx, Kong, Express)                 │
    └────┬────────────┬────────────────┬──────────┬──────┘
         │            │                │          │
    ┌────▼───┐ ┌──────▼────┐  ┌───────▼────┐  ┌──▼─────┐
    │ Auth   │ │ Cases     │  │ Clients    │  │Docs    │
    │Service │ │ Service   │  │ Service    │  │Service │
    │:3001   │ │ :3002     │  │ :3003      │  │:3004   │
    │        │ │           │  │            │  │        │
    │ Node   │ │ Node      │  │ Node       │  │Node    │
    │Express │ │ Express   │  │ Express    │  │Express │
    │ JWT    │ │ -         │  │ -          │  │Multer  │
    │BCrypt  │ │           │  │            │  │        │
    └───┬────┘ └─────┬─────┘  └──────┬─────┘  └───┬────┘
        │            │               │             │
        └────────────┼───────────────┼─────────────┘
                     │               │
                     ▼               ▼
            ┌─────────────────────────────┐
            │      MongoDB (27017)        │
            │  (ReplicaSet Optional)      │
            │                             │
            │  ├── users-db              │
            │  ├── cases-db              │
            │  ├── clients-db            │
            │  └── documents-db          │
            └─────────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Persistent     │
            │  Volumes        │
            │                 │
            │ • mongodb_data  │
            │ • uploads/      │
            └─────────────────┘
```

---

## 📦 Estructura de Servicios

### 1️⃣ Usuarios y Autenticación
**Puerto:** 3001  
**Stack:** Node.js + Express + MongoDB + JWT

```
users-service/
├── src/
│   ├── models/
│   │   ├── User.js          (Esquema usuario)
│   │   └── Role.js          (Esquema roles)
│   ├── controllers/
│   │   └── authController.js (Lógica auth)
│   ├── routes/
│   │   └── auth.js          (Rutas auth)
│   ├── middleware/
│   │   └── auth.js          (JWT, autorización)
│   ├── config/
│   │   └── database.js      (Conexión MongoDB)
│   └── index.js             (App principal)
├── Dockerfile
├── package.json
└── .env.example
```

**Endpoints:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/users
- GET /api/auth/users/:id
- PUT /api/auth/users/:id
- DELETE /api/auth/users/:id

---

### 2️⃣ Casos Legales
**Puerto:** 3002  
**Stack:** Node.js + Express + MongoDB

```
cases-service/
├── src/
│   ├── models/
│   │   └── Case.js          (Esquema caso)
│   ├── controllers/
│   │   └── caseController.js (Lógica casos)
│   ├── routes/
│   │   └── cases.js         (Rutas casos)
│   ├── config/
│   │   └── database.js
│   └── index.js
├── Dockerfile
├── package.json
└── .env.example
```

**Endpoints:**
- POST /api/cases
- GET /api/cases
- GET /api/cases/:id
- PUT /api/cases/:id
- DELETE /api/cases/:id

---

### 3️⃣ Clientes
**Puerto:** 3003  
**Stack:** Node.js + Express + MongoDB

```
clients-service/
├── src/
│   ├── models/
│   │   └── Client.js        (Esquema cliente)
│   ├── controllers/
│   │   └── clientController.js
│   ├── routes/
│   │   └── clients.js
│   ├── config/
│   │   └── database.js
│   └── index.js
├── Dockerfile
├── package.json
└── .env.example
```

**Endpoints:**
- POST /api/clients
- GET /api/clients
- GET /api/clients/:id
- PUT /api/clients/:id
- DELETE /api/clients/:id

---

### 4️⃣ Documentos
**Puerto:** 3004  
**Stack:** Node.js + Express + MongoDB + Multer

```
documents-service/
├── src/
│   ├── models/
│   │   └── Document.js      (Esquema documento)
│   ├── controllers/
│   │   └── documentController.js
│   ├── routes/
│   │   └── documents.js
│   ├── middleware/
│   │   └── fileUpload.js    (Multer config)
│   ├── config/
│   │   └── database.js
│   └── index.js
├── uploads/                 (Archivos guardados)
├── Dockerfile
├── package.json
└── .env.example
```

**Endpoints:**
- POST /api/documents (multipart/form-data)
- GET /api/documents
- GET /api/documents/:id
- GET /api/documents/:id/download
- DELETE /api/documents/:id

---

## 🗄️ Modelo de Datos

### Users Collection
```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: "user" | "admin" | "lawyer",
  permissions: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Cases Collection
```
{
  _id: ObjectId,
  caseNumber: String,
  title: String,
  description: String,
  clientId: String,
  status: "draft" | "open" | "in_progress" | "closed" | "suspended",
  caseType: String,
  priority: "low" | "medium" | "high" | "critical",
  assignedTo: String (userId),
  startDate: Date,
  endDate: Date,
  budget: Number,
  notes: String,
  documents: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Clients Collection
```
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  documentType: "CC" | "NIT" | "Pasaporte" | "CE",
  documentNumber: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  clientType: "individual" | "company",
  companyName: String,
  taxId: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Documents Collection
```
{
  _id: ObjectId,
  fileName: String,
  originalFileName: String,
  fileSize: Number,
  fileType: String,
  filePath: String,
  caseId: String,
  description: String,
  documentType: String,
  uploadedBy: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Flujo de Solicitud Típica

```
Usuario
  │
  ▼
Request HTTP
  │
  ▼
API Gateway / Load Balancer
  │
  ▼
Microservicio (Express.js)
  │
  ├─ Middleware (CORS, JSON parser)
  │
  ├─ Autenticación (JWT)
  │
  ├─ Validación (express-validator)
  │
  ├─ Controlador (lógica)
  │
  ├─ Modelo (Mongoose)
  │
  ▼
MongoDB
  │
  ▼
Respuesta JSON
  │
  ▼
Cliente
```

---

## 📊 Dependencias Principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| express | 4.18.2 | Framework web |
| mongoose | 7.5.0 | ODM MongoDB |
| bcryptjs | 2.4.3 | Hash passwords |
| jsonwebtoken | 9.0.2 | Tokens JWT |
| dotenv | 16.3.1 | Variables env |
| cors | 2.8.5 | CORS |
| multer | 1.4.5 | Upload files |
| express-validator | 7.0.0 | Validación |
| axios | 1.5.0 | HTTP client |

---

## 🔐 Flujo de Autenticación

```
Cliente
  │
  ▼
POST /register o /login
  │
  ▼
Auth Service
  │
  ├─ Validar email/contraseña
  ├─ Hash de contraseña
  └─ Generar JWT
  │
  ▼
Respuesta con Token
  │
  ▼
Cliente guarda TOKEN
  │
  ▼
Solicitudes posteriores
  │
  ├─ Authorization: Bearer TOKEN
  │
  ▼
Middleware autenticación
  ├─ Verificar JWT
  ├─ Extraer usuario
  └─ Verificar permisos
  │
  ▼
Continuar o rechazar
```

---

## 🚀 Escalabilidad

### Horizontal Scaling
```
Client Requests
  │
  ▼
Load Balancer (Nginx)
  │
  ├─ Users Service (Replica 1)
  ├─ Users Service (Replica 2)
  ├─ Users Service (Replica 3)
  │
  ▼
MongoDB ReplicaSet
  ├─ Primary
  ├─ Secondary
  └─ Secondary
```

### Con Docker Swarm
```bash
docker service scale users-service=3
docker service scale cases-service=2
docker service scale clients-service=2
docker service scale documents-service=2
```

---

## 📈 Monitoreo

```
Servicios Corriendo
  │
  ├─ Health Checks (/health)
  │
  ├─ Logs (stdout/stderr)
  │
  ├─ Metrics (prometheus)
  │
  ├─ Error Tracking (sentry)
  │
  └─ APM (New Relic, Datadog)
```

---

## 🎯 Arquitectura Final

```
┌─────────────────┐
│  Load Balancer  │ (Nginx, HAProxy)
└────────┬────────┘
         │
    ┌────┴────────────────────────────┐
    │                                 │
 ┌──▼──┐  ┌──────┐ ┌──────┐ ┌──────┐
 │Edge │  │Users │ │Cases │ │Docs  │
 │ Cache│  │Svc x3│ │Svc x2│ │Svc x2│
 │Redis │  └──────┘ └──────┘ └──────┘
 └──┬───┘      │        │         │
    │          ▼        ▼         ▼
    │     ┌─────────────────────────┐
    │     │  MongoDB ReplicaSet     │
    │     │  (Primary + Replicas)   │
    │     └─────────────────────────┘
    │
    └─ Message Queue (RabbitMQ)
    └─ Log Aggregation (ELK)
    └─ Monitoring (Prometheus/Grafana)
```

---

**Documentación de Arquitectura - LegalTech**
