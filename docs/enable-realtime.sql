-- ============================================
-- HABILITAR REALTIME PARA ACTUALIZACIONES INSTANTÁNEAS
-- ============================================
-- Ejecutar este script en: Supabase Dashboard > SQL Editor
-- Esto permite que los cambios en la BD se reflejen instantáneamente en la web

-- Habilitar Realtime para la tabla projects
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- Habilitar Realtime para la tabla categories
ALTER PUBLICATION supabase_realtime ADD TABLE categories;

-- Habilitar Realtime para la tabla translations
ALTER PUBLICATION supabase_realtime ADD TABLE translations;

-- ¡Listo! Ahora cuando cambies algo en el admin, se verá al instante en la web
