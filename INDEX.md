# 📖 Índice de Documentación - LegalTech Microservicios

Bienvenido a LegalTech. Esta es tu guía de navegación por la documentación.

## 🚀 COMIENZA AQUÍ

### 1️⃣ **Quiero empezar YA** (5 minutos)
→ Lee: [QUICKSTART.md](QUICKSTART.md)

Este archivo te mostrará:
- Cómo configurar rápidamente
- Cómo iniciar los servicios
- Tu primer endpoint

### 2️⃣ **Quiero entender la arquitectura**
→ Lee: [ARCHITECTURE.md](ARCHITECTURE.md)

Este archivo contiene:
- Diagramas de servicios
- Flujo de datos
- Estructura de base de datos
- Modelos de escalabilidad

### 3️⃣ **Quiero explorar los endpoints**
→ Lee: [API_EXAMPLES.md](API_EXAMPLES.md)

Este archivo tiene:
- Ejemplos cURL de cada endpoint
- Ejemplos de respuestas
- Casos de uso completos
- Códigos de error

---

## 📚 DOCUMENTACIÓN COMPLETA

| Archivo | Descripción | Tiempo |
|---------|-------------|--------|
| **[QUICKSTART.md](QUICKSTART.md)** | Inicio rápido con pasos | 5 min |
| **[README.md](README.md)** | Documentación técnica completa | 20 min |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Diagramas y estructura técnica | 15 min |
| **[API_EXAMPLES.md](API_EXAMPLES.md)** | Ejemplos de uso (cURL, Postman) | 10 min |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Cómo llevar a producción | 20 min |
| **[INTEGRATION.md](INTEGRATION.md)** | Service-to-service communication | 15 min |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Resumen completo del proyecto | 10 min |

---

## 🎯 POR CASO DE USO

### Soy Desarrollador Backend
1. Lee: [ARCHITECTURE.md](ARCHITECTURE.md) - Entiende la estructura
2. Lee: [README.md](README.md) - Documentación técnica
3. Explora: [API_EXAMPLES.md](API_EXAMPLES.md) - APIs disponibles
4. Modifica: Los archivos en `*/src/` según necesites

### Soy QA / Tester
1. Lee: [QUICKSTART.md](QUICKSTART.md) - Levanta los servicios
2. Abre: `postman_collection.json` en Postman
3. Consulta: [API_EXAMPLES.md](API_EXAMPLES.md) - Casos de prueba
4. Valida: Todos los endpoints funcionan

