-- ============================================
-- SETUP DE GALERÍA DE IMÁGENES
-- ============================================

-- 1. CREAR BUCKET DE STORAGE
-- Este bucket almacenará todas las imágenes del sitio
-- Se crea como público para que las imágenes sean accesibles directamente

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLÍTICAS DE ACCESO AL BUCKET

-- Permitir lectura pública de todas las imágenes
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Permitir subida solo a usuarios autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Permitir actualización solo a usuarios autenticados
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Permitir eliminación solo a usuarios autenticados
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- 3. TABLA DE IMÁGENES (opcional - para metadata adicional)
-- Esta tabla almacena metadata de las imágenes subidas

CREATE TABLE IF NOT EXISTS media_files (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'image/jpeg',
  active BOOLEAN DEFAULT true,
  thumbnail_url TEXT,
  medium_url TEXT,
  large_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_files_url ON media_files(url);
CREATE INDEX IF NOT EXISTS idx_media_files_active ON media_files(active);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. RLS (Row Level Security) para la tabla media_files
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Public can view media files"
ON media_files FOR SELECT
USING (true);

-- Permitir inserción solo a usuarios autenticados
CREATE POLICY "Authenticated users can insert media files"
ON media_files FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir actualización solo a usuarios autenticados
CREATE POLICY "Authenticated users can update media files"
ON media_files FOR UPDATE
TO authenticated
USING (true);

-- Permitir eliminación solo a usuarios autenticados
CREATE POLICY "Authenticated users can delete media files"
ON media_files FOR DELETE
TO authenticated
USING (true);

-- 5. TABLA DE PRODUCTOS (si no existe)
-- Esta tabla almacena productos con sus imágenes

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  nombre_en TEXT,
  nombre_it TEXT,
  descripcion TEXT,
  descripcion_en TEXT,
  descripcion_it TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- Array de URLs de imágenes
  precio DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_products_activo ON products(activo);
CREATE INDEX IF NOT EXISTS idx_products_orden ON products(orden);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Trigger para productos
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS para productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products"
ON products FOR SELECT
USING (activo = true);

CREATE POLICY "Authenticated users can manage products"
ON products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para obtener el uso de una imagen específica
CREATE OR REPLACE FUNCTION get_image_usage(image_url TEXT)
RETURNS TABLE (
  usage_type TEXT,
  item_id BIGINT,
  item_name TEXT
) AS $$
BEGIN
  -- Buscar en proyectos
  RETURN QUERY
  SELECT 
    'project'::TEXT as usage_type,
    id as item_id,
    nombre as item_name
  FROM projects
  WHERE images::text LIKE '%' || image_url || '%';
  
  -- Buscar en categorías (imagen de portada)
  RETURN QUERY
  SELECT 
    'category'::TEXT as usage_type,
    id as item_id,
    nombre as item_name
  FROM categories
  WHERE imagen_portada = image_url;
END;
$$ LANGUAGE plpgsql;

-- Función para contar el uso de una imagen
CREATE OR REPLACE FUNCTION count_image_usage(image_url TEXT)
RETURNS INTEGER AS $$
DECLARE
  usage_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO usage_count FROM get_image_usage(image_url);
  RETURN usage_count;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION get_total_storage_size()
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM((metadata->>'size')::bigint), 0)
  FROM storage.objects
  WHERE bucket_id = 'media';
$$ LANGUAGE SQL;

-- Función para limpiar imágenes huérfanas (no referenciadas)
CREATE OR REPLACE FUNCTION cleanup_orphaned_images()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Eliminar registros de media_files que no existen en storage
  DELETE FROM media_files
  WHERE path NOT IN (
    SELECT name FROM storage.objects WHERE bucket_id = 'media'
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar algunas imágenes de ejemplo en media_files
INSERT INTO media_files (name, url, path, size, type, active, thumbnail_url, medium_url, large_url) VALUES
  ('ejemplo-1.jpg', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'images/ejemplo-1.jpg', 245680, 'image/jpeg', true, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920'),
  ('ejemplo-2.jpg', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 'images/ejemplo-2.jpg', 312450, 'image/jpeg', true, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920'),
  ('ejemplo-3.jpg', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800', 'images/ejemplo-3.jpg', 198720, 'image/jpeg', true, 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920')
ON CONFLICT (url) DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que el bucket se creó correctamente
SELECT * FROM storage.buckets WHERE id = 'media';

-- Verificar las políticas del bucket
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Verificar las tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('media_files', 'products');

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. El bucket 'media' es PÚBLICO. Todas las URLs generadas serán accesibles públicamente.

2. Solo usuarios AUTENTICADOS pueden subir, actualizar o eliminar imágenes.

3. La tabla 'media_files' es opcional. Puedes usarla para:
   - Llevar un registro de todas las imágenes subidas
   - Agregar metadata adicional (etiquetas, categorías, etc.)
   - Buscar imágenes por fecha, tamaño, etc.

4. La columna 'images' en 'products' usa JSONB para almacenar un array de URLs.
   Ejemplo: ["https://..../image1.jpg", "https://..../image2.jpg"]

5. Para producción, considera:
   - Limitar el tamaño máximo de archivo en el cliente
   - Implementar compresión de imágenes
   - Agregar validación de tipos de archivo
   - Configurar CORS en Supabase si es necesario
   - Implementar caché de imágenes

6. Comandos útiles:
   - Ver tamaño total: SELECT get_total_storage_size();
   - Limpiar huérfanas: SELECT cleanup_orphaned_images();
*/
