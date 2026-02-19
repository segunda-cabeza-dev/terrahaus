# Deploy con Docker Compose

Este repo está pensado para:
- **Dev**: `docker-compose.dev.yml` (build local + hot reload)
- **Prod**: `docker-compose.prod.yml` (imágenes desde registry + migraciones one-shot)
- **Opcional**: `docker-compose.prod.traefik.yml` (override de labels/red)

## 🚀 Dev (local)

```bash
cp .env.example .env

# Solo DB en Docker
docker compose -f docker-compose.db.yml up -d

# Web + API fuera de Docker
npm run dev:web
npm run dev:api
```

- Web: `http://localhost:5173`
- API: `http://localhost:3000`

## 🌐 Prod (manual, recomendado)

1) Build & push manual en GitHub Actions:
- Workflow: `Build & Push Docker Images`

2) En el servidor/Portainer:

```bash
cp .env.production.example .env
# editar .env (API_IMAGE, WEB_IMAGE, secrets)
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Migraciones:
- El servicio `migrate` ejecuta `prisma migrate deploy` y aplica solo pendientes.

## Traefik (opcional)

```bash
docker compose -f docker-compose.prod.yml -f docker-compose.prod.traefik.yml up -d
```
