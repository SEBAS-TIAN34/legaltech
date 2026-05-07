# LegalTech - Sistema de Gestión Legal

![LegalTech](https://img.shields.io/badge/LegalTech-v2.0-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-purple)

## 📋 Descripción

Sistema de gestión legal basado en microservicios con arquitectura de grado producción. Incluye autenticación, gestión de casos, clientes, documentos, facturación, seguimiento de tiempo y notificaciones.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Nginx)                    │
│                     http://localhost:80                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
   │  Auth   │         │ Cases   │         │ Clients │
   │ :3001   │         │ :3002   │         │ :3003   │
   └─────────┘         └─────────┘         └─────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   PostgreSQL :5432 │
                    │     (legaltech)    │
                    └───────────────────┘
```

## 🚀 Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **Auth** | 3001 | Autenticación y usuarios |
| **Cases** | 3002 | Gestión de casos legales |
| **Clients** | 3003 | Gestión de clientes |
| **Documents** | 3004 | Gestión de documentos |
| **Time Tracking** | 3005 | Seguimiento de tiempo |
| **Billing** | 3006 | Facturación e invoices |
| **Notifications** | 3007 | Notificaciones y alertas |
| **Dashboard** | 3008 | Estadísticas y métricas |
| **PostgreSQL** | 5432 | Base de datos |
| **Nginx** | 80 | API Gateway |

## 📦 Tecnologías

- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL 15 + Sequelize
- **Contenedores**: Docker + Docker Compose
- **Orquestación**: Kubernetes
- **API Gateway**: Nginx
- **Testing**: Jest + Supertest

## 🛠️ Instalación

### Opción 1: Docker Compose (Desarrollo)

```bash
# Clone el proyecto
cd legaltech

# Iniciar con PostgreSQL
docker-compose -f docker-compose.postgres.yml up -d --build

# Verificar servicios
docker-compose -f docker-compose.postgres.yml ps

# Ver logs
docker-compose -f docker-compose.postgres.yml logs -f

# Tests
node test-full.js
```

### Opción 2: Con API Gateway (Nginx)

```bash
# Iniciar con Nginx
docker-compose -f docker-compose.nginx.yml up -d --build

# Acceder a través de Nginx
curl http://localhost/api/auth/health
```

### Opción 3: Kubernetes (Producción)

```bash
# Requiere kubectl configurado
cd k8s

# Deploy
./deploy.sh

# Ver servicios
kubectl get all -n legaltech
```

## 📡 Endpoints

### Auth Service
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Perfil de usuario
- `PUT /api/auth/profile` - Actualizar perfil

### Cases Service
- `GET /api/cases` - Listar casos
- `POST /api/cases` - Crear caso
- `GET /api/cases/:id` - Ver caso
- `PUT /api/cases/:id` - Actualizar caso
- `DELETE /api/cases/:id` - Eliminar caso

### Clients Service
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients/:id` - Ver cliente

### Documents Service
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Subir documento
- `GET /api/documents/:id/download` - Descargar

### Time Tracking
- `GET /api/time-entries` - Listar entradas
- `POST /api/time-entries` - Crear entrada

### Billing
- `GET /api/invoices` - Listar facturas
- `POST /api/invoices` - Crear factura

### Notifications
- `GET /api/notifications` - Listar notificaciones

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Coverage
npm test -- --coverage

# Test manual
node test-full.js
```

## 📊 Características

### Seguridad
- ✅ Autenticación JWT
- ✅ Rate Limiting (Nginx)
- ✅ Validación de datos
- ✅ Hash de contraseñas (bcrypt)
- ✅ Secrets en Kubernetes

### Rendimiento
- ✅ Health Checks
- ✅ Readiness Probes
- ✅ Liveness Probes
- ✅ Auto-scaling (HPA)
- ✅ Connection Pooling

### Alta Disponibilidad
- ✅ Múltiples réplicas
- ✅ Health monitoring
- ✅ Graceful shutdown
- ✅ Persistent volumes

## 📁 Estructura

```
legaltech/
├── auth-service/          # Auth microservice
├── cases-service/         # Cases microservice
├── clients-service/       # Clients microservice
├── documents-service/    # Documents microservice
├── time-tracking-service/# Time tracking microservice
├── billing-service/      # Billing microservice
├── notifications-service/# Notifications microservice
├── dashboard-service/    # Dashboard microservice
├── frontend/             # Frontend web
├── k8s/                  # Kubernetes configs
│   ├── services/         # Service deployments
│   ├── postgres/         # PostgreSQL config
│   └── ingress/          # Ingress rules
├── nginx/                # Nginx config
├── docs/                 # Documentation
├── docker-compose.postgres.yml
├── docker-compose.nginx.yml
└── test-full.js
```

## 🔧 Variables de Entorno

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=legaltech
DB_USER=admin
DB_PASSWORD=admin123

# JWT
JWT_SECRET=your-secret-key

# Services
AUTH_SERVICE_URL=http://auth-service:3001
CASES_SERVICE_URL=http://cases-service:3002
```

## 📝 Notas

- PostgreSQL requiere `admin:admin123` para conexión
- JWT secret debe ser el mismo en todos los servicios
- Kubernetes requiere mínimo 8GB RAM
- Para desarrollo local usar `127.0.0.1` en lugar de `localhost` en Windows

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama (`git checkout -b feature/amazing`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing`)
5. Crear Pull Request

## 📄 Licencia

MIT License - Ver LICENSE para más detalles.

---

⌨️ LegalTech v2.0 - Construido con ❤️ para gestión legal moderna