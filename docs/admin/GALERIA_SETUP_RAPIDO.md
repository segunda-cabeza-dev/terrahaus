# 🚀 Setup Rápido de Galería

## 1️⃣ Configurar Supabase (5 minutos)

### Paso 1: Ir a Supabase Dashboard
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (menú lateral izquierdo)

### Paso 2: Ejecutar SQL
1. Haz clic en **"New Query"**
2. Abre el archivo `docs/supabase-gallery-setup.sql`
3. Copia TODO el contenido
4. Pégalo en el editor de Supabase
5. Haz clic en **"Run"** (botón abajo a la derecha)
6. Espera a que termine (debe decir "Success")

### Paso 3: Verificar Bucket
1. Ve a **Storage** en el menú lateral
2. Deberías ver el bucket **"media"**
3. Verifica que tenga el ícono de 🌐 (público)

## 2️⃣ Variables de Entorno (Ya configuradas ✅)

Ya están configuradas en el proyecto:

```env
VITE_SUPABASE_URL=https://api.segundacabeza.net
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3️⃣ Probar la Galería

### En Desarrollo:
```bash
npm run dev:admin
```

### Ir a la página:
1. Abre http://localhost:5174
2. Login (si es necesario)
3. Ve a **"Galería"** en el menú
4. Arrastra una imagen o haz clic en "+"
5. ¡Listo! La imagen se sube a Supabase

## 🎯 Uso en Otras Páginas

```typescript
import { ProductImageManager } from '@beltrame/shared'
import { useState } from 'react'

function MiComponente() {
  const [images, setImages] = useState<string[]>([])
  
  return (
    <ProductImageManager 
      images={images} 
      onChange={setImages} 
    />
  )
}
```

## 🐛 Si algo no funciona

### Problema: No se suben las imágenes
**Solución:**
1. Verifica que ejecutaste el SQL en Supabase
2. Ve a Storage > media y verifica que existe
3. Revisa la consola del navegador (F12)

### Problema: Error de CORS
**Solución:**
1. Ve a Supabase Dashboard > Project Settings > API
2. En "CORS Settings" agrega: `http://localhost:5174`

### Problema: Las imágenes no se ven
**Solución:**
1. Verifica que el bucket `media` es **público**
2. En Storage > media > Settings > Public access debe estar **ON**

## 📚 Más Información

- **Documentación completa**: `docs/admin/GALERIA_README.md`
- **Resumen del proyecto**: `docs/admin/GALERIA_RESUMEN.md`
- **Ejemplo de uso**: `apps/admin/src/features/galeria/ProductFormExample.tsx`

## ✅ Checklist

- [ ] SQL ejecutado en Supabase
- [ ] Bucket "media" creado y público
- [ ] Admin corriendo con `npm run dev:admin`
- [ ] Página de Galería carga correctamente
- [ ] Puedo arrastrar y soltar imágenes
- [ ] Las imágenes se suben sin errores
- [ ] Puedo eliminar imágenes

---

**¿Todo funcionando? ¡Perfecto! 🎉**