### Soy DevOps / SRE
1. Lee: [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de producción
2. Revisa: `docker-compose.yml` - Configuración actual
3. Configura: Monitoreo, logs, backups
4. Escala: Los servicios según necesites

### Soy Project Manager
1. Lee: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Vista general
2. Consulta: [ARCHITECTURE.md](ARCHITECTURE.md) - Timeline técnico
3. Revisa: endpoints disponibles

### Soy Frontend Developer
1. Lee: [API_EXAMPLES.md](API_EXAMPLES.md) - Endpoints disponibles
2. Abre: `postman_collection.json` - Prueba los endpoints
3. Integra: Con tu cliente REST (fetch, axios, etc)

---

## 📂 ESTRUCTURA DEL PROYECTO

```
legaltech/
├── users-service/          👤 Usuarios & Autenticación (3001)
├── cases-service/          ⚖️ Casos Legales (3002)
├── clients-service/        👥 Clientes (3003)
├── documents-service/      📄 Documentos (3004)
├── docker-compose.yml      🐳 Orquestación de servicios
├── package.json            🔧 Scripts principales
│
├── 📚 DOCUMENTACIÓN
│   ├── README.md                    [LEE PRIMERO]
│   ├── QUICKSTART.md                [INICIO RÁPIDO - 5 MIN]
│   ├── API_EXAMPLES.md              [EJEMPLOS DE ENDPOINTS]
│   ├── ARCHITECTURE.md              [DIAGRAMAS]
│   ├── DEPLOYMENT.md                [A PRODUCCIÓN]
│   ├── INTEGRATION.md               [SERVICE-TO-SERVICE]
│   └── PROJECT_SUMMARY.md           [RESUMEN GENERAL]
│
├── 🔧 CONFIGURACIÓN
│   ├── setup.sh / setup.bat
│   ├── verify.sh / verify.bat
│   └── postman_collection.json
│
└── .gitignore
```

---

## 🎓 FLUJO DE APRENDIZAJE RECOMENDADO

### Nivel 1: Básico (15 minutos)
1. ✅ Lee QUICKSTART.md
2. ✅ Ejecuta `docker-compose up -d`
3. ✅ Prueba un endpoint con cURL

### Nivel 2: Intermedio (1 hora)
1. ✅ Lee ARCHITECTURE.md
2. ✅ Lee API_EXAMPLES.md
3. ✅ Prueba endpoints con Postman
4. ✅ Lee README.md

### Nivel 3: Avanzado (2-3 horas)
1. ✅ Lee DEPLOYMENT.md
2. ✅ Lee INTEGRATION.md
3. ✅ Personaliza los servicios
4. ✅ Agrega nuevas funcionalidades

### Nivel 4: Producción (4-5 horas)
1. ✅ Configura CI/CD
2. ✅ Implementa monitoreo
3. ✅ Configura backups
4. ✅ Deploy a servidor

---

## 🔗 RUTAS RÁPIDAS

### "Quiero levantar esto ahora"
```bash
setup.bat          # Windows
./setup.sh         # Linux/Mac
docker-compose up -d
docker-compose ps
```
→ Luego lee QUICKSTART.md

### "Quiero probar un endpoint"
→ Ve a [API_EXAMPLES.md](API_EXAMPLES.md) y copia el ejemplo cURL

### "Tengo un error"
→ Consulta troubleshooting en [README.md](README.md) → Troubleshooting

### "Quiero deployar a producción"
→ Lee completo [DEPLOYMENT.md](DEPLOYMENT.md)

### "Quiero agregar funcionalidades"
→ Lee [ARCHITECTURE.md](ARCHITECTURE.md) para entender estructura

---

## 📊 CARACTERÍSTICAS POR SERVICIO

### Usuarios (3001)
📖 Documentación: README.md → Sección Usuarios  
📝 Ejemplos: API_EXAMPLES.md → Sección 1️⃣  
- Registro, Login, Gestión de roles, JWT

### Casos (3002)
📖 Documentación: README.md → Sección Casos  
📝 Ejemplos: API_EXAMPLES.md → Sección 2️⃣  
- CRUD completo, Estados, Asignaciones, Filtros

### Clientes (3003)
📖 Documentación: README.md → Sección Clientes  
📝 Ejemplos: API_EXAMPLES.md → Sección 3️⃣  
- Personas, Empresas, Documentos

### Documentos (3004)
📖 Documentación: README.md → Sección Documentos  
📝 Ejemplos: API_EXAMPLES.md → Sección 4️⃣  
- Upload, Descarga, Gestión

---

## 🆘 NECESITO AYUDA

### Error al iniciar
→ Ve a [README.md](README.md) → Troubleshooting

### No entiendo un endpoint
→ Busca en [API_EXAMPLES.md](API_EXAMPLES.md)

### Quiero mejorar el código
→ Lee [ARCHITECTURE.md](ARCHITECTURE.md)

### Problemas de deployment
→ Consulta [DEPLOYMENT.md](DEPLOYMENT.md)

### No entiendo la estructura
→ Ve a [ARCHITECTURE.md](ARCHITECTURE.md) → Diagramas

---

## 📞 INFORMACIÓN RÁPIDA

**Puertos:**
- Usuarios: 3001
- Casos: 3002  
- Clientes: 3003
- Documentos: 3004
- MongoDB: 27017

**Base de datos:**
- Usuario: admin
- Contraseña: admin123

**JWT Expira:**
- 7 días

**Tamaño máximo de archivo:**
- 50 MB

---

## ✅ CHECKLIST PARA EMPEZAR

- [ ] Leer QUICKSTART.md
- [ ] Ejecutar setup.bat/setup.sh
- [ ] Ejecutar docker-compose up -d
- [ ] Verificar con docker-compose ps
- [ ] Importar postman_collection.json
- [ ] Probar primer endpoint
- [ ] Leer README.md completo
- [ ] Revisar ARCHITECTURE.md

---

## 📝 NOTAS

- Documentación está en Markdown
- Ejemplos están en cURL y JSON
- Colección Postman incluida
- Docker todo configurado
- Base de datos autoinicia
- Variables de entorno incluidas

---

## 🚀 ¡COMIENZA AHORA!

**Opción 1: Inicio Rápido**
→ Abre [QUICKSTART.md](QUICKSTART.md)

**Opción 2: Entender Primero**
→ Lee [ARCHITECTURE.md](ARCHITECTURE.md)

**Opción 3: Ver Ejemplos**
→ Consulta [API_EXAMPLES.md](API_EXAMPLES.md)

---

**Última actualización**: 2024  
**Versión**: 1.0.0  
**Estado**: ✅ Listo para usar
