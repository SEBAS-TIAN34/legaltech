#!/bin/bash

# Script de instalación rápida para LegalTech Microservicios

echo "🚀 Iniciando instalación de LegalTech Microservicios..."

# Crear archivos .env si no existen
echo "📝 Creando archivos .env..."

# Servicio de Autenticación
if [ ! -f "servicio-autenticacion/.env" ]; then
  cat > servicio-autenticacion/.env << EOF
PORT=3001
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/auth-db?authSource=admin
JWT_SECRET=legaltech-auth-service-secret-key-2024-very-secure-random-string
JWT_EXPIRES_IN=7d
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
EOF
  echo "✅ servicio-autenticacion/.env creado"
fi

# Servicio de Casos
if [ ! -f "servicio-casos/.env" ]; then
  cat > servicio-casos/.env << EOF
PORT=3002
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/cases-db?authSource=admin
NODE_ENV=development
AUTH_SERVICE_URL=http://servicio-autenticacion:3001
EOF
  echo "✅ servicio-casos/.env creado"
fi

# Servicio de Clientes
if [ ! -f "servicio-clientes/.env" ]; then
  cat > servicio-clientes/.env << EOF
PORT=3003
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/clients-db?authSource=admin
NODE_ENV=development
AUTH_SERVICE_URL=http://servicio-autenticacion:3001
EOF
  echo "✅ servicio-clientes/.env creado"
fi

# Servicio de Documentos
if [ ! -f "servicio-documentos/.env" ]; then
  cat > servicio-documentos/.env << EOF
PORT=3004
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/documents-db?authSource=admin
NODE_ENV=development
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800
AUTH_SERVICE_URL=http://servicio-autenticacion:3001
EOF
  echo "✅ servicio-documentos/.env creado"
fi

# Servicio de Seguimiento de Tiempo
if [ ! -f "servicio-seguimiento-tiempo/.env" ]; then
  cat > servicio-seguimiento-tiempo/.env << EOF
PORT=3005
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/time-tracking-db?authSource=admin
NODE_ENV=development
AUTH_SERVICE_URL=http://servicio-autenticacion:3001
CASES_SERVICE_URL=http://servicio-casos:3002
EOF
  echo "✅ servicio-seguimiento-tiempo/.env creado"
fi

# Servicio de Facturación
if [ ! -f "servicio-facturacion/.env" ]; then
  cat > servicio-facturacion/.env << EOF
PORT=3006
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/billing-db?authSource=admin
NODE_ENV=development
AUTH_SERVICE_URL=http://servicio-autenticacion:3001
CLIENTS_SERVICE_URL=http://servicio-clientes:3003
TIME_TRACKING_SERVICE_URL=http://servicio-seguimiento-tiempo:3005
EOF
  echo "✅ servicio-facturacion/.env creado"
fi

# Servicio de Notificaciones
if [ ! -f "servicio-notificaciones/.env" ]; then
  cat > servicio-notificaciones/.env << EOF
PORT=3007
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/notifications-db?authSource=admin
NODE_ENV=development
AUTH_SERVICE_URL=http://servicio-autenticacion:3001
EOF
  echo "✅ servicio-notificaciones/.env creado"
fi

# Servicio de Panel de Control
if [ ! -f "servicio-panel-control/.env" ]; then
  cat > servicio-panel-control/.env << EOF
PORT=3008
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/dashboard-db?authSource=admin
NODE_ENV=development
AUTH_SERVICE_URL=http://servicio-autenticacion:3001
CASES_SERVICE_URL=http://servicio-casos:3002
CLIENTS_SERVICE_URL=http://servicio-clientes:3003
DOCUMENTS_SERVICE_URL=http://servicio-documentos:3004
TIME_TRACKING_SERVICE_URL=http://servicio-seguimiento-tiempo:3005
BILLING_SERVICE_URL=http://servicio-facturacion:3006
NOTIFICATIONS_SERVICE_URL=http://servicio-notificaciones:3007
EOF
  echo "✅ servicio-panel-control/.env creado"
fi

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecutar: docker-compose up -d"
echo "2. Verificar servicios: docker-compose ps"
echo "3. Ver health checks en http://localhost:3001/health hasta 3008/health"
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
