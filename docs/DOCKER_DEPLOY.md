# Deploy con Docker + Traefik

## 🚀 Deploy Local (desarrollo)

```bash
# Construir y levantar
docker compose up -d --build

# Acceder a: http://localhost:3000
```

## 🌐 Deploy en Producción (con HTTPS)

### 1. Clonar en el servidor

```bash
git clone https://github.com/juliana392/terrahaus.git
cd terrahaus
```

### 2. Configurar variables de entorno

```bash
cp .env.production.example .env
nano .env
```

Editar:
```env
DOMAIN=terrahaus.tudominio.com
ACME_EMAIL=tu@email.com
```

### 3. Configurar DNS

Apuntar tu dominio al servidor:
```
A    terrahaus.tudominio.com    →    IP_DEL_SERVIDOR
```

### 4. Desplegar

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

¡Listo! Tu sitio estará en `https://terrahaus.tudominio.com` con SSL automático.

## 📦 Comandos útiles

```bash
# Ver estado
docker compose ps

# Ver logs
docker compose logs -f terrahaus

# Reconstruir sin cache
docker compose build --no-cache

# Parar todo
docker compose down

# Parar y eliminar volúmenes
docker compose down -v
```

## 🔧 Estructura de archivos

```
├── Dockerfile              # Multi-stage build (Node + Nginx)
├── docker-compose.yml      # Para desarrollo local
├── docker-compose.prod.yml # Para producción con HTTPS
├── nginx.conf              # Configuración de Nginx para SPA
├── .dockerignore           # Archivos a ignorar en el build
└── .env.production.example # Ejemplo de variables de entorno
```

## 💡 Tips

1. **SSL automático**: Let's Encrypt genera y renueva certificados automáticamente
2. **Cache de imágenes**: Las imágenes se sirven desde Cloudflare R2
3. **Gzip**: Habilitado automáticamente en Nginx
4. **Health check**: Disponible en `/health`
