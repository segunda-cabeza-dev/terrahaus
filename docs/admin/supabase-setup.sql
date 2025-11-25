-- =====================================================
-- CONFIGURACIÓN DE BASE DE DATOS PARA SISTEMA DE ADMIN
-- Beltrame Web - Panel de Administración
-- =====================================================

-- 1. CREACIÓN DE TABLAS
-- =====================================================

-- Tabla de perfiles de usuario con roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('dueño', 'admin', 'empleado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de contenido del sitio
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  seccion TEXT NOT NULL,
  clave TEXT NOT NULL,
  valor TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'imagen', 'html')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(seccion, clave)
);

-- Tabla de formularios de contacto
CREATE TABLE contact_forms (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- =====================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_site_content_seccion ON site_content(seccion);
CREATE INDEX idx_contact_forms_leido ON contact_forms(leido);
CREATE INDEX idx_contact_forms_created_at ON contact_forms(created_at DESC);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE SEGURIDAD PARA PROFILES
-- =====================================================

-- Usuarios autenticados pueden ver perfiles
CREATE POLICY "Users can view profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins y dueños pueden actualizar perfiles
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('dueño', 'admin')
    )
  );

-- Solo admins y dueños pueden insertar perfiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('dueño', 'admin')
    )
  );

-- Solo admins y dueños pueden eliminar perfiles
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('dueño', 'admin')
    )
  );

-- 5. POLÍTICAS DE SEGURIDAD PARA SITE_CONTENT
-- =====================================================

-- Todos los autenticados pueden ver contenido
CREATE POLICY "Authenticated users can view content" ON site_content
  FOR SELECT
  TO authenticated
  USING (true);

-- Todos los autenticados pueden modificar contenido
CREATE POLICY "Authenticated users can modify content" ON site_content
  FOR ALL
  TO authenticated
  USING (true);

-- 6. POLÍTICAS DE SEGURIDAD PARA CONTACT_FORMS
-- =====================================================

-- Usuarios autenticados pueden ver contactos
CREATE POLICY "Authenticated users can view contacts" ON contact_forms
  FOR SELECT
  TO authenticated
  USING (true);

-- Cualquiera puede crear contactos (para el formulario público)
CREATE POLICY "Anyone can create contacts" ON contact_forms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Usuarios autenticados pueden actualizar contactos
CREATE POLICY "Authenticated users can update contacts" ON contact_forms
  FOR UPDATE
  TO authenticated
  USING (true);

-- Usuarios autenticados pueden eliminar contactos
CREATE POLICY "Authenticated users can delete contacts" ON contact_forms
  FOR DELETE
  TO authenticated
  USING (true);

-- 7. FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'nombre', 'Usuario Nuevo'),
    'empleado'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. DATOS DE EJEMPLO PARA SITE_CONTENT (OPCIONAL)
-- =====================================================

INSERT INTO site_content (seccion, clave, valor, tipo) VALUES
  ('inicio', 'titulo-principal', 'Bienvenido a Beltrame', 'texto'),
  ('inicio', 'subtitulo', 'Expertos en construcción y diseño', 'texto'),
  ('inicio', 'descripcion', 'Más de 20 años transformando espacios', 'texto'),
  ('quienes-somos', 'titulo', 'Quiénes Somos', 'texto'),
  ('quienes-somos', 'descripcion', 'Somos una empresa dedicada a la construcción y el diseño...', 'html'),
  ('contacto', 'titulo', 'Contáctanos', 'texto'),
  ('contacto', 'descripcion', 'Estamos aquí para ayudarte con tu proyecto', 'texto')
ON CONFLICT (seccion, clave) DO NOTHING;

-- 9. POLÍTICAS DE STORAGE PARA IMÁGENES
-- =====================================================
-- NOTA: Estas políticas se aplican desde el panel de Supabase en Storage
-- o ejecutando estas queries después de crear el bucket 'images'

-- Usuarios autenticados pueden subir imágenes
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Acceso público para ver imágenes
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Usuarios autenticados pueden eliminar imágenes
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- =====================================================
-- CONFIGURACIÓN COMPLETADA
-- =====================================================

-- Para crear tu primer usuario administrador:
-- 1. Ve a Authentication > Users en Supabase Dashboard
-- 2. Crea un usuario con email y contraseña
-- 3. Ejecuta el siguiente UPDATE reemplazando el email:

-- UPDATE profiles
-- SET role = 'dueño', nombre = 'Tu Nombre Completo'
-- WHERE email = 'tu@email.com';
