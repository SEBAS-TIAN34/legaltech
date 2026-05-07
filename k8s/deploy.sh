#!/bin/bash

# LegalTech Kubernetes Deployment Script

set -e

echo "=========================================="
echo "🚀 Deploying LegalTech to Kubernetes"
echo "=========================================="

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first."
    exit 1
fi

# Check cluster connection
echo "📡 Checking cluster connection..."
kubectl cluster-info

# Apply namespace and basic configs
echo "📦 Applying namespace and configuration..."
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-secrets.yaml
kubectl apply -f 02-configmap.yaml

# Apply PostgreSQL
echo "🗄️  Deploying PostgreSQL..."
kubectl apply -f postgres/03-postgres-deployment.yaml

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
kubectl wait --for=condition=available --timeout=120s deployment/postgres -n legaltech

# Apply microservices
echo "🔧 Deploying microservices..."
for f in services/*.yaml; do
    echo "  Applying $(basename $f)..."
    kubectl apply -f "$f"
done

# Apply Ingress
echo "🌐 Deploying Ingress..."
kubectl apply -f ingress/20-ingress.yaml

# Apply HPA
echo "📈 Deploying Horizontal Pod Autoscaler..."
kubectl apply -f 30-hpa.yaml

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Services:"
kubectl get services -n legaltech
echo ""
echo "Deployments:"
kubectl get deployments -n legaltech
echo ""
echo "Pods:"
kubectl get pods -n legaltech
echo ""
echo "Ingress:"
kubectl get ingress -n legaltech
echo ""
echo "HPA:"
kubectl get hpa -n legaltech