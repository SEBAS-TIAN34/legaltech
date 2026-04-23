# 🏢 LegalTech - Microservicios para Despacho Legal

## 📋 Descripción

Arquitectura de microservicios para un sistema completo de gestión legal que incluye autenticación, casos, clientes, documentos, seguimiento de tiempo, facturación, notificaciones y panel de control. Construido con Node.js, Express y MongoDB.

## 🏗️ Estructura de Microservicios

### 1. 🔐 Servicio de Autenticación (Puerto 3001)
- Registro y login de usuarios
- Gestión de roles y permisos (Admin, Lawyer, Paralegal, Assistant)
- Autenticación JWT con middleware de protección
- Endpoints: `/api/auth/*`

**Tecnologías**: Express, MongoDB, JWT, Bcrypt, Express-Validator

```bash
POST   /api/auth/register         # Registrar usuario
POST   /api/auth/login            # Iniciar sesión
GET    /api/auth/profile          # Obtener perfil
PUT    /api/auth/profile          # Actualizar perfil
PUT    /api/auth/change-password  # Cambiar contraseña
GET    /api/auth/users            # Listar usuarios (Admin)
PUT    /api/auth/users/:id/deactivate # Desactivar usuario (Admin)
GET    /health                    # Health check
```

---

### 2. ⚖️ Servicio de Casos (Puerto 3002)
- Crear y gestionar casos legales
- Actualizar estados del caso
- Asignar abogados y clientes
- Seguimiento del progreso
- Endpoints: `/api/cases/*`

**Tecnologías**: Express, MongoDB

```bash
POST   /api/cases                 # Crear caso
GET    /api/cases                 # Listar casos (con filtros)
GET    /api/cases/:id             # Obtener caso
PUT    /api/cases/:id             # Actualizar caso
DELETE /api/cases/:id             # Eliminar caso
GET    /api/cases/stats           # Estadísticas de casos
```

---

### 3. 👥 Servicio de Clientes (Puerto 3003)
- Gestionar información de clientes
- Registrar personas naturales y jurídicas
- Historial de casos por cliente
- Información de contacto y perfil
- Endpoints: `/api/clients/*`

**Tecnologías**: Express, MongoDB

```bash
POST   /api/clients               # Crear cliente
GET    /api/clients               # Listar clientes
GET    /api/clients/:id           # Obtener cliente
PUT    /api/clients/:id           # Actualizar cliente
DELETE /api/clients/:id           # Eliminar cliente
GET    /api/clients/:id/cases     # Casos del cliente
```

---

### 4. 📄 Servicio de Documentos (Puerto 3004)
- Subir y gestionar archivos legales
- Descargar documentos
- Asociar documentos a casos
- Control de versiones y metadatos
- Endpoints: `/api/documents/*`

**Tecnologías**: Express, MongoDB, Multer

```bash
POST   /api/documents             # Subir documento (multipart/form-data)
GET    /api/documents             # Listar documentos
GET    /api/documents/:id         # Obtener documento
GET    /api/documents/:id/download # Descargar documento
PUT    /api/documents/:id         # Actualizar metadatos
DELETE /api/documents/:id         # Eliminar documento
GET    /api/documents/case/:caseId # Documentos de un caso
```

---

### 5. ⏱️ Servicio de Seguimiento de Tiempo (Puerto 3005)
- Registrar tiempo trabajado en casos
- Seguimiento automático de actividades
- Reportes de productividad
- Facturación por horas
- Endpoints: `/api/time-entries/*`

**Tecnologías**: Express, MongoDB

```bash
POST   /api/time-entries          # Crear entrada de tiempo
GET    /api/time-entries          # Listar entradas
GET    /api/time-entries/:id      # Obtener entrada
PUT    /api/time-entries/:id      # Actualizar entrada
DELETE /api/time-entries/:id      # Eliminar entrada
GET    /api/time-entries/case/:caseId # Tiempo por caso
POST   /api/time-entries/:id/stop # Detener temporizador
```

---

### 6. 💰 Servicio de Facturación (Puerto 3006)
- Generar facturas automáticamente
- Calcular montos basados en tiempo
- Gestionar pagos y estados
- Reportes financieros
- Endpoints: `/api/invoices/*`

**Tecnologías**: Express, MongoDB

```bash
POST   /api/invoices              # Crear factura
GET    /api/invoices              # Listar facturas
GET    /api/invoices/:id          # Obtener factura
PUT    /api/invoices/:id          # Actualizar factura
DELETE /api/invoices/:id          # Eliminar factura
PUT    /api/invoices/:id/pay      # Marcar como pagada
GET    /api/invoices/client/:clientId # Facturas por cliente
```

---

