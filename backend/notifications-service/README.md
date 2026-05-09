# Notifications Service

Microservicio para notificaciones y alertas.

## Puertos

- **Puerto**: 3007

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/notifications | Crear notificación |
| POST | /api/notifications/send | Enviar notificación |
| GET | /api/notifications | Listar notificaciones |
| GET | /api/notifications/:id | Obtener notificación |
| PUT | /api/notifications/:id/read | Marcar como leída |
| PUT | /api/notifications/read-all | Marcar todas como leídas |
| DELETE | /api/notifications/:id | Eliminar notificación |

## Variables de Entorno

Ver `.env.example`

## Uso

```bash
npm install
npm run dev
```

## Docker

```bash
docker build -t notifications-service .
docker run -p 3007:3007 notifications-service
```