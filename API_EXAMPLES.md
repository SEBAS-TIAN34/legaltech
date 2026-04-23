# LegalTech API - Ejemplos de Uso

Este archivo contiene ejemplos de cURL para probar todos los endpoints.

## 1️⃣ USUARIOS Y AUTENTICACIÓN (Puerto 3001)

### Registrar usuario
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez López",
    "email": "juan@example.com",
    "password": "SecurePass123!",
    "role": "lawyer"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Juan Pérez López",
    "email": "juan@example.com",
    "role": "lawyer"
  }
}
```

---

### Iniciar sesión
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Listar todos los usuarios (requiere rol admin)
```bash
curl -X GET http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Obtener usuario por ID
```bash
curl -X GET http://localhost:3001/api/auth/users/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Actualizar usuario
```bash
curl -X PUT http://localhost:3001/api/auth/users/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Juan Pérez García",
    "email": "juannuevo@example.com"
  }'
```

---

### Eliminar usuario (requiere rol admin)
```bash
curl -X DELETE http://localhost:3001/api/auth/users/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 2️⃣ CASOS LEGALES (Puerto 3002)

### Crear caso
```bash
curl -X POST http://localhost:3002/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "caseNumber": "CASE-2024-001",
    "title": "Demanda por Incumplimiento de Contrato",
    "description": "Cliente demanda a empresa por no cumplir obligaciones contractuales",
    "clientId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "caseType": "civil",
    "priority": "high",
    "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k2",
    "startDate": "2024-01-15",
    "budget": 5000000,
    "notes": "Caso prioritario, cliente VIP"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Case created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "caseNumber": "CASE-2024-001",
    "title": "Demanda por Incumplimiento de Contrato",
    "status": "draft",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Listar casos (con filtros opcionales)
```bash
# Todos los casos
curl -X GET http://localhost:3002/api/cases

# Casos por estado
curl -X GET "http://localhost:3002/api/cases?status=open"

# Casos por cliente
curl -X GET "http://localhost:3002/api/cases?clientId=65a1b2c3d4e5f6g7h8i9j0k1"

# Casos asignados a un abogado
curl -X GET "http://localhost:3002/api/cases?assignedTo=65a1b2c3d4e5f6g7h8i9j0k2"
```

---

### Obtener caso por ID
```bash
curl -X GET http://localhost:3002/api/cases/65a1b2c3d4e5f6g7h8i9j0k3
```

---

### Actualizar caso
```bash
curl -X PUT http://localhost:3002/api/cases/65a1b2c3d4e5f6g7h8i9j0k3 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "critical",
    "notes": "Presentada demanda ante juzgado",
    "endDate": "2024-06-15"
  }'
```

---

### Eliminar caso
```bash
curl -X DELETE http://localhost:3002/api/cases/65a1b2c3d4e5f6g7h8i9j0k3
```

---

## 3️⃣ CLIENTES (Puerto 3003)

### Crear cliente
```bash
curl -X POST http://localhost:3003/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Carlos",
    "lastName": "García Rodríguez",
    "documentType": "CC",
    "documentNumber": "1234567890",
    "email": "carlos.garcia@example.com",
    "phone": "3001234567",
    "address": {
      "street": "Calle 10 #5-50",
      "city": "Bogotá",
      "state": "Cundinamarca",
      "zipCode": "110111",
      "country": "Colombia"
    },
    "clientType": "individual",
    "occupation": "Empresario"
  }'
```

---

### Crear cliente jurídico (empresa)
```bash
curl -X POST http://localhost:3003/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "TechSolutions",
    "lastName": "S.A.S",
    "documentType": "NIT",
    "documentNumber": "900123456-1",
    "email": "contacto@techsolutions.com",
    "phone": "3105678901",
    "address": {
      "street": "Cra 15 #100-50",
      "city": "Medellín",
      "state": "Antioquia",
      "country": "Colombia"
    },
    "clientType": "company",
    "companyName": "TechSolutions S.A.S",
    "taxId": "900123456-1"
  }'
```

---

### Listar clientes
```bash
# Todos los clientes
curl -X GET http://localhost:3003/api/clients

# Solo personas
curl -X GET "http://localhost:3003/api/clients?clientType=individual"

# Solo empresas
curl -X GET "http://localhost:3003/api/clients?clientType=company"

