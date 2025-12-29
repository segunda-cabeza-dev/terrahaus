# Configuración de Cloudflare R2 para Assets

## 📋 Pasos para configurar Cloudflare R2

### 1. Crear cuenta y bucket

1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navegar a **R2 Object Storage** → **Create bucket**
3. Nombre del bucket: `terrahaus-assets`
4. Ubicación: Elegir la más cercana (ej: Europe)

### 2. Configurar acceso público

1. En el bucket, ir a **Settings** → **Public Access**
2. Habilitar **Allow Access** con un dominio personalizado o usar el dominio R2.dev
3. Copiar la URL pública (ej: `https://pub-xxxxx.r2.dev` o `https://assets.tudominio.com`)

### 3. Crear API Token para subir archivos

1. Ir a **R2** → **Manage R2 API Tokens**
2. Crear token con permisos:
   - **Object Read & Write**
   - Bucket: `terrahaus-assets`
3. Guardar el Access Key ID y Secret Access Key

### 4. Estructura de carpetas en R2

```
terrahaus-assets/
├── images/
│   ├── hero/
│   ├── proyectos/
│   ├── logos/
│   └── especializaciones/
└── videos/
    ├── Rendervideo-optimized.mp4
    ├── Rendervideo-optimized.webm
    ├── Rendervideo-mobile.mp4
    └── Rendervideo-poster.webp
```

### 5. Subir archivos

#### Opción A: Usando la interfaz web
1. Ir al bucket en Cloudflare Dashboard
2. Arrastrar y soltar los archivos

#### Opción B: Usando rclone (recomendado para muchos archivos)
```bash
# Instalar rclone
brew install rclone

# Configurar
rclone config
# Elegir: New remote → S3 → Cloudflare R2
# Ingresar Access Key y Secret

# Subir imágenes
rclone sync ./apps/web/public/assets/images/ r2:terrahaus-assets/images/

# Subir videos optimizados
rclone sync ./apps/web/public/assets/videos/optimized/ r2:terrahaus-assets/videos/
```

#### Opción C: Usando AWS CLI
```bash
# Configurar credenciales
export AWS_ACCESS_KEY_ID=tu_access_key
export AWS_SECRET_ACCESS_KEY=tu_secret_key

# Subir
aws s3 sync ./apps/web/public/assets/images/ s3://terrahaus-assets/images/ \
  --endpoint-url https://ACCOUNT_ID.r2.cloudflarestorage.com

aws s3 sync ./apps/web/public/assets/videos/optimized/ s3://terrahaus-assets/videos/ \
  --endpoint-url https://ACCOUNT_ID.r2.cloudflarestorage.com
```

---

## 🔧 Configuración en el proyecto

### Variables de entorno (.env.local)

```env
# Cloudflare R2
VITE_ASSETS_URL=https://pub-xxxxx.r2.dev
# o con dominio personalizado:
# VITE_ASSETS_URL=https://assets.terrahaus.com
```

### Uso en componentes

```tsx
// Antes (local)
<img src="/assets/images/Hero-Glamping.webp" />
<video src="/assets/videos/Rendervideo.mp4" />

// Después (Cloudflare R2)
<img src={`${import.meta.env.VITE_ASSETS_URL}/images/Hero-Glamping.webp`} />
<video src={`${import.meta.env.VITE_ASSETS_URL}/videos/Rendervideo-optimized.mp4`} />
```

---

## 📁 Archivos a subir

### Imágenes (WebP)
Todos los archivos `.webp` de:
- `apps/web/public/assets/images/*.webp`

### Videos
Solo los optimizados de:
- `apps/web/public/assets/videos/optimized/`

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| Rendervideo-optimized.mp4 | 51 MB | Desktop |
| Rendervideo-optimized.webm | 69 MB | Navegadores modernos |
| Rendervideo-mobile.mp4 | 28 MB | Móviles |
| Rendervideo-poster.webp | 56 KB | Thumbnail |

---

## ✅ Checklist

- [ ] Crear bucket en Cloudflare R2
- [ ] Habilitar acceso público
- [ ] Subir imágenes WebP
- [ ] Subir videos optimizados
- [ ] Configurar variable VITE_ASSETS_URL
- [ ] Actualizar componentes para usar URLs del bucket
- [ ] Probar en desarrollo y producción
