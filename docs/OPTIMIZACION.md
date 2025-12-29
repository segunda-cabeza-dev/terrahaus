# Guía de Optimización de Imágenes y Assets

## 📋 Resumen de Optimizaciones Implementadas

### 1. Lazy Loading de Páginas
- Todas las páginas ahora se cargan bajo demanda usando `React.lazy()`
- Reduce el bundle inicial significativamente
- Muestra un spinner mientras carga cada página

### 2. Componente OptimizedImage
- Lazy loading nativo con Intersection Observer
- Soporte automático para WebP con fallback a JPG/PNG
- Blur placeholder mientras la imagen carga
- Atributos `loading="lazy"` y `decoding="async"`

### 3. Configuración de Vite Optimizada
- Code splitting automático por vendor (react, i18n, ui)
- Minificación con esbuild
- Assets pequeños se incrustan como base64

---

## 🖼️ Convertir Imágenes a WebP

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Agregar imágenes al directorio
Coloca tus imágenes en:
```
apps/web/public/assets/images/
```

### Paso 3: Ejecutar conversión
```bash
npm run convert-images
```

Esto convertirá todas las imágenes JPG/PNG a WebP con ~80% de calidad.

---

## ☁️ Configuración del Bucket (Supabase Storage)

### Opción A: Supabase Storage (Recomendado)

1. Ir a tu proyecto en [Supabase](https://supabase.com)
2. Navegar a **Storage** → **New Bucket**
3. Crear bucket llamado `assets` con acceso público
4. Subir las imágenes organizadas en carpetas:
   ```
   assets/
   ├── images/
   │   ├── hero/
   │   ├── proyectos/
   │   └── logos/
   └── videos/
   ```

5. Usar las URLs del bucket en tu código:
```tsx
// Antes (local)
src="/assets/images/Hero-Glamping.jpg"

// Después (Supabase)
src="https://TU_PROJECT.supabase.co/storage/v1/object/public/assets/images/hero/Hero-Glamping.webp"
```

### Opción B: Cloudinary

1. Crear cuenta en [Cloudinary](https://cloudinary.com)
2. Subir imágenes al Media Library
3. Usar URLs optimizadas automáticamente:
```tsx
src="https://res.cloudinary.com/TU_CLOUD/image/upload/f_auto,q_auto/v1/assets/Hero-Glamping"
```

### Opción C: AWS S3 + CloudFront

1. Crear bucket S3 público
2. Configurar CloudFront como CDN
3. Usar URLs de CloudFront

---

## 🔧 Variables de Entorno

Crea un archivo `.env.local`:
```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# URL base de assets (opcional)
VITE_ASSETS_URL=https://tu-proyecto.supabase.co/storage/v1/object/public/assets
```

---

## 📊 Métricas de Rendimiento Esperadas

| Métrica | Antes | Después |
|---------|-------|---------|
| Bundle inicial | ~500KB | ~150KB |
| Imágenes (total) | 50MB+ | ~15MB (WebP) |
| First Contentful Paint | 3s | <1.5s |
| Largest Contentful Paint | 5s | <2.5s |

---

## ✅ Checklist de Optimización

- [x] Lazy loading de páginas con React.lazy
- [x] Componente OptimizedImage con WebP y lazy load
- [x] Suspense con fallback de loading
- [x] Configuración de Vite optimizada
- [x] Script de conversión a WebP
- [ ] Migrar imágenes a bucket externo
- [ ] Configurar CDN para assets
- [ ] Implementar service worker para cache
