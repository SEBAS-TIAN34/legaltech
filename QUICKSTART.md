# 🚀 Quick Start - LegalTech Microservicios

## ⚡ Inicio Rápido (5 minutos)

### Requisitos Mínimos
- Docker y Docker Compose instalados
- Terminal/PowerShell
- 2GB RAM disponible

### Paso 1: Preparar Archivos de Configuración (Windows)
```bash
cd c:\Users\SEBASTIAN\OneDrive\Documentos\8 SEMESTRE ING DE SISTEMAS\legaltech
setup.bat
```

### Paso 1: Preparar Archivos de Configuración (Linux/Mac)
```bash
cd ~/documentos/legaltech
chmod +x setup.sh
./setup.sh
```

### Paso 2: Iniciar los Servicios
```bash
docker-compose up -d
```

### Paso 3: Verificar que Todo Funcione
```bash
docker-compose ps
```

Deberías ver 5 contenedores:
- ✅ mongodb (27017)
- ✅ users-service (3001)
- ✅ cases-service (3002)
- ✅ clients-service (3003)
- ✅ documents-service (3004)

---

## 🧪 Tu Primer Endpoint

### Opción 1: Con cURL (Terminal)
```bash
# Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Pass123!","role":"lawyer"}'
```

### Opción 2: Con Postman
1. Abre Postman
2. `File → Import → postman_collection.json`
3. Haz clic en "Registrarse"
4. Presiona "Send"

### Opción 3: Con Thunder Client (VS Code)
1. Abre VS Code
2. Instala extensión "Thunder Client"
3. `New > Request`
4. `POST http://localhost:3001/api/auth/register`
5. Agrega el JSON del body

---

## 📂 Estructura de Carpetas

```
legaltech/
├── users-service/          # 👤 Usuarios & Auth (Puerto 3001)
│   ├── src/
│   │   ├── models/        # Esquemas MongoDB
│   │   ├── routes/        # Rutas
│   │   ├── controllers/   # Lógica
│   │   ├── middleware/    # JWT, etc
│   │   └── config/        # Conexiones
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── cases-service/          # ⚖️ Casos Legales (Puerto 3002)
│   └── (estructura similar)
│
├── clients-service/        # 👥 Clientes (Puerto 3003)
│   └── (estructura similar)
│
├── documents-service/      # 📄 Documentos (Puerto 3004)
│   └── (estructura similar)
│
├── docker-compose.yml      # Orquestación de servicios
├── README.md               # Documentación completa
├── API_EXAMPLES.md         # Ejemplos de uso
├── DEPLOYMENT.md           # Guía de production
├── postman_collection.json # Colección Postman
├── setup.sh                # Setup para Linux/Mac
└── setup.bat               # Setup para Windows
```

---

## 🔌 Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Usuarios | 3001 | http://localhost:3001/api/auth |
| Casos | 3002 | http://localhost:3002/api/cases |
| Clientes | 3003 | http://localhost:3003/api/clients |
| Documentos | 3004 | http://localhost:3004/api/documents |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## 📡 Ver Logs

```bash
# Todos los logs
docker-compose logs -f

# Solo un servicio
docker-compose logs -f users-service

# Últimas 100 líneas
docker-compose logs --tail 100 users-service
```

---

## 🛑 Detener Servicios

```bash
# Parar sin eliminar
docker-compose stop

# Parar y eliminar todo
docker-compose down

# Eliminar datos (MongoDB)
docker-compose down -v
```

---

## 📚 Documentación

- **README.md** → Guía completa
- **API_EXAMPLES.md** → Ejemplos cURL de todos endpoints
- **DEPLOYMENT.md** → Cómo hacer deploy a producción
- **postman_collection.json** → Colección para Postman

---

## 🐛 Troubleshooting

### Error: "Port already in use"
```bash
# Encontrar proceso
lsof -i :3001
kill -9 PID

# O cambiar puerto en docker-compose.yml
```

### Error: "Cannot connect to Docker"
```bash
# Verificar que Docker esté corriendo
docker ps

# En Windows, verificar Docker Desktop
# En Linux: systemctl start docker
```

### MongoDB no se conecta
```bash
# Ver logs de MongoDB
docker-compose logs mongodb

# Resetear MongoDB
docker volume rm legaltech_mongodb_data
docker-compose up -d
```

### Permission denied en setup.sh
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🎯 Flujo Típico de Testing

1. **Crear usuario** → POST /api/auth/register (obtener token)
2. **Crear cliente** → POST /api/clients (obtener client_id)
3. **Crear caso** → POST /api/cases (obtener case_id)
4. **Subir documento** → POST /api/documents (adjuntar a caso)
5. **Actualizar caso** → PUT /api/cases/:id
6. **Descargar documento** → GET /api/documents/:id/download

---

## 💡 Tips

✅ Guarda los IDs en variables para reusarlos  
✅ Usa el mismo email para evitar duplicados en usuarios  
✅ Cambia JWT_SECRET en .env antes de producción  
✅ Los tokens expiran en 7 días  
✅ Las búsquedas son case-sensitive  
✅ Máximo 50MB por documento  

---

## 📞 Próximos Pasos

1. Leer README.md completo
2. Explorar ejemplos en API_EXAMPLES.md
3. Implementar frontend
4. Deployar a producción (ver DEPLOYMENT.md)

---

**¡Listo! Ya tienes los 4 microservicios corriendo. 🎉**

Para más ayuda, consulta la documentación en README.md
