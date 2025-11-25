# 📁 Estructura del Sistema de Administración

```
beltrame-web/
│
├── 📄 ADMIN_README.md              # Documentación completa del sistema
├── 📄 QUICKSTART.md                # Guía de inicio rápido
├── 📄 supabase-setup.sql           # Script SQL para configurar Supabase
├── 📄 .env.example                 # Plantilla de variables de entorno
├── 📄 .env                         # Variables de entorno (crear este archivo)
│
├── src/
│   ├── pages/
│   │   ├── admin/                  # 🔐 Páginas de administración
│   │   │   ├── Login.tsx           # Página de inicio de sesión
│   │   │   ├── Dashboard.tsx       # Dashboard principal
│   │   │   ├── Usuarios.tsx        # Gestión de usuarios y roles
│   │   │   ├── Contenido.tsx       # Editor de contenido del sitio
│   │   │   ├── Imagenes.tsx        # Gestor de imágenes
│   │   │   └── Contactos.tsx       # Visualizador de formularios
│   │   │
│   │   └── [otras páginas...]      # Páginas públicas del sitio
│   │
│   ├── components/
│   │   ├── AdminLayout.tsx         # Layout con sidebar para admin
│   │   ├── ProtectedRoute.tsx      # Componente de protección de rutas
│   │   └── ui/                     # Componentes UI reutilizables
│   │
│   ├── hooks/
│   │   ├── use-auth.ts             # Hook personalizado para autenticación
│   │   └── use-toast.ts            # Hook para notificaciones
│   │
│   ├── lib/
│   │   ├── supabase.ts             # Configuración y servicios de Supabase
│   │   └── utils.ts                # Utilidades generales
│   │
│   └── App.tsx                     # Configuración de rutas principal
│
└── public/
    └── assets/
        └── images/                 # Imágenes estáticas locales
```

## 🎨 Sistema de Componentes

### Páginas de Administración

```
┌─────────────────────────────────────────────────┐
│  🔐 Login.tsx                                   │
│  - Formulario de autenticación                  │
│  - Validación de credenciales                   │
│  - Redirección al dashboard                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📊 Dashboard.tsx                               │
│  - Vista general del sistema                    │
│  - Cards con acceso a módulos                   │
│  - Información del usuario actual               │
│  - Filtrado por roles                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  👥 Usuarios.tsx                                │
│  - Lista de usuarios con roles                  │
│  - Formulario de creación/edición               │
│  - Badges de roles con colores                  │
│  - Confirmación para eliminar                   │
│  - Solo para admin/dueño                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📝 Contenido.tsx                               │
│  - Edición de textos del sitio                  │
│  - Organizado por secciones (tabs)              │
│  - Soporte para texto plano y HTML              │
│  - Guardado individual por campo                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  🖼️  Imagenes.tsx                               │
│  - Upload de imágenes al storage                │
│  - Vista de galería con miniaturas              │
│  - Copiar URL al portapapeles                   │
│  - Eliminación con confirmación                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📧 Contactos.tsx                               │
│  - Lista de mensajes recibidos                  │
│  - Filtros: todos/leídos/no leídos              │
│  - Marcar como leído/no leído                   │
│  - Enlaces directos a email/teléfono            │
└─────────────────────────────────────────────────┘
```

## 🔐 Sistema de Roles y Permisos

```
┌─────────────────────────────────────────────────┐
│  DUEÑO (Acceso Total)                           │
├─────────────────────────────────────────────────┤
│  ✓ Gestión de usuarios                          │
│  ✓ Gestión de contenido                         │
│  ✓ Gestión de imágenes                          │
│  ✓ Visualización de contactos                   │
│  ✓ Todas las funcionalidades                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ADMIN (Administrador)                          │
├─────────────────────────────────────────────────┤
│  ✓ Gestión de usuarios                          │
│  ✓ Gestión de contenido                         │
│  ✓ Gestión de imágenes                          │
│  ✓ Visualización de contactos                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  EMPLEADO                                       │
├─────────────────────────────────────────────────┤
│  ✗ Gestión de usuarios                          │
│  ✓ Gestión de contenido                         │
│  ✓ Gestión de imágenes                          │
│  ✓ Visualización de contactos                   │
└─────────────────────────────────────────────────┘
```

