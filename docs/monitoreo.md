# Monitoreo con Prometheus y Grafana

La rubrica exige evidencia de monitoreo. Este proyecto incluye una base local para levantar Prometheus y Grafana junto con exportadores de infraestructura.

## Levantar monitoreo

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

## Accesos

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`
- Usuario Grafana: `admin`
- Clave Grafana: `admin`

## Metricas disponibles

- Disponibilidad de endpoints HTTP mediante blackbox-exporter.
- Recursos de contenedores mediante cAdvisor.
- Metricas de host mediante node-exporter.
- Metricas de PostgreSQL mediante postgres-exporter cuando se configure `DATA_SOURCE_NAME`.
- Estado de Prometheus y targets.

## Evidencia para la sustentacion

1. Abrir Prometheus y mostrar `Status > Targets`.
2. Abrir Grafana y mostrar el dashboard `LegalTech Overview`.
3. Explicar que el monitoreo permite ver disponibilidad, consumo de recursos y salud de la plataforma.
4. Mostrar que los targets del frontend y gateway aparecen como `UP` si estan accesibles.

