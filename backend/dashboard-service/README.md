# Dashboard Service

Microservicio para dashboard y métricas del sistema.

## Puertos

- **Puerto**: 3008

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Estadísticas generales |
| GET | /api/dashboard/cases | Métricas de casos |
| GET | /api/dashboard/financial | Reportes financieros |
| GET | /api/dashboard/productivity | Productividad |
| GET | /api/dashboard/clients | Análisis de clientes |

## Variables de Entorno

Ver `.env.example`

## Uso

```bash
npm install
npm run dev
```

## Docker

```bash
docker build -t dashboard-service .
docker run -p 3008:3008 dashboard-service
```