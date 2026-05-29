# Sustentacion Final - LegalTech

Este documento organiza la sustentacion segun la rubrica del curso y sirve como guion de exposicion, lista de evidencias y ruta de demostracion.

## 1. Contexto del problema y solucion

LegalTech atiende la necesidad de digitalizar la gestion de procesos juridicos entre clientes y abogados. En un entorno tradicional, la informacion de denuncias, casos, documentos, tiempos y facturacion suele estar dispersa en correos, archivos locales o conversaciones informales. Esto dificulta el seguimiento, la trazabilidad y la respuesta oportuna.

### Usuarios involucrados

- Cliente: registra denuncias, consulta sus casos, revisa documentos y realiza pagos.
- Abogado: administra casos, clientes, documentos, tiempos e informacion de facturacion.
- Administrador: controla usuarios, roles y supervision general del sistema.

### Necesidades detectadas

- Registro y autenticacion de usuarios.
- Separacion de experiencias entre cliente y abogado.
- Creacion y consulta de denuncias/casos.
- Gestion documental asociada a casos.
- Seguimiento de tiempo y facturacion.
- Panel de control para visualizar informacion operativa.
- Despliegue accesible desde la web.

### Objetivo principal

Construir una plataforma web modular para centralizar la gestion legal, conectando clientes y abogados mediante servicios especializados, API Gateway, persistencia en base de datos y despliegue cloud.

### Alcance

El proyecto cubre autenticacion, casos, clientes, documentos, seguimiento de tiempo, facturacion, notificaciones, dashboard, despliegue frontend en Vercel y arquitectura backend preparada para contenedores, Kubernetes, CI/CD y monitoreo.

## 2. Arquitectura y aspectos tecnicos

LegalTech esta disenado como una arquitectura de microservicios. Cada dominio funcional se separa en un servicio Node.js/Express con su propio modelo, rutas, controladores y Dockerfile.

### Microservicios

| Servicio | Puerto | Responsabilidad |
| --- | ---: | --- |
| auth-service | 3001 | Registro, login, JWT, roles y auditoria de usuarios |
| cases-service | 3002 | Creacion, consulta, actualizacion y cierre de casos |
| clients-service | 3003 | Gestion de clientes y perfiles |
| documents-service | 3004 | Carga y consulta de documentos asociados |
| time-tracking-service | 3005 | Registro de horas, tarifas y actividades |
| billing-service | 3006 | Facturas, pagos y estados de cobro |
| notifications-service | 3007 | Notificaciones del sistema |
| dashboard-service | 3008 | Agregacion de metricas funcionales |
| nginx gateway | 80/443 | API Gateway y enrutamiento hacia servicios |

### Comunicacion

- El frontend consume APIs REST.
- NGINX funciona como API Gateway para enrutar `/api/auth`, `/api/cases`, `/api/clients`, `/api/documents`, `/api/time`, `/api/billing`, `/api/notifications` y `/api/dashboard`.
- Los servicios comparten una base PostgreSQL/Supabase para persistencia.
- La autenticacion se basa en JWT y middlewares de autorizacion por rol.

### Patron SAGA

El flujo de gestion legal puede explicarse como una SAGA coreografiada:

1. Cliente crea denuncia en `cases-service`.
2. Se registra auditoria del evento.
3. El caso puede generar documentos en `documents-service`.
4. Las horas trabajadas se registran en `time-tracking-service`.
5. La informacion de tiempo alimenta facturacion en `billing-service`.
6. `notifications-service` informa cambios de estado al usuario.

Compensaciones posibles:

- Si falla la creacion de documento, el caso se mantiene en estado `pending` y se notifica la inconsistencia.
- Si falla facturacion, el caso no se elimina; se deja pendiente de cobro.
- Si falla notificacion, el evento principal se conserva y puede reintentarse.

## 3. Stack tecnologico

