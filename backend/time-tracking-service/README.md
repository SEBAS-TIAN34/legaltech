# Time Tracking Service

Microservicio para control de tiempo y seguimiento de horas en casos legales.

## Puertos

- **Puerto**: 3005

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/time-entries | Crear entrada de tiempo |
| GET | /api/time-entries | Listar entradas de tiempo |
| GET | /api/time-entries/:id | Obtener entrada por ID |
| GET | /api/time-entries/case/:caseId | Entradas de un caso |
| PUT | /api/time-entries/:id | Actualizar entrada |
| PUT | /api/time-entries/:id/stop | Detener temporizador |
| DELETE | /api/time-entries/:id | Eliminar entrada |

## Variables de Entorno

Ver `.env.example`

## Uso

```bash
npm install
npm run dev
```

## Docker

```bash
docker build -t time-tracking-service .
docker run -p 3005:3005 time-tracking-service
```