### 7. 🔔 Servicio de Notificaciones (Puerto 3007)
- Sistema de alertas y recordatorios
- Notificaciones por email y push
- Eventos automáticos del sistema
- Plantillas personalizables
- Endpoints: `/api/notifications/*`

**Tecnologías**: Express, MongoDB, Nodemailer

```bash
POST   /api/notifications         # Crear notificación
GET    /api/notifications         # Listar notificaciones
GET    /api/notifications/:id     # Obtener notificación
PUT    /api/notifications/:id/read # Marcar como leída
DELETE /api/notifications/:id     # Eliminar notificación
POST   /api/notifications/send    # Enviar notificación inmediata
```

---

### 8. 📊 Servicio de Panel de Control (Puerto 3008)
- Dashboard con métricas en tiempo real
- Reportes y análisis de datos
- Gráficos y visualizaciones
- KPIs del despacho legal
- Endpoints: `/api/dashboard/*`

**Tecnologías**: Express, MongoDB

```bash
GET    /api/dashboard/stats       # Estadísticas generales
GET    /api/dashboard/cases       # Métricas de casos
GET    /api/dashboard/financial   # Reportes financieros
GET    /api/dashboard/productivity # Productividad del equipo
GET    /api/dashboard/clients     # Análisis de clientes
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- npm o yarn

### Opción 1: Con Docker Compose (Recomendado)

1. **Clona o navega al proyecto**
```bash
cd legaltech
```

2. **Crear archivos .env en cada servicio**
```bash
# Para cada servicio, crear .env basado en .env.example
cp servicio-autenticacion/.env.example servicio-autenticacion/.env
cp servicio-casos/.env.example servicio-casos/.env
cp servicio-clientes/.env.example servicio-clientes/.env
cp servicio-documentos/.env.example servicio-documentos/.env
cp servicio-seguimiento-tiempo/.env.example servicio-seguimiento-tiempo/.env
cp servicio-facturacion/.env.example servicio-facturacion/.env
cp servicio-notificaciones/.env.example servicio-notificaciones/.env
cp servicio-panel-control/.env.example servicio-panel-control/.env
```

3. **Iniciar todos los servicios**
```bash
docker-compose up -d
```

4. **Verificar que todos los servicios estén corriendo**
```bash
docker-compose ps
```

5. **Ver logs de un servicio específico**
```bash
docker-compose logs -f servicio-autenticacion
docker-compose logs -f servicio-casos
docker-compose logs -f servicio-clientes
docker-compose logs -f servicio-documentos
```

6. **Detener todos los servicios**
```bash
docker-compose down
```

---

### Opción 2: Desarrollo Local

1. **Instalar MongoDB Community**
   - Descargar de: https://www.mongodb.com/try/download/community
   - Iniciar servicio MongoDB

2. **Para cada servicio:**

```bash
# Autenticación
cd servicio-autenticacion
npm install
npm run dev

# En otra terminal - Casos
cd servicio-casos
npm install
npm run dev

# En otra terminal - Clientes
cd servicio-clientes
npm install
npm run dev

# En otra terminal - Documentos
cd servicio-documentos
npm install
npm run dev

# En otra terminal - Seguimiento de Tiempo
cd servicio-seguimiento-tiempo
npm install
npm run dev

# En otra terminal - Facturación
cd servicio-facturacion
npm install
npm run dev

# En otra terminal - Notificaciones
cd servicio-notificaciones
npm install
npm run dev

