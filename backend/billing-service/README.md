# Billing Service

Microservicio para facturación y gestión de invoices.

## Puertos

- **Puerto**: 3006

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/invoices | Crear factura |
| GET | /api/invoices | Listar facturas |
| GET | /api/invoices/:id | Obtener factura por ID |
| GET | /api/invoices/client/:clientId | Facturas de un cliente |
| PUT | /api/invoices/:id | Actualizar factura |
| PUT | /api/invoices/:id/pay | Marcar como pagada |
| DELETE | /api/invoices/:id | Eliminar factura |

## Variables de Entorno

Ver `.env.example`

## Uso

```bash
npm install
npm run dev
```

## Docker

```bash
docker build -t billing-service .
docker run -p 3006:3006 billing-service
```