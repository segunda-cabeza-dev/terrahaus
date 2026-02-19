# Terrahaus

Sitio web para estudio de arquitectura y reformas.

## Stack

- **Web**: React + Vite + TypeScript (`apps/web`)
- **API**: Node + Fastify + Prisma (`apps/api`)
- **DB**: PostgreSQL
- **Monorepo**: npm workspaces

## Estructura

```
apps/
  web/        # React + Vite
  api/        # Fastify + Prisma
packages/
  shared/     # Código compartido
docker/
  nginx.conf  # SPA fallback + proxy /api -> api
docker-compose.dev.yml
docker-compose.prod.yml
.github/workflows/build-images.yml
```

## Dev (local: Vite + API, Docker solo para DB)

```bash
cp .env.example .env

# 1) DB
docker compose -f docker-compose.db.yml up -d

# 2) API (otra terminal)
cp apps/api/.env.example apps/api/.env
npm run dev:api

# 3) Web (otra terminal)
npm run dev:web
```

Atajo (mata puertos 5173/3000 y levanta ambos):

```bash
npm run local
```

- Web: `http://localhost:5173`
- API: `http://localhost:3000` (health: `/health`, version: `/version`)
- DB: `localhost:5432`

Migraciones (Prisma):
- Primera vez / aplicar pendientes: `npm run db:migrate --workspace @terrahaus/api`

Webhook leads (opcional):
- Configurar en `apps/api/.env`:
  - `LEADS_WEBHOOK_URL=https://app.terrahaus.es/api/leads`
  - `LEADS_WEBHOOK_AUTHTOKEN=...`

### Migraciones en dev (cuando cambie el schema)

```bash
npm run db:dev --workspace @terrahaus/api
```

## Dev (full Docker, opcional)

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Prod (manual: build/push + deploy)

1) **Build & push manual**: GitHub Actions → `Build & Push Docker Images` (workflow_dispatch).

2) En el server/Portainer:

```bash
cp .env.production.example .env
# editar .env (API_IMAGE, WEB_IMAGE, secrets)
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Notas:
- No hay deploy automático al merge a `main`.
- El servicio `migrate` aplica migraciones pendientes con `prisma migrate deploy` usando la misma imagen de `api`.

### Traefik (opcional)

```bash
docker compose -f docker-compose.prod.yml -f docker-compose.prod.traefik.yml up -d
```
