# 🏗️ Guía de Migración a Workspaces

## ✅ ¡Migración Completada!

Tu proyecto ahora está organizado en **workspaces independientes**, separando claramente el sitio web público del panel de administración.

---

## 📁 Nueva Estructura

```
beltrame-web/
├── apps/
│   ├── web/              # 🌐 Sitio Web Público (Puerto 5173)
│   │   ├── src/
│   │   │   ├── pages/          # Páginas públicas
│   │   │   ├── components/     # Header, Footer, etc.
│   │   │   ├── assets/         # Assets del sitio
│   │   │   ├── App.tsx         # App del sitio web
│   │   │   └── main.tsx
│   │   ├── public/             # Imágenes y recursos estáticos
│   │   ├── package.json        # Dependencias del sitio web
│   │   └── vite.config.ts
│   │
│   └── admin/            # 🔐 Panel Admin (Puerto 5174)
│       ├── src/
│       │   ├── pages/
│       │   │   └── admin/      # Páginas del admin
│       │   ├── components/     # AdminLayout, ProtectedRoute
│       │   ├── hooks/          # use-auth
│       │   ├── App.tsx         # App del admin
│       │   └── main.tsx
│       ├── package.json        # Dependencias del admin
│       └── vite.config.ts
│
├── packages/
│   └── shared/           # 📚 Código Compartido
│       ├── src/
│       │   ├── components/
│       │   │   └── ui/         # Componentes UI (Button, Card, etc.)
│       │   ├── lib/            # supabase.ts, utils.ts
│       │   ├── hooks/          # use-toast.ts
│       │   └── index.ts
│       └── package.json
│
├── docs/                 # 📖 Documentación
│   ├── ADMIN_README.md
│   ├── QUICKSTART.md
│   ├── MODO_DEMO.md
│   ├── INTEGRACION.md
│   ├── ESTRUCTURA.md
│   └── RESUMEN.md
│
├── package.json          # Configuración de workspaces
└── README.md             # Documentación principal
```

---

## 🚀 Comandos Principales

### Desarrollo

```bash
# Sitio web público (Puerto 5173)
npm run dev:web

# Panel de administración (Puerto 5174)
npm run dev:admin

# Ambos simultáneamente
npm run dev:all
```

### Build

```bash
# Build de todo
npm run build

# Build individual
npm run build:web
npm run build:admin
```

### Preview

```bash
npm run preview:web
npm run preview:admin
```

---

## 📦 Importaciones

### Antes (Estructura Antigua)

```typescript
// Componentes UI
import { Button } from '../../components/ui/button'

// Supabase
import { supabase } from '../../lib/supabase'

// Hooks
import { useToast } from '../../hooks/use-toast'
```

### Después (Workspaces)

```typescript
// Componentes UI
import { Button } from '@beltrame/shared/ui/button'

// Supabase y tipos
import { supabase, type Profile, USE_MOCK_DATA } from '@beltrame/shared'

// Hooks
import { useToast } from '@beltrame/shared'
```

---

## 🎯 Ventajas de la Nueva Estructura

### ✅ Separación Clara
- **Web**: Solo código del sitio público
- **Admin**: Solo código del panel de administración
- **Shared**: Código reutilizable entre ambos

### ✅ Desarrollo Independiente
- Inicia solo lo que necesitas trabajar
- Hot reload más rápido (solo recarga el workspace activo)
- Sin interferencias entre proyectos

### ✅ Deploy Independiente
- Despliega el sitio web sin tocar el admin
- Despliega el admin sin afectar el sitio web
- Optimiza builds por separado

### ✅ Mejor Organización
- Código más limpio y mantenible
- Fácil encontrar archivos
- Escalabilidad mejorada

### ✅ Puertos Separados
- **Web**: `http://localhost:5173`
- **Admin**: `http://localhost:5174`
- Sin conflictos de rutas

---

## 🔧 Configuración de TypeScript

Cada workspace tiene su propia configuración de TypeScript, pero comparten tipos del workspace `shared`.

### Path Aliases

Los workspaces están configurados para resolver automáticamente las importaciones de `@beltrame/shared`.

---

## 🌐 URLs de Acceso

### Sitio Web Público
```
http://localhost:5173/
http://localhost:5173/proyectos
http://localhost:5173/quienes-somos
http://localhost:5173/contacto
```

### Panel de Administración
```
http://localhost:5174/login
http://localhost:5174/dashboard
http://localhost:5174/usuarios
http://localhost:5174/contenido
http://localhost:5174/imagenes
http://localhost:5174/contactos
```

---

## 📝 Notas Importantes

### 1. Variables de Entorno

El archivo `.env` está en la raíz y es compartido por ambos workspaces:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 2. Node Modules

Las dependencias se instalan automáticamente en todos los workspaces con:
```bash
npm install
```

### 3. Shared Package

El package `@beltrame/shared` contiene:
- ✅ Componentes UI (Button, Card, Input, etc.)
- ✅ Cliente de Supabase
- ✅ Hooks compartidos (useToast, etc.)
- ✅ Utilidades (cn, etc.)

### 4. Desarrollo Simultáneo

Para trabajar en ambos proyectos:
```bash
# Terminal 1
npm run dev:web

# Terminal 2  
npm run dev:admin
```

O usa `npm run dev:all` (requiere `concurrently`):
```bash
npm install -D concurrently
```

---

## 🔄 Migración de Código Existente

Si necesitas agregar nuevo código:

### Código del Sitio Web → `apps/web/src/`
```
Páginas públicas
Componentes del sitio (Header, Footer)
Estilos específicos del sitio
```

### Código del Admin → `apps/admin/src/`
```
Páginas del panel admin
Componentes del admin (AdminLayout)
Hooks del admin (use-auth)
```

### Código Compartido → `packages/shared/src/`
```
Componentes UI reutilizables
Cliente de Supabase
Hooks compartidos
Utilidades comunes
```

---

## 🛠️ Solución de Problemas

### Error: No se encuentra '@beltrame/shared'

```bash
npm install
```

### Error: Puerto en uso

Cambia el puerto en `vite.config.ts` del workspace correspondiente:

```typescript
export default defineConfig({
  server: {
    port: 5175  // Cambiar puerto
  }
})
```

### Imports no funcionan

Verifica que el import sea correcto:
```typescript
// ✅ Correcto
import { Button } from '@beltrame/shared/ui/button'

// ❌ Incorrecto
import { Button } from '../../components/ui/button'
```

---

## 📚 Documentación

- **Admin**: `docs/ADMIN_README.md`
- **Modo Demo**: `docs/MODO_DEMO.md`
- **Integración**: `docs/INTEGRACION.md`
- **Estructura**: `docs/ESTRUCTURA.md`

---

## 🎉 Próximos Pasos

1. ✅ **Inicia el desarrollo**
   ```bash
   npm run dev:web    # o dev:admin
   ```

2. ✅ **Prueba ambas apps**
   - Web: http://localhost:5173
   - Admin: http://localhost:5174

3. ✅ **Lee la documentación**
   - Revisa `docs/` para guías específicas

4. ✅ **Desarrolla con confianza**
   - Los cambios en un workspace no afectan al otro
   - Código compartido en `packages/shared`

---

## 💡 Tips

- Usa **VS Code Workspaces** para abrir múltiples carpetas
- Agrega **scripts personalizados** en `package.json` raíz
- Mantén código **realmente compartido** en `packages/shared`
- No dupliques código entre workspaces

---

**¡Tu proyecto ahora está mejor organizado y listo para escalar! 🚀**
