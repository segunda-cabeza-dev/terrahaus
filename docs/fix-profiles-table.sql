-- =====================================================
-- FIX: Crear/Arreglar tabla PROFILES para usuarios
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Crear tabla profiles si no existe
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL DEFAULT 'Usuario',
  role TEXT NOT NULL CHECK (role IN ('dueño', 'admin', 'empleado')) DEFAULT 'empleado',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Agregar columna is_active si la tabla ya existía pero no tenía la columna
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
    ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- 3. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Enable all for authenticated" ON profiles;

-- 5. Crear política simple que permite todo a usuarios autenticados
CREATE POLICY "Enable all for authenticated" ON profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, role, is_active)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'nombre', 'Usuario Nuevo'),
    COALESCE(new.raw_user_meta_data->>'role', 'empleado'),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Crear trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Trigger para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 11. Sincronizar usuarios existentes de auth.users a profiles
INSERT INTO profiles (id, email, nombre, role, is_active)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'nombre', split_part(email, '@', 1)),
  'dueño',
  true
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- 12. Actualizar el usuario actual como dueño (reemplaza el email si es diferente)
UPDATE profiles 
SET role = 'dueño', is_active = true 
WHERE email IN (SELECT email FROM auth.users LIMIT 1);

-- =====================================================
-- LISTO! La tabla profiles está configurada
-- =====================================================

-- Para verificar que todo está bien, ejecuta:
-- SELECT * FROM profiles;
