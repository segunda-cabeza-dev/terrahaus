-- =====================================================
-- BELTRAME WEB - DROP ALL TABLES
-- =====================================================
-- This script drops all existing tables
-- Run this BEFORE executing the main setup script
-- =====================================================

-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_contenido_updated_at ON public.contenido_sitio;
DROP TRIGGER IF EXISTS update_categorias_updated_at ON public.categorias;
DROP TRIGGER IF EXISTS update_proyectos_updated_at ON public.proyectos;
DROP TRIGGER IF EXISTS update_archivos_updated_at ON public.archivos_media;
DROP TRIGGER IF EXISTS update_productos_updated_at ON public.productos;
DROP TRIGGER IF EXISTS update_recordatorios_updated_at ON public.recordatorios;
DROP TRIGGER IF EXISTS update_whatsapp_updated_at ON public.whatsapp_config;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop storage policies
DROP POLICY IF EXISTS "Cualquiera puede ver imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Solo dueños pueden eliminar imágenes de productos" ON storage.objects;
DROP POLICY IF EXISTS "Cualquiera puede ver imágenes de proyectos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar imágenes de proyectos" ON storage.objects;
DROP POLICY IF EXISTS "Cualquiera puede ver imágenes de categorías" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar imágenes de categorías" ON storage.objects;
DROP POLICY IF EXISTS "Cualquiera puede ver archivos media" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar archivos media" ON storage.objects;

-- Drop storage buckets (optional - comment out if you want to keep existing files)
DELETE FROM storage.buckets WHERE id IN ('productos', 'proyectos', 'categorias', 'media');

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS public.recordatorios CASCADE;
DROP TABLE IF EXISTS public.whatsapp_config CASCADE;
DROP TABLE IF EXISTS public.productos CASCADE;
DROP TABLE IF EXISTS public.archivos_media CASCADE;
DROP TABLE IF EXISTS public.proyectos CASCADE;
DROP TABLE IF EXISTS public.categorias CASCADE;
DROP TABLE IF EXISTS public.contenido_sitio CASCADE;
DROP TABLE IF EXISTS public.contactos CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop translations table (new)
DROP TABLE IF EXISTS public.translations CASCADE;

-- If you want to also remove all auth users (BE CAREFUL!)
-- UNCOMMENT ONLY IF YOU'RE SURE:
-- DELETE FROM auth.users;

-- =====================================================
-- All tables have been dropped
-- Now you can run the main setup script
-- =====================================================