# En otra terminal - Panel de Control
cd servicio-panel-control
npm install
npm run dev
```

3. **Configurar variables de entorno**
   - Copiar `.env.example` a `.env` en cada servicio
   - Ajustar las URLs de los servicios según los puertos locales

---

## 🧪 Testing y Verificación

### Health Checks
Cada servicio tiene un endpoint de health check:

```bash
# Verificar cada servicio
curl http://localhost:3001/health  # Autenticación
curl http://localhost:3002/health  # Casos
curl http://localhost:3003/health  # Clientes
curl http://localhost:3004/health  # Documentos
curl http://localhost:3005/health  # Seguimiento de Tiempo
curl http://localhost:3006/health  # Facturación
curl http://localhost:3007/health  # Notificaciones
curl http://localhost:3008/health  # Panel de Control
```

### Scripts de Verificación
```bash
# Ejecutar script de verificación para cada servicio
node servicio-autenticacion/test-setup.js
node servicio-casos/test-setup.js
# ... y así sucesivamente
```

---

## 📚 API Documentation

### Postman Collection
Importar `postman_collection.json` para ejemplos completos de todas las APIs.

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil de usuario
- `GET /api/auth/users` - Lista de usuarios (Admin)

#### Casos
- `GET /api/cases` - Lista de casos con filtros
- `POST /api/cases` - Crear caso
- `PUT /api/cases/:id` - Actualizar caso
- `GET /api/cases/stats` - Estadísticas

#### Clientes
- `GET /api/clients` - Lista de clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `GET /api/clients/:id/cases` - Casos del cliente

#### Documentos
- `POST /api/documents` - Subir documento
- `GET /api/documents/:id/download` - Descargar documento
- `GET /api/documents/case/:caseId` - Documentos de un caso

---

## 🏗️ Arquitectura

### Comunicación entre Servicios
- **REST APIs** para comunicación síncrona
- **JWT Tokens** para autenticación entre servicios
- **MongoDB** como base de datos por servicio
- **Docker Network** para aislamiento y comunicación

### Base de Datos
Cada servicio tiene su propia base de datos MongoDB:
- `auth-db` - Servicio de Autenticación
- `cases-db` - Servicio de Casos
- `clients-db` - Servicio de Clientes
- `documents-db` - Servicio de Documentos
- `time-tracking-db` - Servicio de Seguimiento de Tiempo
- `billing-db` - Servicio de Facturación
- `notifications-db` - Servicio de Notificaciones
- `dashboard-db` - Servicio de Panel de Control

### Seguridad
- **JWT Authentication** con expiración
- **Role-based Access Control** (RBAC)
- **Rate Limiting** por IP
- **Input Validation** con express-validator
- **CORS** configurado
- **Helmet** para headers de seguridad

---

## 🔧 Desarrollo

### Estructura de Proyecto
```
legaltech/
├── servicio-autenticacion/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── README.md
├── servicio-casos/
│   └── [estructura similar]
├── servicio-clientes/
│   └── [estructura similar]
├── servicio-documentos/
│   └── [estructura similar]
├── servicio-seguimiento-tiempo/
│   └── [estructura similar]
├── servicio-facturacion/
│   └── [estructura similar]
├── servicio-notificaciones/
│   └── [estructura similar]
├── servicio-panel-control/
│   └── [estructura similar]
├── docker-compose.yml
├── README.md
└── [archivos de documentación]
```

### Comandos Útiles
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart servicio-autenticacion

# Ver estado de contenedores
docker-compose ps

# Ejecutar comandos en un contenedor
docker-compose exec servicio-autenticacion sh

# Limpiar todo (contenedores, volúmenes, imágenes)
docker-compose down -v --rmi all
```

---

## 📊 Monitoreo y Logs

### Logs por Servicio
```bash
# Logs en tiempo real
docker-compose logs -f servicio-autenticacion
docker-compose logs -f servicio-casos

# Logs con timestamps
docker-compose logs --timestamps servicio-clientes

# Últimas N líneas
docker-compose logs --tail=100 servicio-documentos
```

### Health Monitoring
- Cada servicio expone `/health` endpoint
- Docker health checks automáticos
- Monitoreo de uptime y respuesta

---

## 🚀 Despliegue

### Producción
1. Configurar variables de entorno de producción
2. Usar `docker-compose.prod.yml` si existe
3. Configurar reverse proxy (nginx)
4. Configurar SSL/TLS
5. Configurar backups automáticos

### Escalabilidad
- Cada servicio puede escalarse independientemente
- Load balancing con nginx o traefik
- Bases de datos separadas permiten escalado horizontal

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Crear Pull Request

### Estándares de Código
- ESLint para linting
- Prettier para formato
- Tests unitarios con Jest
- Documentación con JSDoc

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 📞 Soporte

Para soporte técnico contactar al equipo de desarrollo de LegalTech.

---

*Última actualización: Abril 2026*
```bash
docker-compose up -d
```

4. **Verificar que todos los servicios estén corriendo**
```bash
docker-compose ps
```

5. **Ver logs de un servicio específico**
```bash
docker-compose logs -f users-service
docker-compose logs -f cases-service
docker-compose logs -f clients-service
docker-compose logs -f documents-service
```

6. **Detener todos los servicios**
```bash
docker-compose down
```

---

### Opción 2: Desarrollo Local

1. **Instalar MongoDB Community**
   - Descargar de: https://www.mongodb.com/try/download/community
   - Iniciar servicio MongoDB

2. **Para cada servicio:**

```bash
# Usuarios
cd users-service
npm install
npm run dev

# En otra terminal - Casos
cd cases-service
npm install
npm run dev

# En otra terminal - Clientes
cd clients-service
npm install
npm run dev

# En otra terminal - Documentos
cd documents-service
npm install
npm run dev
```

---

## 📚 Ejemplos de Uso

### 1. Registro e Inicio de Sesión

