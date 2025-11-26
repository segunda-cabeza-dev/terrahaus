# Sistema de Galería de Imágenes

## 📋 Descripción

Sistema completo para gestionar imágenes en el panel de administración, con soporte para drag & drop, subida múltiple, y gestión de imágenes de productos.

## 🏗️ Arquitectura

### 1. **Servicio de Medios** (`media.service.ts`)
Maneja toda la interacción con Supabase Storage.

```typescript
import { mediaService } from '@beltrame/shared'

// Subir archivo
const result = await mediaService.uploadFile(file, 'images')
// result = { url: string, path: string, error?: string }

// Eliminar por path
await mediaService.deleteFile(path)

// Eliminar por URL
await mediaService.deleteFileByUrl(url)

// Obtener URL pública
const url = mediaService.getPublicUrl(path)
```

**Características:**
- Renombrado automático con timestamp para evitar colisiones
- Validación de archivos (tipo y tamaño)
- Gestión de errores
- Soporte para carpetas dentro del bucket

### 2. **Componente ProductImageManager**
Componente UI reutilizable para gestionar imágenes de productos.

```typescript
import { ProductImageManager } from '@beltrame/shared'

<ProductImageManager 
  images={images} 
  onChange={(newImages) => setImages(newImages)} 
/>
```

**Props:**
- `images`: `string[]` - Array de URLs de imágenes
- `onChange`: `(newImages: string[]) => void` - Callback cuando cambian las imágenes

**Características:**
- ✅ Drag & Drop de múltiples archivos
- ✅ Primera imagen destacada (más grande)
- ✅ Grid adaptativo para las demás imágenes
- ✅ Botón de eliminar (X) en cada imagen
- ✅ Validación de tipo y tamaño
- ✅ Notificaciones con toast
- ✅ Estado de carga con spinner
- ✅ Diseño responsive

**Diseño Visual:**
```
┌─────────────────────────┬──────────┐
│                         │  Img 2   │
│   Imagen Principal      ├──────────┤
│   (Primera imagen)      │  Img 3   │
│                         ├──────────┤
│                         │    +     │
└─────────────────────────┴──────────┘
```

### 3. **Página de Galería** (`Galeria.tsx`)
Implementación completa de la galería en el admin.

**Características:**
- Lista todas las imágenes subidas
- Muestra metadata (nombre, tamaño, fecha)
- Permite eliminar imágenes
- Vista previa en tabla
- Estado vacío cuando no hay imágenes

## 🗄️ Base de Datos

### Configuración de Supabase Storage

1. **Bucket `media`**: Bucket público para almacenar todas las imágenes
2. **Políticas de acceso**:
   - Lectura pública (cualquiera puede ver)
   - Escritura solo para autenticados (solo usuarios logueados pueden subir/eliminar)

### Tabla `media_files` (Opcional)
Almacena metadata de las imágenes:

```sql
CREATE TABLE media_files (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'image/jpeg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Ejecutar Setup
```bash
# Ejecuta el SQL en Supabase SQL Editor
cat docs/supabase-gallery-setup.sql
```

## 📦 Instalación

Ya está todo integrado en el proyecto. Solo necesitas:

1. **Variables de entorno** (ya configuradas):
```env
VITE_SUPABASE_URL=https://api.segundacabeza.net
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Ejecutar el SQL** en Supabase para crear bucket y tablas:
   - Ve a Supabase Dashboard > SQL Editor
   - Copia el contenido de `docs/supabase-gallery-setup.sql`
   - Ejecuta

3. **Verificar el bucket**:
   - Ve a Supabase Dashboard > Storage
   - Debe aparecer el bucket `media`
   - Debe estar marcado como "Public"

## 🚀 Uso

### En la Página de Galería

1. **Subir imágenes**:
   - Arrastra archivos sobre el área punteada, O
   - Haz clic en el botón "+" para seleccionar archivos

2. **Ver imágenes**:
   - Todas las imágenes aparecen en una tabla
   - Muestra vista previa, nombre, tamaño y fecha

3. **Eliminar imágenes**:
   - Haz clic en el icono de basurero (🗑️)
   - La imagen se elimina del storage y de la lista

### En Otros Componentes (Productos, etc.)

```typescript
import { ProductImageManager } from '@beltrame/shared'
import { useState } from 'react'

function ProductForm() {
  const [images, setImages] = useState<string[]>([])

  return (
    <div>
      <h3>Imágenes del Producto</h3>
      <ProductImageManager 
        images={images} 
        onChange={setImages} 
      />
      
      {/* Guardar images en la base de datos */}
      <button onClick={() => saveProduct({ images })}>
        Guardar Producto
      </button>
    </div>
  )
}
```

## 🎨 Validaciones

El componente valida automáticamente:

- ✅ **Tipo de archivo**: Solo acepta imágenes (image/*)
- ✅ **Tamaño máximo**: 5MB por archivo
- ✅ **Notificaciones**: Toast para éxitos y errores

## 📱 Responsive

El componente es completamente responsive:

- **Desktop**: Grid de 3 columnas con imagen principal grande
- **Tablet**: Grid adaptado a 2 columnas
- **Mobile**: Columna única con imagen principal destacada

## 🔧 Personalización

### Cambiar el bucket
```typescript
// En media.service.ts
const BUCKET_NAME = 'media' // Cambia esto
```

### Cambiar tamaño máximo
```typescript
// En ProductImageManager.tsx
if (file.size > 5 * 1024 * 1024) { // 5MB
  // Cambia el número para ajustar el límite
}
```

### Cambiar carpeta de destino
```typescript
// Al llamar al servicio
mediaService.uploadFile(file, 'imagenes-productos') // En vez de 'images'
```

## 🐛 Debugging

### Las imágenes no se suben
1. Verifica que el bucket `media` existe en Supabase Storage
2. Verifica que el bucket es público
3. Verifica las políticas de acceso
4. Revisa la consola del navegador para ver errores

### Las imágenes no se muestran
1. Verifica que las URLs comienzan con `https://api.segundacabeza.net/storage/v1/object/public/media/`
2. Verifica que el bucket es público
3. Intenta abrir la URL directamente en el navegador

### Error de CORS
1. Ve a Supabase Dashboard > Storage > Settings
2. Agrega tu dominio a la lista de CORS permitidos

## 📊 Modo Demo

Actualmente el sistema funciona en **modo DEMO** con imágenes de Unsplash.

Para conectar con Supabase real:
1. Ejecuta el SQL de setup en Supabase
2. El sistema detectará automáticamente la conexión
3. Las nuevas imágenes se subirán a Supabase Storage

## 🔐 Seguridad

- ✅ Solo usuarios autenticados pueden subir/eliminar
- ✅ Lectura pública de imágenes (necesario para mostrarlas en la web)
- ✅ Validación de tipo y tamaño en el cliente
- ✅ Nombres únicos con timestamp

### Mejoras recomendadas para producción:
- Validación de tipo en el servidor
- Compresión de imágenes antes de subir
- Límite de imágenes por usuario
- Escaneo de malware
- CDN para optimizar entrega

## 📚 Recursos

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Drag & Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [React File Upload](https://react.dev/reference/react-dom/components/input#reading-the-files-on-the-client)
