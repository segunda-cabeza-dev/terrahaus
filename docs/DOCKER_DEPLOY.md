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
# editar .env (API_IMAGE, WEB_IMAGE, secrets, VITE_GTM_ID si querés GTM)
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Migraciones:
- El servicio `migrate` ejecuta `prisma migrate deploy` y aplica solo pendientes.

## Google Tag Manager

- La web carga GTM solo si `VITE_GTM_ID` existe al momento de compilar el frontend.
- Ejemplo: `VITE_GTM_ID=GTM-XXXXXXX`
- En desarrollo con `docker-compose.dev.yml` ya queda expuesto como variable de entorno.
- En builds productivos con `scripts/deploy.sh`, el valor se pasa al `docker build` del frontend.
- Si usás otro pipeline de build para la imagen web, asegurate de pasar `--build-arg VITE_GTM_ID=GTM-XXXXXXX`.

## Traefik (opcional)

```bash
docker compose -f docker-compose.prod.yml -f docker-compose.prod.traefik.yml up -d
```
