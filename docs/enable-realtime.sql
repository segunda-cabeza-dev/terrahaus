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

-- Habilitar Realtime para mensajes de contacto (nuevos mensajes aparecen al instante)
ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;

-- ¡Listo! Ahora:
-- - Los cambios en proyectos se ven al instante en la web
-- - Los nuevos mensajes de contacto aparecen automáticamente en el admin (sin refrescar)
