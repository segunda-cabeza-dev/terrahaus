# 🎮 Modo DEMO - Panel de Administración

## ✅ ¡El panel ya está listo para usar!

El sistema de administración está configurado para funcionar **sin necesidad de Supabase**, usando datos de ejemplo (mock data).

---

## 🚀 Acceso al Panel

### URL Local
```
http://localhost:5176/admin/login
```

### Credenciales de Acceso (Modo Demo)
```
Email: admin@demo.com
Contraseña: cualquier texto (mínimo 6 caracteres)
```

Por ejemplo:
- Email: `admin@demo.com`
- Contraseña: `123456` o `password`

---

## 📊 Datos de Ejemplo Disponibles

### 👥 Usuarios (3)
- **Admin Demo** (dueño) - admin@demo.com
- **Manager Demo** (admin) - manager@demo.com  
- **Empleado Demo** (empleado) - empleado@demo.com

### 📧 Contactos (4 mensajes)
- 2 sin leer
- 2 ya leídos
- Con nombres, emails, teléfonos y mensajes de ejemplo

### 📝 Contenido del Sitio (8 elementos)
Organizados por secciones:
- **inicio**: Título principal, subtítulo, descripción
- **quienes-somos**: Título, descripción con HTML
- **servicios**: Construcción integral
- **contacto**: Título

### 🖼️ Imágenes (4 ejemplos)
- Imágenes de proyectos y oficinas
- Usando imágenes de Unsplash de demostración

---

## 🎯 Funcionalidades Disponibles

### ✅ Completamente Funcionales
- ✅ **Login** - Autenticación simulada
- ✅ **Dashboard** - Vista general del sistema
- ✅ **Visualizar Usuarios** - Ver lista de usuarios con roles
- ✅ **Visualizar Contactos** - Ver mensajes recibidos con filtros
- ✅ **Visualizar Contenido** - Ver y editar contenido por secciones
- ✅ **Visualizar Imágenes** - Galería de imágenes de ejemplo
- ✅ **Navegación** - Sidebar y rutas protegidas
- ✅ **Roles** - Restricciones según el rol del usuario

### ⚠️ Limitadas en Modo Demo
- ⚠️ **Guardar cambios** - Los cambios no persisten (solo en memoria)
- ⚠️ **Subir imágenes** - Deshabilitado en modo demo
- ⚠️ **Crear/Eliminar** - Operaciones deshabilitadas en modo demo

---

## 📱 Cómo Navegar

1. **Inicia sesión** en `/admin/login`
2. Llegarás al **Dashboard** con cards de cada módulo
3. **Usa el sidebar** para navegar entre secciones:
   - 📊 Dashboard
   - 👥 Usuarios
   - 📝 Contenido
   - 🖼️ Imágenes
   - 📧 Contactos
4. **Prueba las funcionalidades** (los cambios no se guardan)

---

## 🔄 Cambiar a Modo Producción

Cuando quieras usar datos reales de Supabase:

1. **Configura Supabase** siguiendo `QUICKSTART.md`
2. **Edita `.env`** con tus credenciales reales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-real
   ```
3. **Reinicia el servidor**: `npm run dev`
4. ¡Listo! El sistema usará Supabase automáticamente

---

## 💡 Indicadores del Modo Demo

En todas las páginas verás un banner azul que indica:
```
🎮 Modo DEMO - Mostrando [datos/usuarios/contactos] de ejemplo
```

Este banner desaparecerá automáticamente cuando configures Supabase.

---

## 🎨 Características Visuales

- ✅ Diseño responsive (móvil y escritorio)
- ✅ Sidebar con navegación persistente
- ✅ Cards informativos
- ✅ Badges de roles con colores
- ✅ Filtros en contactos (todos/leídos/no leídos)
- ✅ Tabs en contenido (por sección)
- ✅ Galería de imágenes
- ✅ Confirmaciones para acciones destructivas
- ✅ Toast notifications

---

## 📸 Páginas Disponibles

### 1. Login (`/admin/login`)
- Formulario de autenticación
- Banner con credenciales de demo
- Validación de campos

### 2. Dashboard (`/admin/dashboard`)
- 4 cards de navegación rápida
- Información del usuario actual
- Filtrado por roles

### 3. Usuarios (`/admin/usuarios`)
- Lista de usuarios con badges de rol
- Botones de editar/eliminar
- Solo visible para dueño y admin

### 4. Contenido (`/admin/contenido`)
- Contenido organizado por tabs (secciones)
- Editor inline para textos
- Textarea para HTML
- Botón guardar por elemento

### 5. Imágenes (`/admin/imagenes`)
- Galería con miniaturas
- Botón copiar URL
- Ver imagen completa
- Información de tamaño y fecha

### 6. Contactos (`/admin/contactos`)
- Lista de mensajes
- Filtros: todos/leídos/no leídos
- Marcar como leído/no leído
- Enlaces directos a email/teléfono
- Badge "Nuevo" para no leídos

---

## 🛠️ Solución de Problemas

### El servidor no inicia
```bash
# Detener procesos anteriores
lsof -ti:5176 | xargs kill -9

# Reiniciar
npm run dev
```

### No puedo acceder al login
- Verifica la URL: `http://localhost:5176/admin/login`
- El puerto puede cambiar si 5176 está en uso

### Los cambios no se guardan
- ✅ **Esto es normal en modo demo**
- Los cambios solo existen en memoria
- Para persistencia real, configura Supabase

### "Page not found"
- Las rutas del admin son:
  - `/admin/login`
  - `/admin/dashboard`
  - `/admin/usuarios`
  - `/admin/contenido`
  - `/admin/imagenes`
  - `/admin/contactos`

---

## 🎉 ¡Disfruta Explorando!

El panel está completamente funcional para que puedas:
- Ver cómo funciona el sistema
- Probar la interfaz
- Entender el flujo de trabajo
- Decidir si necesitas modificar algo antes de configurar Supabase

**Cuando estés listo para usar datos reales**, solo necesitas seguir el `QUICKSTART.md` para configurar Supabase.

---

## 📚 Próximos Pasos

1. ✅ **Explora el panel** - Ya está funcionando
2. 📖 **Lee la documentación** - `ADMIN_README.md` y `INTEGRACION.md`
3. 🗄️ **Configura Supabase** - Cuando quieras datos persistentes
4. 🔗 **Integra con tu sitio** - Usa el contenido dinámico en tus páginas

---

**¡El panel de administración está listo para usar sin base de datos! 🚀**
