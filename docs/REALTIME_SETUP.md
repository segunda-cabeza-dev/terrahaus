# 🔄 Configuración de Supabase Realtime

## ¿Qué es Realtime?

Supabase Realtime permite escuchar cambios en la base de datos en tiempo real mediante WebSockets. Cuando alguien crea, actualiza o elimina un proyecto/categoría en el admin, **todos los usuarios conectados verán el cambio instantáneamente** sin necesidad de refrescar la página.

## ✅ Beneficios

- **Instantáneo**: Cambios visibles en < 1 segundo (antes 30 segundos)
- **Sin polling**: No se hacen requests repetitivos a la BD
- **Eficiente**: Solo se invalida el caché cuando hay cambios reales
- **Multi-usuario**: Todos los usuarios ven los cambios al mismo tiempo

## 🔧 Configuración Requerida

### Paso 1: Habilitar Realtime en Supabase Dashboard

1. Ve a tu proyecto en [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. En el menú lateral, ve a **Database** → **Replication**
3. Busca las siguientes tablas y habilita Realtime para cada una:

#### Tabla: `projects`
- ✅ Enable Realtime
- Eventos a escuchar: `INSERT`, `UPDATE`, `DELETE`

#### Tabla: `categories`
- ✅ Enable Realtime
- Eventos a escuchar: `INSERT`, `UPDATE`, `DELETE`

#### Tabla: `translations`
- ✅ Enable Realtime
- Eventos a escuchar: `INSERT`, `UPDATE`, `DELETE`

### Paso 2: Verificar la configuración

1. Abre la consola del navegador en tu app web
2. Deberías ver el mensaje: `✅ Realtime activo - Caché se actualizará automáticamente`
3. En el admin, elimina un proyecto
4. En la web (sin refrescar), verás en consola: `🔄 Cambio detectado en projects: DELETE`
5. La página se actualizará automáticamente mostrando el cambio

## 🚀 Cómo funciona

```typescript
// El servicio se suscribe automáticamente a cambios
supabase
  .channel('projects_cache_invalidation')
  .on('postgres_changes', { table: 'projects' }, () => {
    console.log('🔄 Cambio detectado')
    projectsService.clearCache() // Invalida caché
    // Los componentes refetch automáticamente
  })
```

## 📊 Flujo completo

1. **Admin elimina proyecto** → BD actualizada
2. **Supabase Realtime** → Detecta cambio y notifica via WebSocket
3. **Web escucha cambio** → Invalida caché automáticamente
4. **Componente detecta caché vacío** → Hace fetch de datos frescos
5. **Usuario ve cambio** → Instantáneo, sin refrescar

## 🔍 Troubleshooting

### No veo el mensaje de Realtime activo

```bash
# Verifica que las credenciales sean correctas
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### Realtime no funciona

1. Verifica que las tablas tengan Realtime habilitado en Supabase Dashboard
2. Verifica que tu plan de Supabase incluya Realtime (el plan gratuito lo incluye)
3. Revisa la consola del navegador para errores de conexión

### Forzar inicialización manual

```typescript
import { projectsService } from '@beltrame/shared'

// En caso de que no se inicialice automáticamente
projectsService.initializeRealtime()
```

## 📝 Notas

- Realtime se inicializa automáticamente 1 segundo después de cargar el módulo
- La suscripción es compartida por toda la aplicación (singleton)
- Si cierras la pestaña, la suscripción se limpia automáticamente
- El sistema sigue funcionando sin Realtime (fallback a caché de 30s)

## 🔐 Seguridad

Las políticas RLS (Row Level Security) de Supabase se aplican también a Realtime:
- Los usuarios anónimos solo ven cambios en registros públicos (`is_active = true`)
- Los admins ven todos los cambios

## 💡 Optimizaciones futuras

- Invalidar solo el caché específico (por categoría/proyecto) en lugar de todo
- Implementar optimistic updates en el admin
- Agregar indicador visual de "actualizando datos..." cuando se detecta un cambio
