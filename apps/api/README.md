# API Terrahaus

API de contactos para Terrahaus construida con Fastify + PostgreSQL.

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones (requiere PostgreSQL corriendo)
npm run db:migrate

# Iniciar en modo desarrollo
npm run dev
```

## Endpoints

### Contactos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/contacts` | Crear nuevo contacto |
| `GET` | `/api/contacts` | Listar contactos (admin) |
| `GET` | `/api/contacts/:id` | Obtener contacto por ID |
| `PATCH` | `/api/contacts/:id/processed` | Marcar como procesado |

### Health Check

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Estado del servidor |

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

La API se ejecuta automáticamente con el resto del proyecto:

```bash
docker compose up -d
```

La API estará disponible en:
- Local: `http://localhost:3001`
- Traefik: `http://api.localhost`
