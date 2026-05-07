#!/bin/bash

# Script para iniciar LegalTech con Docker Compose (PostgreSQL)

set -e

echo "🚀 Starting LegalTech with PostgreSQL..."

# Build and start services
docker-compose -f docker-compose.postgres.yml up -d --build

echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL
sleep 10

# Check services
echo ""
echo "📊 Checking services..."
docker-compose -f docker-compose.postgres.yml ps

echo ""
echo "✅ LegalTech is running!"
echo ""
echo "Services:"
echo "  - PostgreSQL:  localhost:5432"
echo "  - Auth:       localhost:3001"
echo "  - Cases:      localhost:3002"
echo "  - Clients:    localhost:3003"
echo "  - Documents:  localhost:3004"
echo "  - TimeTrack:  localhost:3005"
echo "  - Billing:    localhost:3006"
echo "  - Notif:      localhost:3007"
echo "  - Dashboard:  localhost:3008"
echo ""
echo "To view logs: docker-compose -f docker-compose.postgres.yml logs -f"
echo "To stop: docker-compose -f docker-compose.postgres.yml down"