## 🗄️ Base de Datos (Supabase)

```
┌─────────────────────────────────────────────────┐
│  Tabla: profiles                                │
├─────────────────────────────────────────────────┤
│  - id (UUID, FK → auth.users)                   │
│  - email (TEXT)                                 │
│  - nombre (TEXT)                                │
│  - role (TEXT: dueño/admin/empleado)            │
│  - created_at (TIMESTAMP)                       │
│  - updated_at (TIMESTAMP)                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Tabla: site_content                            │
├─────────────────────────────────────────────────┤
│  - id (SERIAL)                                  │
│  - seccion (TEXT)                               │
│  - clave (TEXT)                                 │
│  - valor (TEXT)                                 │
│  - tipo (TEXT: texto/imagen/html)               │
│  - updated_at (TIMESTAMP)                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Tabla: contact_forms                           │
├─────────────────────────────────────────────────┤
│  - id (SERIAL)                                  │
│  - nombre (TEXT)                                │
│  - email (TEXT)                                 │
│  - telefono (TEXT, opcional)                    │
│  - mensaje (TEXT)                               │
│  - leido (BOOLEAN)                              │
│  - created_at (TIMESTAMP)                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Storage: images (bucket)                       │
├─────────────────────────────────────────────────┤
│  - Bucket público                               │
│  - Upload permitido para autenticados           │
│  - Visualización pública                        │
│  - Eliminación para autenticados                │
└─────────────────────────────────────────────────┘
```

## 🛣️ Rutas del Sistema

```
Públicas:
/                           → Página de inicio
/proyectos                  → Lista de proyectos
/quienes-somos              → Información de la empresa
/contacto                   → Formulario de contacto

Administración:
/admin/login                → Inicio de sesión (público)
/admin/dashboard            → Dashboard principal (protegido)
/admin/usuarios             → Gestión de usuarios (admin/dueño)
/admin/contenido            → Gestor de contenido (protegido)
/admin/imagenes             → Gestor de imágenes (protegido)
/admin/contactos            → Formularios recibidos (protegido)
```

## 🔄 Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. Supabase Auth valida
   ↓
3. Se obtiene el perfil del usuario
   ↓
4. Se verifica el rol
   ↓
5. Se redirige al dashboard
   ↓
6. El sidebar muestra opciones según el rol
   ↓
7. ProtectedRoute valida acceso a cada página
```

## 📦 Dependencias Principales

```json
{
  "@supabase/supabase-js": "Cliente de Supabase",
  "react-router-dom": "Manejo de rutas",
  "lucide-react": "Iconos",
  "@radix-ui/*": "Componentes UI accesibles",
  "tailwindcss": "Estilos"
}
```

## 🎯 Características Clave

✅ **Autenticación segura** con Supabase Auth
✅ **Sistema de roles** jerárquico (dueño > admin > empleado)
✅ **Row Level Security** en todas las tablas
✅ **Protected Routes** en el frontend
✅ **Upload de imágenes** al storage de Supabase
✅ **Gestión de contenido** dinámico por secciones
✅ **Formularios de contacto** con sistema de leídos
✅ **UI moderna** con Tailwind y Radix UI
✅ **Responsive design** adaptable a móviles
✅ **Toast notifications** para feedback al usuario

## 🚀 Próximas Características

🔜 Recuperación de contraseña
🔜 Edición de perfil de usuario
🔜 Dashboard con estadísticas
🔜 Editor WYSIWYG para HTML
🔜 Optimización automática de imágenes
🔜 Exportación de contactos a CSV
🔜 Sistema de notificaciones en tiempo real
🔜 Historial de cambios en contenido
