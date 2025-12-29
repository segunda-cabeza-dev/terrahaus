# Terrahaus Web# Beltrame Web



Sitio web para estudio de arquitectura especializado en proyectos sostenibles.Aplicación web completa para empresa de herrería artesanal con panel de administración.



## 🚀 Stack Tecnológico## 🚀 Stack Tecnológico



- **Frontend Framework**: React 19- **Frontend Framework**: React 19

- **Build Tool**: Vite 7- **Build Tool**: Vite 7

- **Language**: TypeScript- **Language**: TypeScript

- **Styling**: Tailwind CSS- **Styling**: Tailwind CSS

- **Icons**: Lucide React- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)

- **Router**: React Router v7- **Backend**: Supabase (PostgreSQL + Auth + Storage)

- **CDN**: Cloudflare R2 (imágenes y videos)- **Icons**: Lucide React

- **Router**: React Router v7

## 📦 Instalación- **Monorepo**: npm workspaces



```bash## 📦 Instalación

# Instalar dependencias

npm install```bash

```# Instalar dependencias

npm install

## ⚙️ Configuración```



Crear archivo `apps/web/.env.local`:## ⚙️ Configuración del Backend



```env### Paso 1: Crear proyecto en Supabase

VITE_ASSETS_URL=https://pub-e9476d34c83b42cebbbfe7469a26b77a.r2.dev

```1. Ve a [https://supabase.com](https://supabase.com)

2. Crea un nuevo proyecto

## 🏃 Desarrollo3. Obtén tus credenciales (URL y anon key)



```bash### Paso 2: Configurar variables de entorno

# Iniciar servidor de desarrollo

npm run devActualiza los archivos `.env` en la raíz y en cada app:

# Disponible en http://localhost:5173

``````env

# .env (raíz)

## 🏗️ ConstrucciónVITE_SUPABASE_URL=https://tu-proyecto.supabase.co

VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

```bash

# Build de la aplicación# apps/web/.env

npm run buildVITE_SUPABASE_URL=https://tu-proyecto.supabase.co

```VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui



## 📁 Estructura del Proyecto# apps/admin/.env

VITE_SUPABASE_URL=https://tu-proyecto.supabase.co

```VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

apps/```

  web/                 # Sitio web público

    src/### Paso 3: Crear las tablas en Supabase

      components/      # Componentes reutilizables

      pages/           # Páginas del sitio1. Ve a SQL Editor en tu proyecto de Supabase

      lib/             # Utilidades (assets helper)2. Ejecuta el script `docs/supabase-setup-complete.sql`

packages/3. (Opcional) Ejecuta `docs/supabase-seed-data.sql` para datos de ejemplo

  shared/              # Código compartido

scripts/**📚 Guía detallada**: Ver `docs/SUPABASE_SETUP_GUIDE.md`

  convert-to-webp.js   # Script para convertir imágenes

  optimize-videos.sh   # Script para optimizar videos## 🏃 Desarrollo

```

```bash

## 🌐 Páginas# Iniciar servidor de desarrollo (web pública)

npm run dev

- `/es` - Home# o específicamente:

- `/es/glamping` - Proyecto Glampingnpm run dev:web

- `/es/proyectos/alpinablanca` - Alpina Blanca# Disponible en http://localhost:5173

- `/es/proyectos/casacuadrante` - Casa Cuadrante

- `/es/proyectos/casahorizonte` - Casa Horizonte# Iniciar panel de administración

- `/es/pequenaandina` - Pequeña Andinanpm run dev:admin

- `/es/proyectos-todos` - Todos los proyectos# Disponible en http://localhost:5174

- `/es/gracias` - Página de agradecimiento```



## 📷 Assets## 🏗️ Construcción



Las imágenes y videos se sirven desde Cloudflare R2 CDN.```bash

# Build de ambas aplicaciones

Para subir nuevos assets:npm run build

```bash

npx wrangler r2 object put terrahaus/images/nombre.webp --file="ruta/local.webp"# Build específico

```npm run build:web

npm run build:admin
```

## ✨ Características

### Sitio Web Público
- 🌍 Multiidioma (Español, Inglés, Italiano)
- 📱 Diseño responsive
- 🖼️ Galería de proyectos por categorías
- 📧 Formulario de contacto
- 💬 Botón flotante de WhatsApp
- 🎨 Animaciones suaves

### Panel de Administración
- 🔐 Autenticación con Supabase Auth
- 👥 Gestión de usuarios con roles
- 📊 Dashboard con estadísticas
- 📝 Editor de contenido del sitio
- 🖼️ Gestor de galería de imágenes
- 📦 Gestión de productos y proyectos
- 📬 Bandeja de mensajes de contacto
- 🔔 Sistema de recordatorios
- ⚙️ Configuración de WhatsApp

## 🎨 Componentes UI

El proyecto usa shadcn/ui con los siguientes componentes:

- Buttons, Cards, Dialogs, Dropdowns
- Forms (Input, Select, Checkbox, Switch)
- Tabs, Accordions, Alerts
- Toast notifications
- Progress bars, Avatars, Badges
- Y muchos más...

## 📁 Estructura del Proyecto

```
beltrame-web/
├── apps/
│   ├── web/                    # Sitio web público
│   │   ├── src/
│   │   │   ├── components/     # Componentes compartidos
│   │   │   ├── features/       # Features por módulo
│   │   │   │   ├── contacto/
│   │   │   │   ├── institucional/
│   │   │   │   ├── layout/
│   │   │   │   ├── proyectos/
│   │   │   │   └── showcase/
│   │   │   ├── shared/         # Código compartido
│   │   │   └── App.tsx
│   │   └── package.json
│   │
│   └── admin/                  # Panel de administración
│       ├── src/
│       │   ├── features/       # Features del admin
│       │   │   ├── auth/       # Autenticación
│       │   │   ├── contactos/  # Gestión de contactos
│       │   │   ├── contenido/  # Editor de contenido
│       │   │   ├── galeria/    # Gestión de galería
│       │   │   ├── productos/  # Gestión de productos
│       │   │   ├── proyectos/  # Gestión de proyectos
│       │   │   ├── recordatorios/
│       │   │   ├── usuarios/   # Gestión de usuarios
│       │   │   └── whatsapp/
│       │   ├── shared/
│       │   │   ├── components/ # Componentes UI
│       │   │   └── lib/        # Utilidades
│       │   └── App.tsx
│       └── package.json
│
├── packages/
│   └── shared/                 # Código compartido entre apps
│       ├── src/
│       │   ├── components/     # Componentes compartidos
│       │   ├── hooks/          # Custom hooks
│       │   ├── i18n/           # Internacionalización
│       │   ├── lib/
│       │   │   ├── supabase.ts # Cliente Supabase + tipos
│       │   │   └── utils.ts
│       │   └── services/       # Servicios API
│       └── package.json
│
├── docs/                       # Documentación
│   ├── SUPABASE_SETUP_GUIDE.md
│   ├── supabase-setup-complete.sql
│   └── supabase-seed-data.sql
│
└── package.json               # Root package.json
```

## 🗄️ Base de Datos

### Sistema de Traducciones Dinámico

La base de datos usa un **sistema de traducciones flexible** que soporta N idiomas sin modificar el esquema:

```sql
-- Tabla principal (sin idiomas específicos)
CREATE TABLE categories (
  id INT,
  slug TEXT,
  is_active BOOLEAN
);

-- Traducciones (cualquier idioma!)
CREATE TABLE translations (
  entity_type TEXT,   -- 'category', 'project', 'product'
  entity_id INT,      -- ID de la entidad
  field_name TEXT,    -- 'name', 'description'
  language_code TEXT, -- 'es', 'en', 'it', 'fr', 'de', etc.
  value TEXT          -- El texto traducido
);
```

**Ventajas:**
- ✅ Añade idiomas sin ALTER TABLE
- ✅ Soporte ilimitado de idiomas
- ✅ Fácil de mantener y escalar

### Tablas Principales

| Tabla | Descripción | Traducible |
|-------|-------------|------------|
| `admin_profiles` | Perfiles de administradores | No |
| `translations` | Sistema universal de traducciones | - |
| `contact_messages` | Mensajes de contacto | No |
| `site_content` | Contenido editable del sitio | Sí |
| `categories` | Categorías de proyectos/productos | Sí |
| `projects` | Portfolio de trabajos | Sí |
| `products` | Catálogo de productos | Sí |
| `media_files` | Gestión de archivos | No |
| `reminders` | Recordatorios | No |
| `whatsapp_config` | Configuración WhatsApp | No |

### Storage Buckets

- `categories` - Imágenes de categorías
- `projects` - Imágenes de proyectos
- `products` - Imágenes de productos
- `media` - Archivos generales

### Seguridad

- ✅ Row Level Security (RLS) activado
- ✅ Políticas específicas por rol
- ✅ Triggers automáticos
- ✅ Storage con acceso controlado
- ✅ Solo autenticación de administradores

## 🔧 Modo Demo

Si no configuras las credenciales de Supabase, la aplicación funciona en **modo demo** con datos de ejemplo (mock data). Esto es útil para:

- Desarrollo sin backend
- Testing de UI
- Demostraciones

Para activar el modo producción, simplemente configura las variables de entorno correctamente.

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia web pública (puerto 5173)
npm run dev:web          # Inicia web pública
npm run dev:admin        # Inicia panel admin (puerto 5174)

# Construcción
npm run build            # Build de ambas apps
npm run build:web        # Build solo web
npm run build:admin      # Build solo admin

# Otros
npm run lint             # Ejecutar ESLint
npm run preview          # Preview del build
```

## 📚 Documentación Adicional

- [🔄 Guía de Migración a Nuevo Schema](docs/MIGRATION_GUIDE.md)
- [📊 Resumen del Rediseño de Base de Datos](docs/DATABASE_REDESIGN.md)
- [⚙️ Guía de Configuración de Supabase](docs/SUPABASE_SETUP_GUIDE.md)
- [🛠️ Documentación del Panel Admin](docs/admin/ADMIN_README.md)
- [🔗 Guía de Integración](docs/admin/INTEGRACION.md)

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Variables de entorno en producción

Asegúrate de configurar estas variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles

---

Desarrollado con ❤️ para Beltrame Herrería Artesanal

