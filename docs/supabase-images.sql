-- Tabla para almacenar metadatos de imágenes
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  alt_text VARCHAR(255),
  category VARCHAR(100),
  uploader_id UUID,
  -- Relación opcional con usuarios (si tienes tabla de usuarios)
  -- FOREIGN KEY (uploader_id) REFERENCES profiles(id) ON DELETE SET NULL
  metadata JSONB
);

-- Índices útiles
CREATE INDEX idx_images_created_at ON images(created_at DESC);
CREATE INDEX idx_images_category ON images(category);

-- Habilitar Row Level Security (RLS)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones públicas (opcional, si quieres que cualquiera pueda subir)
CREATE POLICY "Permitir inserciones públicas de imágenes" 
ON images 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Política para que usuarios autenticados puedan ver todas las imágenes
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON images 
FOR SELECT 
TO authenticated
USING (true);

-- Política para que usuarios autenticados puedan actualizar/eliminar sus propias imágenes
CREATE POLICY "Permitir update/delete a uploader" 
ON images 
FOR UPDATE USING (uploader_id = auth.uid())
TO authenticated;

CREATE POLICY "Permitir delete a uploader" 
ON images 
FOR DELETE USING (uploader_id = auth.uid())
TO authenticated;

-- Comentarios para documentación
COMMENT ON TABLE images IS 'Metadatos de imágenes subidas a la web';
COMMENT ON COLUMN images.name IS 'Nombre de la imagen';
COMMENT ON COLUMN images.url IS 'URL pública de la imagen en Supabase Storage';
COMMENT ON COLUMN images.size IS 'Tamaño en bytes';
COMMENT ON COLUMN images.alt_text IS 'Texto alternativo para accesibilidad';
COMMENT ON COLUMN images.category IS 'Categoría o uso de la imagen';
COMMENT ON COLUMN images.uploader_id IS 'ID del usuario que subió la imagen';
COMMENT ON COLUMN images.metadata IS 'Metadatos adicionales en formato JSON';
