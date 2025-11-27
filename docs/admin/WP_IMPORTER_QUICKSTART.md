# WP Importer - Guía Rápida

## ¿Qué es?

Módulo que importa categorías de WooCommerce (WordPress) a Supabase, incluyendo:
- 📷 Imágenes
- 📝 Títulos en español
- 📄 Descripciones en español

## Ubicación

📍 **Panel Admin**: http://localhost:5173/wp-importer

## Pasos rápidos

### 1️⃣ Obtén tus credenciales de WooCommerce

WordPress → WooCommerce → Ajustes → Avanzado → API REST → Añadir clave

Permisos: **Solo lectura**

### 2️⃣ Configura en WP Importer

- URL: `https://tutienda.com`
- Consumer Key: `ck_xxxxx`
- Consumer Secret: `cs_xxxxx`

### 3️⃣ Haz clic en "Iniciar Importación"

¡Listo! Las categorías se importarán automáticamente.

## Archivos creados

```
packages/shared/src/services/
├── woocommerce.service.ts      # Servicio API WooCommerce
└── wp-importer.service.ts       # Servicio de importación

apps/admin/src/features/wp-importer/
├── WPImporter.tsx               # Interfaz de usuario
└── index.ts

docs/admin/
└── WP_IMPORTER_README.md        # Documentación completa
```

## Características

✅ Conexión segura a WooCommerce API REST
✅ Descarga automática de imágenes
✅ Subida a Supabase Storage (bucket: categories)
✅ Guardado en base de datos con traducciones en español
✅ Interfaz visual con progreso en tiempo real
✅ Manejo de errores detallado
✅ Guarda configuración en localStorage

## Ver documentación completa

👉 `docs/admin/WP_IMPORTER_README.md`
