@echo off
REM Script de instalación rápida para LegalTech Microservicios (Windows)

echo 🚀 Iniciando instalación de LegalTech Microservicios...
echo.

REM Servicio de Autenticación
if not exist "servicio-autenticacion\.env" (
  (
    echo PORT=3001
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/auth-db?authSource=admin
    echo JWT_SECRET=legaltech-auth-service-secret-key-2024-very-secure-random-string
    echo JWT_EXPIRES_IN=7d
    echo NODE_ENV=development
    echo ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
  ) > servicio-autenticacion\.env
  echo ✅ servicio-autenticacion\.env creado
)

REM Servicio de Casos
if not exist "servicio-casos\.env" (
  (
    echo PORT=3002
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/cases-db?authSource=admin
    echo NODE_ENV=development
    echo AUTH_SERVICE_URL=http://servicio-autenticacion:3001
  ) > servicio-casos\.env
  echo ✅ servicio-casos\.env creado
)

REM Servicio de Clientes
if not exist "servicio-clientes\.env" (
  (
    echo PORT=3003
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/clients-db?authSource=admin
    echo NODE_ENV=development
    echo AUTH_SERVICE_URL=http://servicio-autenticacion:3001
  ) > servicio-clientes\.env
  echo ✅ servicio-clientes\.env creado
)

REM Servicio de Documentos
if not exist "servicio-documentos\.env" (
  (
    echo PORT=3004
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/documents-db?authSource=admin
    echo NODE_ENV=development
    echo UPLOAD_PATH=./uploads
    echo MAX_FILE_SIZE=52428800
    echo AUTH_SERVICE_URL=http://servicio-autenticacion:3001
  ) > servicio-documentos\.env
  echo ✅ servicio-documentos\.env creado
)

REM Servicio de Seguimiento de Tiempo
if not exist "servicio-seguimiento-tiempo\.env" (
  (
    echo PORT=3005
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/time-tracking-db?authSource=admin
    echo NODE_ENV=development
    echo AUTH_SERVICE_URL=http://servicio-autenticacion:3001
    echo CASES_SERVICE_URL=http://servicio-casos:3002
  ) > servicio-seguimiento-tiempo\.env
  echo ✅ servicio-seguimiento-tiempo\.env creado
)

REM Servicio de Facturación
if not exist "servicio-facturacion\.env" (
  (
    echo PORT=3006
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/billing-db?authSource=admin
    echo NODE_ENV=development
    echo AUTH_SERVICE_URL=http://servicio-autenticacion:3001
    echo CLIENTS_SERVICE_URL=http://servicio-clientes:3003
    echo TIME_TRACKING_SERVICE_URL=http://servicio-seguimiento-tiempo:3005
  ) > servicio-facturacion\.env
  echo ✅ servicio-facturacion\.env creado
)

REM Servicio de Notificaciones
if not exist "servicio-notificaciones\.env" (
  (
    echo PORT=3007
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/notifications-db?authSource=admin
    echo NODE_ENV=development
    echo AUTH_SERVICE_URL=http://servicio-autenticacion:3001
  ) > servicio-notificaciones\.env
  echo ✅ servicio-notificaciones\.env creado
)

REM Servicio de Panel de Control
if not exist "servicio-panel-control\.env" (
  (
    echo PORT=3008
    echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/dashboard-db?authSource=admin
    echo NODE_ENV=development
    echo AUTH_SERVICE_URL=http://servicio-autenticacion:3001
    echo CASES_SERVICE_URL=http://servicio-casos:3002
    echo CLIENTS_SERVICE_URL=http://servicio-clientes:3003
    echo DOCUMENTS_SERVICE_URL=http://servicio-documentos:3004
    echo TIME_TRACKING_SERVICE_URL=http://servicio-seguimiento-tiempo:3005
    echo BILLING_SERVICE_URL=http://servicio-facturacion:3006
    echo NOTIFICATIONS_SERVICE_URL=http://servicio-notificaciones:3007
  ) > servicio-panel-control\.env
  echo ✅ servicio-panel-control\.env creado
)

echo.
echo 🎉 Configuración completada!
echo.
echo 📋 Próximos pasos:
echo 1. Ejecutar: docker-compose up -d
echo 2. Verificar servicios: docker-compose ps
echo 3. Ver health checks en http://localhost:3001/health hasta 3008/health
echo.
echo 📚 Servicios disponibles:
echo 🔐 Autenticación:     http://localhost:3001
echo ⚖️  Casos:            http://localhost:3002
echo 👥  Clientes:         http://localhost:3003
echo 📄  Documentos:       http://localhost:3004
echo ⏱️  Seguimiento:      http://localhost:3005
echo 💰  Facturación:      http://localhost:3006
echo 🔔  Notificaciones:   http://localhost:3007
echo 📊  Panel de Control: http://localhost:3008
echo.
pause

echo.
echo ✨ Instalación completada!
echo.
echo Para iniciar los servicios, ejecuta:
echo   docker-compose up -d
echo.
echo Para ver los logs, ejecuta:
echo   docker-compose logs -f
echo.
echo Servicios que se iniciarán:
echo   - MongoDB: mongodb://localhost:27017
echo   - Usuarios: http://localhost:3001
echo   - Casos: http://localhost:3002
echo   - Clientes: http://localhost:3003
echo   - Documentos: http://localhost:3004
echo.
pause
