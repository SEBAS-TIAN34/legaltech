# LegalTech - Guía de Deployment

## Deployment en Producción

### 1. Preparación de Servidor

#### Requisitos
- Servidor Linux (Ubuntu 20.04 LTS recomendado)
- Docker y Docker Compose instalados
- Domain name (opcional)
- SSL Certificate (para HTTPS)

#### Instalación de Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### Instalación de Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

### 2. Configuración en Producción

#### Cambiar Variables de Entorno

**Actualizar `.env` en cada servicio:**

```env
# Users Service
NODE_ENV=production
JWT_SECRET=GENERAR_CLAVE_SEGURA_AQUI
MONGODB_URI=mongodb://user_prod:password_prod@mongodb-prod:27017/users-db?authSource=admin

# Cases Service  
NODE_ENV=production
MONGODB_URI=mongodb://user_prod:password_prod@mongodb-prod:27017/cases-db?authSource=admin

# Similar para Clients y Documents
```

#### Generar JWT_SECRET Fuerte
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 3. Configuración de MongoDB para Producción

Actualizar `docker-compose.yml`:

```yaml
mongodb:
  image: mongo:7.0
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: CAMBIAR_PASSWORD
    MONGO_REPLSET_NAME: rs0
  volumes:
    - mongodb_data:/data/db
    - mongodb_config:/data/configdb
  ports:
    - "27017:27017"
```

---

### 4. Nginx como Reverse Proxy

#### Instalación
```bash
sudo apt-get update
sudo apt-get install nginx -y
```

#### Configuración
```bash
sudo nano /etc/nginx/sites-available/legaltech
```

```nginx
upstream users_service {
    server localhost:3001;
}

upstream cases_service {
    server localhost:3002;
}

upstream clients_service {
    server localhost:3003;
}

upstream documents_service {
    server localhost:3004;
}

server {
    listen 80;
    server_name tu_dominio.com;

    client_max_body_size 50M;

    location /api/auth {
        proxy_pass http://users_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/cases {
        proxy_pass http://cases_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/clients {
        proxy_pass http://clients_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/documents {
        proxy_pass http://documents_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Habilitar configuración:
```bash
sudo ln -s /etc/nginx/sites-available/legaltech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 5. SSL Certificate con Let's Encrypt

#### Instalación de Certbot
```bash
sudo apt-get install certbot python3-certbot-nginx -y
```

#### Generar Certificado
```bash
sudo certbot --nginx -d tu_dominio.com
```

#### Renovación Automática
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

### 6. Docker Compose en Producción

```bash
cd /opt/legaltech

# Crear volúmenes para persistencia
docker volume create legaltech-mongodb
docker volume create legaltech-documents

# Actualizar docker-compose.yml para producción
# (usar imágenes sin nodemon, etc.)

# Iniciar servicios
docker-compose -f docker-compose.yml up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

---

### 7. Backup de MongoDB

#### Script de Backup
```bash
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

docker-compose exec -T mongodb mongodump --out $BACKUP_DIR/$DATE --authenticationDatabase admin -u admin -p admin123

# Mantener últimas 7 copias
find $BACKUP_DIR -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;
```

#### Ejecutar Diariamente
```bash
sudo crontab -e
# Agregar: 0 2 * * * /opt/legaltech/backup.sh
```

---

### 8. Monitoreo y Logs

#### Ver logs en tiempo real
```bash
docker-compose logs -f users-service
docker-compose logs -f cases-service
```

#### Almacenar logs en archivos
```bash
docker-compose logs --no-log-prefix > logs.txt
```

#### Usar herramientas de monitoreo
- **Portainer**: Interface gráfica para Docker
- **Prometheus + Grafana**: Monitoreo avanzado
- **ELK Stack**: Centralización de logs

---

### 9. Seguridad

#### Firewall
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

#### Variables Sensibles
```bash
# NO committear.env a git
echo ".env" >> .gitignore

# Usar secretos de Docker
docker secret create jwt_secret jwt_secret.txt
```

#### Actualizar Imágenes
```bash
docker-compose pull
docker-compose up -d
```

---

### 10. Escalado Horizontal

#### Múltiples Instancias con Docker Swarm
```bash
docker swarm init

# Deploy como stack
docker stack deploy -c docker-compose.yml legaltech

# Escalar servicio
docker service scale legaltech_users-service=3
```

---

### 11. CI/CD con GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_KEY }}
          script: |
            cd /opt/legaltech
            git pull
            docker-compose up -d
```

---

## Checklist de Deployment

- [ ] Cambiar JWT_SECRET
- [ ] Actualizar MongoDB credentials
- [ ] Usar Node.js imagen ligera
- [ ] Configurar Nginx reverse proxy
- [ ] Instalar SSL certificate
- [ ] Configurar Firewall
- [ ] Backup de MongoDB
- [ ] Setup de logs centralizados
- [ ] Monitoreo configurado
- [ ] Health checks activos
- [ ] Rate limiting implementado
- [ ] CORS configurado correctamente

---

## URLs de Servicios

**En Desarrollo:**
- Usuarios: http://localhost:3001
- Casos: http://localhost:3002
- Clientes: http://localhost:3003
- Documentos: http://localhost:3004

**En Producción:**
- Todos: https://tu_dominio.com/api/

---

## Troubleshooting

### MongoDB no conecta
```bash
docker-compose logs mongodb
docker-compose exec mongodb mongosh -u admin -p admin123
```

### Puerto en uso
```bash
# Encontrar proceso en puerto
lsof -i :3001
kill -9 <PID>
```

### Permisos de archivos
```bash
sudo chown -R $USER:$USER /opt/legaltech
chmod -R 755 uploads/
```

---

**Creado para LegalTech - Sistema Legal Moderno**
