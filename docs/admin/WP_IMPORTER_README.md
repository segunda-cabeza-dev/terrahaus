# WP Importer

Módulo para importar categorías de WooCommerce a Supabase.

## Funcionalidades

- ✅ Conecta con la API REST de WooCommerce
- ✅ Importa categorías con títulos y descripciones
- ✅ Guarda URLs de imágenes de WordPress
- ✅ Guarda categorías en español en la base de datos
- ℹ️  Las imágenes se referencian desde WordPress (no se descargan debido a CORS)
- ✅ Interfaz visual con progreso en tiempo real
- ✅ Manejo de errores detallado

## Cómo usar

### 1. Obtener credenciales de WooCommerce

1. Ve a tu panel de WordPress
2. Navega a **WooCommerce → Ajustes → Avanzado → API REST**
3. Haz clic en **Añadir clave**
4. Configura:
   - **Descripción**: "Importador de categorías"
   - **Usuario**: Selecciona un usuario administrador
   - **Permisos**: **Solo lectura** (Read)
5. Haz clic en **Generar clave API**
6. Copia el **Consumer key** y **Consumer secret**

### 2. Configurar el importador

1. Abre el panel de administración
2. Ve a **WP Importer** en el menú lateral
3. Ingresa:
   - **URL de la tienda**: `https://tutienda.com` (sin trailing slash)
   - **Consumer Key**: `ck_xxxxxxxxxxxxx`
   - **Consumer Secret**: `cs_xxxxxxxxxxxxx`
4. Haz clic en **Probar Conexión** para verificar

### 3. Ejecutar la importación

1. Una vez conectado, haz clic en **Iniciar Importación**
2. El proceso:
   - Obtiene todas las categorías de WooCommerce
   - Guarda las URLs de las imágenes
   - Guarda las categorías en la base de datos
   - Guarda los nombres y descripciones en español

**Nota sobre imágenes**: Las imágenes se guardan como URLs que apuntan a WordPress. Si necesitas descargarlas a Supabase, deberás habilitar CORS en tu servidor WordPress.

### 4. Revisar resultados

Al finalizar verás:
- Número de categorías importadas
- Número de URLs de imágenes guardadas
- Lista de errores (si los hay)

## Importante sobre las imágenes

Las imágenes **no se descargan a Supabase** debido a restricciones CORS del servidor WordPress. En su lugar, se guardan las URLs que apuntan directamente a WordPress.

**Si necesitas descargar las imágenes a Supabase:**

1. Habilita CORS en WordPress agregando esto al `.htaccess`:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

2. O usa un plugin de WordPress como "WP CORS" para habilitar CORS

3. Una vez habilitado CORS, contacta al desarrollador para activar la descarga automática de imágenes

## Estructura técnica

### Servicios

#### `WooCommerceService`
```typescript
// Conecta con la API REST de WooCommerce
const wooCommerce = new WooCommerceService({
  url: 'https://tutienda.com',
  consumerKey: 'ck_xxxxx',
  consumerSecret: 'cs_xxxxx'
})

// Obtener categorías
const categories = await wooCommerce.getCategories()
```

#### `WPImporterService`
```typescript
// Importa categorías a Supabase
const importer = new WPImporterService(wooCommerce)

// Con callback de progreso
await importer.importCategories((progress) => {
  console.log(`${progress.current}/${progress.total} - ${progress.status}`)
})
```

### Estructura de datos

Las categorías se guardan en:
- **Tabla `categories`**: Información básica (slug, imagen, estado)
- **Tabla `translations`**: Nombres y descripciones en español
- **Storage `categories`**: Imágenes descargadas

## Notas importantes

- ✅ Las imágenes se suben con el slug de la categoría como nombre
- ✅ Si una categoría ya existe, se actualiza (upsert)
- ✅ Las credenciales se guardan en localStorage para facilitar uso
- ✅ Solo requiere permisos de **lectura** en WooCommerce
- ✅ El proceso puede tomar varios minutos dependiendo del número de categorías

## Solución de problemas

### Error de conexión
- Verifica que la URL sea correcta (sin `/` al final)
- Confirma que las credenciales sean válidas
- Asegúrate de que WooCommerce esté instalado y activo

### Error al subir imágenes
- Verifica los permisos del bucket `categories` en Supabase
- Confirma que el bucket existe y es público

### Categorías sin imagen
- Algunas categorías en WooCommerce pueden no tener imagen
- El importador las creará sin imagen (campo `null`)
