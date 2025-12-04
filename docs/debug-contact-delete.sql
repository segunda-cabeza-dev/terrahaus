-- Script de debugging para verificar permisos de DELETE en contact_messages

-- 1. Ver tu perfil de usuario actual y rol
SELECT 
    id,
    email,
    role,
    created_at
FROM admin_profiles
WHERE id = auth.uid();

-- 2. Ver todas las políticas de contact_messages
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'contact_messages';

-- 3. Ver todos los roles disponibles en admin_profiles
SELECT DISTINCT role FROM admin_profiles;

-- 4. Intentar ver qué mensajes PUEDES borrar según la política actual
SELECT 
    cm.id,
    cm.full_name,
    cm.email,
    cm.created_at,
    (
        EXISTS (
            SELECT 1 FROM admin_profiles
            WHERE id = auth.uid() AND role IN ('dueño', 'admin', 'owner')
        )
    ) as "puedo_borrar"
FROM contact_messages cm
LIMIT 5;
