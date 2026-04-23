# Auth Service

Servicio de autenticación y gestión de usuarios para la plataforma LegalTech. Proporciona funcionalidades de registro, login, gestión de perfiles y control de acceso basado en roles.

## Características

- 🔐 **Autenticación JWT**: Tokens seguros con expiración configurable
- 👥 **Sistema de Roles**: Admin, Lawyer, Paralegal, Assistant
- 📝 **Registro de Usuarios**: Validación completa de datos
- 🔑 **Gestión de Perfiles**: Actualización de información personal
- 🔒 **Seguridad**: Rate limiting, CORS, Helmet, encriptación de contraseñas
- 🏥 **Health Checks**: Monitoreo del estado del servicio
- 🐳 **Docker**: Contenedorización completa

## Tecnologías

- **Node.js** con **Express.js**
- **MongoDB** con **Mongoose**
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **express-validator** para validación
- **Docker** para contenedorización

## Instalación

### Prerrequisitos

- Node.js 18+
- MongoDB
- Docker (opcional)

### Instalación Local

1. Clona el repositorio:
```bash
git clone <repository-url>
cd auth-service
```

2. Instala dependencias:
```bash
npm install
```

3. Configura variables de entorno:
```bash
cp .env.example .env
# Edita .env con tus configuraciones
```

4. Inicia MongoDB localmente o usa Docker:
```bash
# Con Docker
docker run -d -p 27017:27017 --name mongodb mongo:7-jammy
```

5. Inicia el servicio:
```bash
npm run dev  # Para desarrollo
npm start    # Para producción
```

### Instalación con Docker

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f auth-service

# Detener servicios
docker-compose down
```

## Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3001` |
| `MONGODB_URI` | URI de conexión MongoDB | `mongodb://localhost:27017/auth-service` |
| `JWT_SECRET` | Clave secreta para JWT | (requerido) |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:3000` |

## API Endpoints

### Autenticación Pública

#### POST /api/auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "lawyer",
  "phone": "+1234567890",
  "specialization": "Corporate Law",
  "barNumber": "12345",
  "office": "Main Office"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "lawyer",
      "profile": {
        "phone": "+1234567890",
        "specialization": "Corporate Law",
        "barNumber": "12345",
        "office": "Main Office"
      },
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/login
Inicia sesión de usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Autenticación Requerida

#### GET /api/auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

#### PUT /api/auth/profile
Actualiza el perfil del usuario.

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phone": "+1234567890",
  "specialization": "Criminal Law",
  "barNumber": "12345",
  "office": "Branch Office"
}
```

#### PUT /api/auth/change-password
Cambia la contraseña del usuario.

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Endpoints de Administrador

#### GET /api/auth/users
Obtiene lista de usuarios (solo admin).

**Query Parameters:**
- `page`: Página (default: 1)
- `limit`: Límite por página (default: 10)
- `role`: Filtrar por rol
- `isActive`: Filtrar por estado activo

#### PUT /api/auth/users/:id/deactivate
Desactiva un usuario (solo admin).

### Health Check

#### GET /health
Verifica el estado del servicio.

**Response:**
```json
{
  "success": true,
  "message": "Auth Service is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Roles de Usuario

- **admin**: Acceso completo a todas las funcionalidades
- **lawyer**: Acceso a funcionalidades de abogado
- **paralegal**: Acceso limitado a funciones de apoyo
- **assistant**: Acceso básico de asistente

## Seguridad

- **Rate Limiting**: 100 requests por IP cada 15 minutos
- **CORS**: Configurado para orígenes específicos
- **Helmet**: Headers de seguridad HTTP
- **bcrypt**: Hash de contraseñas con salt
- **JWT**: Tokens con expiración
- **Validación**: Sanitización y validación de inputs

## Desarrollo

### Scripts Disponibles

```bash
npm start      # Inicia servidor en producción
npm run dev    # Inicia servidor en desarrollo con nodemon
npm test       # Ejecuta tests
```

### Estructura del Proyecto

```
auth-service/
├── src/
│   ├── config/
│   │   └── database.js          # Conexión MongoDB
│   ├── controllers/
│   │   └── authController.js    # Lógica de autenticación
│   ├── middleware/
│   │   └── auth.js              # Middleware JWT
│   ├── models/
│   │   └── User.js              # Modelo de usuario
│   ├── routes/
│   │   └── authRoutes.js        # Rutas de autenticación
│   └── server.js                # Punto de entrada
├── Dockerfile                   # Configuración Docker
├── docker-compose.yml          # Orquestación Docker
├── package.json                # Dependencias
├── .env.example               # Variables de entorno
└── README.md                  # Esta documentación
```

## Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## Despliegue

### Producción

1. Configura variables de entorno de producción
2. Construye la imagen Docker:
```bash
docker build -t auth-service .
```

3. Ejecuta con docker-compose.prod.yml (configurar para producción)

### Monitoreo

- Health checks automáticos cada 30 segundos
- Logs estructurados
- Métricas de uptime

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte técnico, contacta al equipo de desarrollo de LegalTech.