# API Terrahaus

API de contactos para Terrahaus construida con Fastify + Prisma + PostgreSQL.

## Desarrollo local (recomendado con Docker Compose)

Desde la raíz del repo:

```bash
cp .env.example .env

# DB en Docker
docker compose -f docker-compose.db.yml up -d

# API fuera de Docker
cp apps/api/.env.example apps/api/.env
npm run dev:api
```

La API queda en `http://localhost:3000`.

## Endpoints

### Contactos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/contacts` | Crear nuevo contacto |
| `GET` | `/contacts` | Listar contactos (admin) |
| `GET` | `/contacts/:id` | Obtener contacto por ID |
| `PATCH` | `/contacts/:id/processed` | Marcar como procesado |

Compatibilidad: también existen las mismas rutas bajo `/api/contacts/*`.

### Health Check

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Estado del servidor |

### Version

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/version` | Info de build/commit |

## Crear contacto (POST /api/contacts)

```json
{
  "name": "Juan García",
  "email": "juan@example.com",
  "phone": "+34612345678",
  "reformType": "Cocina Integral",
  "message": "Interesado en reforma de cocina de 15m²",
  "source": "reformas-cocina"
}
```

## Docker

La API corre dentro de `docker-compose.dev.yml` (dev) y `docker-compose.prod.yml` (prod).
