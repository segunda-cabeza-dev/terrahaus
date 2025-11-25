# 🚀 Inicio Rápido - Sistema de Administración

## Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto esté listo (2-3 minutos)

### 1.2 Ejecutar Script SQL
1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia todo el contenido del archivo `supabase-setup.sql`
3. Pégalo en el editor y haz clic en **Run**
4. Verifica que todas las tablas se crearon correctamente

### 1.3 Crear Bucket de Imágenes
1. Ve a **Storage** en Supabase
2. Crea un nuevo bucket llamado `images`
3. Marca el bucket como **público**
4. Las políticas de seguridad ya están incluidas en el SQL

### 1.4 Obtener Credenciales
1. Ve a **Settings** → **API**
2. Copia:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon/public key** (clave larga que empieza con eyJ...)

## Paso 2: Configurar el Proyecto

### 2.1 Crear Archivo .env
```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

### 2.2 Editar .env
Abre el archivo `.env` y reemplaza con tus credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2.3 Instalar Dependencias (si es necesario)
```bash
npm install
```

## Paso 3: Crear Primer Usuario

### 3.1 Desde Supabase Dashboard
1. Ve a **Authentication** → **Users**
2. Haz clic en **Add user**
3. Completa:
   - Email: tu@email.com
   - Password: (tu contraseña segura)
   - Auto Confirm User: ✓ (marcado)

### 3.2 Asignar Rol de Dueño
1. Ve a **SQL Editor**
2. Ejecuta:
```sql
UPDATE profiles
SET role = 'dueño', nombre = 'Tu Nombre Completo'
WHERE email = 'tu@email.com';
```

## Paso 4: Iniciar la Aplicación

```bash
npm run dev
```

## Paso 5: Acceder al Admin

1. Abre tu navegador en `http://localhost:5173/admin/login`
2. Ingresa tu email y contraseña
3. ¡Listo! Ya puedes usar el sistema de administración

## 📋 Checklist de Verificación

- [ ] Proyecto de Supabase creado
- [ ] Script SQL ejecutado sin errores
- [ ] Bucket 'images' creado y configurado como público
- [ ] Archivo .env configurado con las credenciales
- [ ] Primer usuario creado en Supabase
- [ ] Rol de 'dueño' asignado al usuario
- [ ] Aplicación corriendo localmente
- [ ] Login funcionando correctamente

## 🎯 Rutas Principales

Una vez dentro del sistema:

- **Dashboard**: `/admin/dashboard`
- **Usuarios**: `/admin/usuarios`
- **Contenido**: `/admin/contenido`
- **Imágenes**: `/admin/imagenes`
- **Contactos**: `/admin/contactos`

## 🔍 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Row Level Security"
- Asegúrate de haber ejecutado todo el script SQL
- Verifica que las políticas RLS estén habilitadas

### No puedo subir imágenes
- Verifica que el bucket 'images' exista
- Asegúrate de que esté marcado como público
- Revisa que las políticas de storage estén configuradas

### No aparece el Dashboard después del login
- Verifica que el usuario tenga un perfil en la tabla `profiles`
- Ejecuta el UPDATE para asignar el rol correcto

## 📚 Documentación Completa

Para más detalles, consulta `ADMIN_README.md`

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas:
1. Revisa los logs del navegador (F12 → Console)
2. Verifica las tablas en Supabase (Table Editor)
3. Consulta la documentación de Supabase: https://supabase.com/docs
