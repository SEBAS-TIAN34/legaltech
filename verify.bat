@echo off
REM Verificar instalación (Windows)

echo 🔍 Verificando instalación de LegalTech...
echo.

REM Comprobar docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no está instalado
    echo 💡 Instala Docker desde: https://www.docker.com/get-started
    exit /b 1
)
echo ✅ Docker instalado

REM Comprobar docker-compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose no está instalado
    echo 💡 Instala Docker Compose desde: https://docs.docker.com/compose/install/
    exit /b 1
)
echo ✅ Docker Compose instalado

REM Comprobar docker-compose.yml
if not exist "docker-compose.yml" (
    echo ❌ docker-compose.yml no encontrado
    exit /b 1
)
echo ✅ docker-compose.yml encontrado

REM Comprobar estructura de servicios
echo.
echo 🔍 Verificando servicios...

setlocal enabledelayedexpansion
for %%S in (
    servicio-autenticacion
    servicio-casos
    servicio-clientes
    servicio-documentos
    servicio-seguimiento-tiempo
    servicio-facturacion
    servicio-notificaciones
    servicio-panel-control
) do (
    if not exist "%%S" (
        echo ❌ Carpeta %%S no encontrada
        exit /b 1
    )
    echo ✅ Servicio %%S encontrado
)

echo.
echo 🎉 Verificación satisfactoria!
echo.
echo 📋 Próximos pasos:
echo 1. Ejecutar: setup.bat (para crear archivos .env)
echo 2. Iniciar servicios: docker-compose up -d
echo 3. Verificar estado: docker-compose ps
echo 4. Ver health checks: http://localhost:3001/health hasta 3008/health
echo 5. Ver documentación completa: README.md
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