**Registrarse:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "role": "lawyer"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123456",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "lawyer"
  }
}
```

**Iniciar Sesión:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

---

### 2. Crear un Cliente

```bash
curl -X POST http://localhost:3003/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Carlos",
    "lastName": "García",
    "documentType": "CC",
    "documentNumber": "1234567890",
    "email": "carlos@example.com",
    "phone": "3001234567",
    "address": {
      "street": "Calle 10 #5-50",
      "city": "Bogotá",
      "state": "Cundinamarca",
      "country": "Colombia"
    },
    "clientType": "individual"
  }'
```

---

### 3. Crear un Caso Legal

```bash
curl -X POST http://localhost:3002/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "caseNumber": "CASE-2024-001",
    "title": "Demanda Civil",
    "description": "Demanda por incumplimiento de contrato",
    "clientId": "CLIENT_ID_HERE",
    "caseType": "civil",
    "priority": "high",
    "assignedTo": "LAWYER_ID_HERE",
    "startDate": "2024-01-15",
    "budget": 5000000,
    "notes": "Caso importante"
  }'
```

---

### 4. Subir un Documento

```bash
curl -X POST http://localhost:3004/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@path/to/document.pdf" \
  -F "caseId=CASE_ID_HERE" \
  -F "description=Contrato de servicios" \
  -F "documentType=contrato"
```

---

## 🗄️ Estructura de la Base de Datos

### MongoDB - Colecciones

#### Users
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "password": String (hashed),
  "role": "user|admin|lawyer",
  "permissions": [String],
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Cases
```json
{
  "_id": ObjectId,
  "caseNumber": String,
  "title": String,
  "description": String,
  "clientId": String,
  "status": "draft|open|in_progress|closed|suspended",
  "caseType": String,
  "priority": String,
  "assignedTo": String,
  "startDate": Date,
  "endDate": Date,
  "budget": Number,
  "notes": String,
  "documents": [String],
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Clients
```json
{
  "_id": ObjectId,
  "firstName": String,
  "lastName": String,
  "documentType": String,
  "documentNumber": String,
  "email": String,
  "phone": String,
  "address": Object,
  "clientType": "individual|company",
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Documents
```json
{
  "_id": ObjectId,
  "fileName": String,
  "originalFileName": String,
  "fileSize": Number,
  "fileType": String,
  "filePath": String,
  "caseId": String,
  "description": String,
  "documentType": String,
  "uploadedBy": String,
  "tags": [String],
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 🔐 Variables de Entorno

Cada servicio tiene un archivo `.env.example`. Copia y renombra a `.env`:

```env
# Users Service
PORT=3001
MONGODB_URI=mongodb://localhost:27017/users-db
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development

# Cases Service
PORT=3002
MONGODB_URI=mongodb://localhost:27017/cases-db
USERS_SERVICE_URL=http://localhost:3001

# Clients Service
PORT=3003
MONGODB_URI=mongodb://localhost:27017/clients-db

# Documents Service
PORT=3004
MONGODB_URI=mongodb://localhost:27017/documents-db
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800
```

---

## 🧪 Testing

Para probar los endpoints, puedes usar:

- **Postman**: Importar colecciones
- **cURL**: Comandos en terminal
- **REST Client** (VS Code): Extensión
- **Thunder Client**: Extensión VS Code

---

## 📦 Tecnologías Utilizadas

- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **ORM**: Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Bcryptjs
- **Upload de Archivos**: Multer
- **Virtualización**: Docker & Docker Compose
- **Control de Desarrollo**: Nodemon

---

## 🔧 Comandos Útiles

```bash
# Docker Compose
docker-compose up -d                 # Iniciar en background
docker-compose down                  # Detener y eliminar contenedores
docker-compose logs -f               # Ver logs en tiempo real
docker-compose ps                    # Ver estado de servicios
docker-compose build                 # Reconstruir imágenes

# MongoDB
docker-compose exec mongodb mongosh  # Acceder a MongoDB shell

# Servicios Locales
npm run dev                          # Iniciar en modo desarrollo
npm start                            # Iniciar en producción
npm test                             # Ejecutar tests
```

---

## 📝 Notas Importantes

1. **JWT_SECRET**: Cambiar en producción a una clave fuerte
2. **CORS**: Configurado para permitir todas las fuentes en desarrollo
3. **Validación**: Se usan express-validator para validar datos
4. **Errores**: Manejo centralizado de errores en middleware
5. **Documentos**: MongoDB soporta almacenamiento de referencias a archivos

---

## 🙋 Soporte

Para preguntas o problemas:
- Revisar logs: `docker-compose logs service-name`
- Verificar conexión a MongoDB
- Asegurar puertos disponibles (3001-3004, 27017)

---

## 📄 Licencia

MIT

---

**Hecho con ❤️ para LegalTech**
