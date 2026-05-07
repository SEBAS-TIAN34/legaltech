#!/bin/bash

# Script de Despliegue - LegalTech
# Este script sirve para desplegar en un servidor local o remoto

set -e

echo "========================================"
echo "  DESPLIEGUE LEGALTECH - Microservices"
echo "========================================"

# Colores para输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que Docker esté instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    log_info "Docker está instalado: $(docker --version)"
}

# Verificar que Docker Compose esté instalado
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado."
        exit 1
    fi
    log_info "Docker Compose está instalado: $(docker-compose --version)"
}

# Detener contenedores anteriores
stop_containers() {
    log_info "Deteniendo contenedores anteriores..."
    docker-compose -f docker-compose.postgres.yml down 2>/dev/null || true
}

# Construir las imágenes
build_images() {
    log_info "Construyendo imágenes Docker..."
    
    services=(
        "auth-service"
        "cases-service" 
        "clients-service"
        "documents-service"
        "time-tracking-service"
        "billing-service"
        "notifications-service"
        "dashboard-service"
    )
    
    for service in "${services[@]}"; do
        log_info "Construyendo $service..."
        docker build -t legaltech-$service:latest ./$service
    done
    
    log_info "Todas las imágenes construidas"
}

# Iniciar servicios
start_services() {
    log_info "Iniciando servicios..."
    
    docker-compose -f docker-compose.postgres.yml up -d
    
    log_info "Esperando a que los servicios estén listos..."
    sleep 10
}

# Verificar servicios
verify_services() {
    log_info "Verificando servicios..."
    
    services=(
        "auth-service:3001"
        "cases-service:3002"
        "clients-service:3003"
        "documents-service:3004"
        "time-tracking-service:3005"
        "billing-service:3006"
        "notifications-service:3007"
        "dashboard-service:3008"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r name port <<< "$service"
        if docker ps | grep -q "$name"; then
            log_info "✓ $name corriendo"
        else
            log_warn "⚠ $name no está corriendo"
        fi
    done
}

# Mostrar estado final
show_status() {
    echo ""
    echo "========================================"
    echo "  SERVIDOR DESPLIEGUE COMPLETADO"
    echo "========================================"
    echo ""
    echo "Servicios disponibles:"
    echo "  - Auth:         http://localhost:3001"
    echo "  - Cases:        http://localhost:3002"
    echo "  - Clients:      http://localhost:3003"
    echo "  - Documents:    http://localhost:3004"
    echo "  - Time Track:   http://localhost:3005"
    echo "  - Billing:      http://localhost:3006"
    echo "  - Notifications: http://localhost:3007"
    echo "  - Dashboard:    http://localhost:3008"
    echo ""
    echo "PostgreSQL: localhost:5432"
    echo "  Usuario: admin"
    echo "  Contraseña: admin123"
    echo "  Base de datos: legaltech"
    echo ""
}

# Menú principal
main() {
    check_docker
    check_docker_compose
    
    echo ""
    echo "Selecciona una opción:"
    echo "1) Desplegar todo (construir y ejecutar)"
    echo "2) Solo construir imágenes"
    echo "3) Solo iniciar servicios"
    echo "4) Detener servicios"
    echo "5) Ver logs de un servicio"
    echo ""
    read -p "Opción: " option
    
    case $option in
        1)
            stop_containers
            build_images
            start_services
            verify_services
            show_status
            ;;
        2)
            build_images
            log_info "Imágenes construidas"
            ;;
        3)
            start_services
            verify_services
            ;;
        4)
            stop_containers
            log_info "Servicios detenidos"
            ;;
        5)
            echo "Servicios disponibles: auth, cases, clients, documents, time-tracking, billing, notifications, dashboard"
            read -p "Ingresa el nombre del servicio: " service_name
            docker logs -f legaltech-$service_name
            ;;
        *)
            log_error "Opción inválida"
            ;;
    esac
}

main "$@"