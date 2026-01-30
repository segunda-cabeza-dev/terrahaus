# Terrahaus

Sitio web para estudio de arquitectura y reformas especializado en proyectos sostenibles.

## 🚀 Stack Tecnológico

- **Frontend**: React 19 + Vite 7 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Router**: React Router v7
- **Backend API**: Fastify + Drizzle ORM
- **Database**: PostgreSQL 16
- **CDN**: Cloudflare R2 (imágenes y videos)
- **Monorepo**: npm workspaces

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

### Desarrollo local

1. Crear archivo `apps/web/.env.local`:
```env
VITE_API_URL=http://localhost:3001
VITE_ASSETS_URL=https://pub-e9476d34c83b42cebbbfe7469a26b77a.r2.dev
```

2. Levantar PostgreSQL y API con Docker:
```bash
docker compose up -d
```

3. Ejecutar migraciones:
```bash
docker compose exec api npm run db:migrate
```

## 🏃 Desarrollo

```bash
# Iniciar servidor de desarrollo (Vite)
npm run dev

# Disponible en http://localhost:5174
```

## 🏗️ Construcción

```bash
npm run build
```

## 🚀 Despliegue en Producción

```bash
# En el servidor
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec api npm run db:migrate
```

## 📁 Estructura del Proyecto

```
terrahaus/
├── apps/
│   ├── web/              # Frontend React (Vite)
│   └── api/              # Backend Fastify + PostgreSQL
├── packages/
│   └── shared/           # Componentes compartidos
├── docker-compose.yml    # Desarrollo local (postgres + api)
└── docker-compose.prod.yml # Producción (frontend + api + postgres)
```

## 🌐 Dominios

- **Web**: terrahaus.es
- **API**: api.terrahaus.es

---

Desarrollado con ❤️ para Terrahaus

