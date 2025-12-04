-- Crear una función PostgreSQL que pueda borrar mensajes de contacto
-- Esta función se ejecuta con permisos elevados (SECURITY DEFINER)

CREATE OR REPLACE FUNCTION delete_contact_message(message_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- Verificar que el usuario esté autenticado
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'No autenticado';
    END IF;

    -- Obtener el rol del usuario
    SELECT role INTO user_role
    FROM admin_profiles
    WHERE id = auth.uid();

    -- Verificar que sea admin o dueño
    IF user_role NOT IN ('dueño', 'admin', 'owner') THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar mensajes';
    END IF;

    -- Eliminar el mensaje
    DELETE FROM contact_messages WHERE id = message_id;
END;
$$;

-- Dar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION delete_contact_message(uuid) TO authenticated;
