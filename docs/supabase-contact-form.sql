-- Tabla para almacenar los envíos del formulario de contacto
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  notas TEXT
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_leido ON contact_submissions(leido);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Política para permitir que cualquiera pueda insertar (formulario público)
CREATE POLICY "Permitir inserciones públicas" 
ON contact_submissions 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Política para que usuarios autenticados puedan ver todos los registros
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON contact_submissions 
FOR SELECT 
TO authenticated
USING (true);

-- Política para que usuarios autenticados puedan actualizar (marcar como leído, agregar notas)
CREATE POLICY "Permitir actualizaciones a usuarios autenticados" 
ON contact_submissions 
FOR UPDATE 
TO authenticated
USING (true);

-- Política para que usuarios autenticados puedan eliminar
CREATE POLICY "Permitir eliminación a usuarios autenticados" 
ON contact_submissions 
FOR DELETE 
TO authenticated
USING (true);

-- Comentarios para documentación
COMMENT ON TABLE contact_submissions IS 'Almacena los envíos del formulario de contacto de la web pública';
COMMENT ON COLUMN contact_submissions.nombre IS 'Nombre completo del contacto';
COMMENT ON COLUMN contact_submissions.email IS 'Correo electrónico del contacto';
COMMENT ON COLUMN contact_submissions.telefono IS 'Teléfono del contacto (opcional)';
COMMENT ON COLUMN contact_submissions.mensaje IS 'Mensaje del contacto';
COMMENT ON COLUMN contact_submissions.leido IS 'Indica si el mensaje ha sido leído por un administrador';
COMMENT ON COLUMN contact_submissions.notas IS 'Notas internas del administrador sobre este contacto';