# Solo clientes activos
curl -X GET "http://localhost:3003/api/clients?isActive=true"
```

---

### Obtener cliente por ID
```bash
curl -X GET http://localhost:3003/api/clients/65a1b2c3d4e5f6g7h8i9j0k1
```

---

### Actualizar cliente
```bash
curl -X PUT http://localhost:3003/api/clients/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Carlos",
    "lastName": "García Pérez",
    "email": "carlosgarcia@newemail.com",
    "phone": "3109876543",
    "address": {
      "street": "Cra 20 #10-50",
      "city": "Bogotá"
    }
  }'
```

---

### Eliminar cliente (soft delete)
```bash
curl -X DELETE http://localhost:3003/api/clients/65a1b2c3d4e5f6g7h8i9j0k1
```

---

## 4️⃣ DOCUMENTOS (Puerto 3004)

### Subir documento
```bash
curl -X POST http://localhost:3004/api/documents \
  -F "file=@/path/to/document.pdf" \
  -F "caseId=65a1b2c3d4e5f6g7h8i9j0k3" \
  -F "description=Contrato de servicios legales" \
  -F "documentType=contrato"
```

**Formatos permitidos:**
- PDF
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- Imágenes (JPG, PNG)
- Texto (.txt)

**Tamaño máximo:** 50 MB

---

### Listar documentos
```bash
# Todos los documentos
curl -X GET http://localhost:3004/api/documents

# Documentos de un caso específico
curl -X GET "http://localhost:3004/api/documents?caseId=65a1b2c3d4e5f6g7h8i9j0k3"

# Documentos por tipo
curl -X GET "http://localhost:3004/api/documents?documentType=contrato"
```

---

### Obtener documento por ID
```bash
curl -X GET http://localhost:3004/api/documents/65a1b2c3d4e5f6g7h8i9j0k5
```

---

### Descargar documento
```bash
curl -X GET http://localhost:3004/api/documents/65a1b2c3d4e5f6g7h8i9j0k5/download \
  -o documento_descargado.pdf
```

---

### Eliminar documento
```bash
curl -X DELETE http://localhost:3004/api/documents/65a1b2c3d4e5f6g7h8i9j0k5
```

---

## 🔐 Autenticación

Los endpoints que requieren autenticación esperan un token JWT en el header:

```bash
-H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

El token se obtiene al hacer login o registro y es válido por 7 días.

---

## 📊 Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token no válido |
| 403 | Forbidden - Permisos insuficientes |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error del servidor |

---

## 💡 Casos de Uso Ejemplo

### Flujo 1: Registrar cliente y crear caso

```bash
# 1. Registrarse como abogado
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María López",
    "email": "maria@example.com",
    "password": "SecurePass123!",
    "role": "lawyer"
  }' | jq -r '.token')

# 2. Crear cliente
CLIENT_ID=$(curl -s -X POST http://localhost:3003/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Roberto",
    "lastName": "Martínez",
    "documentType": "CC",
    "documentNumber": "9876543210",
    "email": "roberto@example.com",
    "phone": "3001111111",
    "address": {
      "city": "Bogotá"
    }
  }' | jq -r '.data._id')

# 3. Crear caso
CASE_ID=$(curl -s -X POST http://localhost:3002/api/cases \
  -H "Content-Type: application/json" \
  -d "{
    \"caseNumber\": \"CASE-2024-002\",
    \"title\": \"Nuevo Caso\",
    \"description\": \"Descripción del caso\",
    \"clientId\": \"$CLIENT_ID\",
    \"caseType\": \"civil\",
    \"priority\": \"medium\",
    \"assignedTo\": \"$USER_ID\",
    \"startDate\": \"2024-01-15\"
  }" | jq -r '.data._id')

# 4. Subir documento al caso
curl -X POST http://localhost:3004/api/documents \
  -F "file=@contrato.pdf" \
  -F "caseId=$CASE_ID" \
  -F "description=Contrato del cliente" \
  -F "documentType=contrato"
```

---

## 🧪 Testing con Postman

1. Descargar Postman desde https://www.postman.com/downloads/
2. Crear nueva colección "LegalTech API"
3. Agregar las solicitudes anteriores
4. Usar variables de entorno para los tokens y IDs
5. Ejecutar colecciones en orden

**Variables de entorno sugeridas:**
- `base_url`: http://localhost
- `jwt_token`: (guardar token después de login)
- `case_id`: (guardar ID de caso)
- `client_id`: (guardar ID de cliente)

---

## 📝 Notas Importantes

- Los IDs en MongoDB son ObjectId de 24 caracteres
- Los tokens JWT expiran en 7 días
- Las búsquedas son case-sensitive por defecto
- Los documentos se almacenan en la carpeta `uploads/`
- Se realizan validaciones de formato en todos los inputs

---

**Última actualización: 2024**
