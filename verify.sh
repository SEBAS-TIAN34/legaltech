#!/bin/bash

# Verificar instalación
echo "🔍 Verificando instalación de LegalTech..."
echo ""

# Comprobar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    echo "💡 Instala Docker desde: https://www.docker.com/get-started"
    exit 1
fi
echo "✅ Docker instalado"

# Comprobar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    echo "💡 Instala Docker Compose desde: https://docs.docker.com/compose/install/"
    exit 1
fi
echo "✅ Docker Compose instalado"

# Comprobar docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml no encontrado"
    exit 1
fi
echo "✅ docker-compose.yml encontrado"

# Comprobar estructura de directorios
echo ""
echo "🔍 Verificando servicios..."

services=(
    "servicio-autenticacion"
    "servicio-casos"
    "servicio-clientes"
    "servicio-documentos"
    "servicio-seguimiento-tiempo"
    "servicio-facturacion"
    "servicio-notificaciones"
    "servicio-panel-control"
)

for service in "${services[@]}"; do
    if [ ! -d "$service" ]; then
        echo "❌ Carpeta $service no encontrada"
        exit 1
    fi
    echo "✅ Servicio $service encontrado"
done

echo ""
echo "🎉 ¡Verificación satisfactoria!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecutar: ./setup.sh (para crear archivos .env)"
echo "2. Iniciar servicios: docker-compose up -d"
echo "3. Verificar estado: docker-compose ps"
echo "4. Ver health checks: http://localhost:3001/health hasta 3008/health"
echo "5. Ver documentación completa: README.md"
echo ""
echo "📚 Servicios disponibles:"
echo "🔐 Autenticación:     http://localhost:3001"
echo "⚖️  Casos:            http://localhost:3002"
echo "👥  Clientes:         http://localhost:3003"
echo "📄  Documentos:       http://localhost:3004"
echo "⏱️  Seguimiento:      http://localhost:3005"
echo "💰  Facturación:      http://localhost:3006"
echo "🔔  Notificaciones:   http://localhost:3007"
echo "📊  Panel de Control: http://localhost:3008"
echo ""
echo "Para ver logs en tiempo real:"
echo "  docker-compose logs -f [nombre-del-servicio]"
