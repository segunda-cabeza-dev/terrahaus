# 🚀 Guía de Configuración de Supabase para Beltrame Web

Esta guía te ayudará a configurar completamente tu backend con Supabase.

## 📋 Tabla de Contenidos

1. [Crear Proyecto en Supabase](#1-crear-proyecto-en-supabase)
2. [Configurar Variables de Entorno](#2-configurar-variables-de-entorno)
3. [Ejecutar Script de Base de Datos](#3-ejecutar-script-de-base-de-datos)
4. [Configurar Storage](#4-configurar-storage)
5. [Crear Primer Usuario](#5-crear-primer-usuario)
6. [Verificar la Instalación](#6-verificar-la-instalación)

---

## 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en **"New Project"**
4. Completa los datos:
   - **Name**: `beltrame-web` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Elige la región más cercana a tus usuarios
   - **Pricing Plan**: Puedes empezar con el plan gratuito
5. Haz clic en **"Create new project"**
6. Espera 1-2 minutos mientras se crea el proyecto

---

## 2. Configurar Variables de Entorno

### Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API** en el submenú
3. Encontrarás dos valores importantes:
   - **Project URL**: algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: una clave larga que empieza con `eyJ...`

### Configurar archivos .env

Actualiza los siguientes archivos con tus credenciales:

**1. `/beltrame-web/.env`**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**2. `/beltrame-web/apps/web/.env`**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**3. `/beltrame-web/apps/admin/.env`**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> ⚠️ **Importante**: Reemplaza `https://tu-proyecto.supabase.co` con tu URL real y `tu-anon-key-aqui` con tu clave anon real.

---

## 3. Ejecutar Script de Base de Datos

### Opción A: Desde el Dashboard (Recomendado)

1. En tu proyecto de Supabase, ve a **SQL Editor** en el menú lateral
2. Haz clic en **"New query"**
3. Abre el archivo `/docs/supabase-setup-complete.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en **"Run"** (o presiona Ctrl/Cmd + Enter)
7. Espera a que termine la ejecución (puede tardar 10-30 segundos)
8. Deberías ver el mensaje: "Success. No rows returned"

### Opción B: Desde la CLI de Supabase

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Conectar al proyecto
supabase link --project-ref tu-proyecto-ref

# Ejecutar el script
supabase db push
```

### Verificar que se crearon las tablas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver las siguientes tablas:
   - ✅ profiles
   - ✅ contactos
   - ✅ contenido_sitio
   - ✅ categorias
   - ✅ proyectos
   - ✅ archivos_media
   - ✅ productos
   - ✅ recordatorios
   - ✅ whatsapp_config

---

## 4. Configurar Storage

Los buckets de storage ya se crearon con el script SQL, pero verifica que estén activos:

1. Ve a **Storage** en el menú lateral
2. Deberías ver 4 buckets:
   - 📁 `productos` - Para imágenes de productos
   - 📁 `proyectos` - Para imágenes de proyectos
   - 📁 `categorias` - Para imágenes de categorías
   - 📁 `media` - Para archivos generales

### Configurar políticas de acceso público

Si los buckets no son públicos por defecto:

1. Haz clic en cada bucket
2. Ve a **Policies**
3. Haz clic en **"New Policy"**
4. Selecciona **"For full customization"**
5. Agrega las siguientes políticas:

**Para lectura pública:**
```sql
(bucket_id = 'productos')
```

**Para escritura autenticada:**
```sql
(bucket_id = 'productos' AND auth.role() = 'authenticated')
```

Repite para todos los buckets: `proyectos`, `categorias`, `media`

---

## 5. Crear Primer Usuario

### Opción A: Desde el Dashboard

1. Ve a **Authentication** > **Users** en el menú lateral
2. Haz clic en **"Add user"**
3. Selecciona **"Create new user"**
4. Completa:
   - **Email**: tu correo (ej: `admin@beltrame.com`)
   - **Password**: una contraseña segura
   - **Auto Confirm User**: ✅ Activar
5. Haz clic en **"Create user"**

### Actualizar el rol del usuario a "dueño"

1. Ve a **SQL Editor**
2. Ejecuta esta query (reemplaza el email):

```sql
UPDATE public.profiles
SET role = 'dueño'
WHERE email = 'admin@beltrame.com';
```

### Opción B: Desde código (después de iniciar la app)

El usuario se crea automáticamente con el rol "empleado" al registrarse. Luego puedes actualizar el rol desde el admin panel.

---

## 6. Verificar la Instalación

### Test de Conexión

1. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre la consola del navegador (F12)
3. No deberías ver el mensaje: `⚠️ Supabase credentials not found`
4. Si lo ves, verifica tus archivos `.env`

### Test de Base de Datos

1. Ve a la app web: `http://localhost:5173`
2. Llena el formulario de contacto
3. Ve al panel admin: `http://localhost:5174`
4. Inicia sesión con el usuario que creaste
5. Ve a la sección **Contactos**
6. Deberías ver el mensaje que enviaste

### Test de Storage

1. En el panel admin, ve a **Galería** o **Productos**
2. Intenta subir una imagen
3. Debería subirse sin errores
4. Ve a **Storage** en Supabase y verifica que la imagen esté ahí

---

## 🎉 ¡Listo!

Tu backend con Supabase está completamente configurado. Ahora puedes:

- ✅ Crear categorías y proyectos
- ✅ Gestionar productos
- ✅ Recibir mensajes de contacto
- ✅ Subir y gestionar imágenes
- ✅ Gestionar usuarios y permisos
- ✅ Personalizar contenido del sitio

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción | Acceso Público |
|-------|-------------|----------------|
| `profiles` | Perfiles de usuario con roles | No |
| `contactos` | Mensajes del formulario de contacto | No |
| `contenido_sitio` | Textos e imágenes del sitio | Sí (lectura) |
| `categorias` | Categorías de proyectos/productos | Sí (solo activas) |
| `proyectos` | Portfolio de proyectos | Sí (solo activos) |
| `productos` | Catálogo de productos | Sí (solo activos) |
| `archivos_media` | Gestión de archivos subidos | Parcial |
| `recordatorios` | Recordatorios personales | No (solo propios) |
| `whatsapp_config` | Configuración de WhatsApp | Sí (lectura) |

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **dueño** | Acceso total, puede eliminar datos y gestionar usuarios |
| **admin** | Puede crear, editar y ver todo, pero no eliminar |
| **empleado** | Solo puede ver, acceso limitado |

---

## 🔐 Seguridad

- ✅ Row Level Security (RLS) activado en todas las tablas
- ✅ Políticas específicas por rol
- ✅ Triggers automáticos para actualizar timestamps
- ✅ Storage con acceso controlado
- ✅ API protegida con autenticación

---

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente la `anon key` de Supabase
- Asegúrate de que no haya espacios al inicio o final
- Reinicia el servidor de desarrollo

### Error: "No rows returned" al crear usuario
- El usuario se crea automáticamente en `profiles` gracias al trigger
- Si no aparece, ejecuta manualmente:
```sql
INSERT INTO public.profiles (id, email, nombre, role)
VALUES ('user-id-here', 'email@example.com', 'Nombre', 'empleado');
```

### Error al subir imágenes
- Verifica que los buckets existan en Storage
- Revisa las políticas de acceso
- Asegúrate de estar autenticado

### No puedo ver las tablas
- Espera 1-2 minutos después de ejecutar el script
- Refresca la página del dashboard
- Verifica que no haya errores en SQL Editor

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage en Supabase](https://supabase.com/docs/guides/storage)
- [Auth en Supabase](https://supabase.com/docs/guides/auth)

---

## 🔄 Próximos Pasos

1. **Migrar datos existentes** (si los tienes)
2. **Configurar emails transaccionales** (opcional)
3. **Configurar webhooks** (opcional)
4. **Implementar backup automático** (recomendado)
5. **Monitorear uso y límites** del plan gratuito

---

¿Necesitas ayuda? Revisa los logs en la consola o contacta al equipo de desarrollo.