| Capa | Tecnologia | Justificacion |
| --- | --- | --- |
| Frontend | HTML, CSS, JavaScript | Interfaz liviana, facil de desplegar en Vercel |
| Backend | Node.js, Express | APIs REST por microservicio, ecosistema amplio |
| Base de datos | PostgreSQL / Supabase | Modelo relacional adecuado para casos, usuarios y facturas |
| ORM | Sequelize | Modelado y acceso estructurado a datos |
| API Gateway | NGINX | Enrutamiento centralizado y desacoplamiento del frontend |
| Contenedores | Docker, Docker Compose | Portabilidad de servicios |
| Orquestacion | Kubernetes manifests | Preparacion para despliegue escalable |
| CI/CD | GitHub Actions | Automatizacion de build, test y despliegue |
| Monitoreo | Prometheus, Grafana | Metricas, dashboards y evidencia operacional |
| Cloud | Vercel, Render/Supabase | Despliegue web y servicios administrados |

## 4. Pruebas, despliegue y monitoreo

### Pruebas

El proyecto incluye pruebas con Jest y Supertest en servicios como `auth-service`, `cases-service` y `notifications-service`.

Evidencias:

- `backend/auth-service/tests`
- `backend/cases-service/tests`
- `backend/notifications-service/tests`
- `.github/workflows/ci.yml`

Comandos sugeridos:

```bash
cd backend/auth-service && npm test
cd backend/cases-service && npm test
cd backend/notifications-service && npm test
```

### Despliegue

Evidencias:

- Frontend desplegado en Vercel.
- Repositorio conectado a GitHub.
- Workflows en `.github/workflows`.
- Dockerfiles por microservicio.
- `docker-compose.nginx.yml` para entorno integrado.
- Manifiestos Kubernetes en `k8s`.

Flujo CI/CD:

1. Cambio local.
2. `git add`, `git commit`, `git push origin main`.
3. GitHub Actions ejecuta validaciones/build.
4. Vercel despliega frontend automaticamente.

### Monitoreo

Se agrega una base de monitoreo en:

- `docker-compose.monitoring.yml`
- `monitoring/prometheus/prometheus.yml`
- `monitoring/grafana/provisioning/datasources/prometheus.yml`
- `monitoring/grafana/dashboards/legaltech-overview.json`

Comando:

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

Servicios:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000` usuario `admin`, clave `admin`

## 5. Demostracion funcional

Ruta recomendada para la demo:

1. Registro de usuario cliente con correo nuevo.
2. Inicio de sesion.
3. Creacion de denuncia/caso desde el panel cliente.
4. Consulta del caso creado en "Mis Casos".
5. Ingreso como abogado para visualizar casos.
6. Creacion/consulta de documentos o facturas.
7. Mostrar manejo de error: correo duplicado o politica RLS.
8. Mostrar repositorio, workflow CI/CD y evidencia de despliegue.
9. Mostrar Prometheus/Grafana si esta levantado localmente.

### Requerimientos minimos de la rubrica

| Requerimiento | Como demostrarlo |
| --- | --- |
| Creacion de informacion | Registrar usuario, crear denuncia/caso |
| Consulta de informacion | Ver casos, clientes, documentos o facturas |
| Actualizacion de informacion | Cambiar estado de caso/factura |
| Eliminacion o cancelacion | Cerrar/cancelar caso o anular factura |
| Comunicacion entre microservicios | Explicar flujo gateway-servicios y dashboard agregador |

## Preguntas probables y respuestas cortas

**Por que microservicios?**  
Porque cada dominio legal tiene responsabilidades separadas: autenticacion, casos, documentos, facturacion y notificaciones pueden evolucionar, probarse y desplegarse de forma independiente.

**Cual es el rol del API Gateway?**  
Centraliza la entrada al backend y evita que el frontend conozca la ubicacion interna de cada servicio.

**Como se maneja autenticacion?**  
El servicio de autenticacion genera tokens JWT y los middlewares validan identidad y roles en los servicios protegidos.

**Donde se aplica SAGA?**  
En los procesos que cruzan varios dominios, como denuncia -> documentos -> tiempos -> facturacion -> notificaciones, evitando depender de una unica transaccion distribuida.

**Que monitorean Prometheus y Grafana?**  
Disponibilidad de endpoints, estado de contenedores, salud de servicios y metricas de infraestructura local.

