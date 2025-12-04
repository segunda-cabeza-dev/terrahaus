-- Ver el rol actual del usuario logueado
SELECT id, email, role FROM admin_profiles WHERE id = auth.uid();

-- Ver las políticas actuales de contact_messages
SELECT policyname, cmd, qual::text 
FROM pg_policies 
WHERE tablename = 'contact_messages' AND cmd = 'DELETE';

-- Si la política no existe o está mal, recrearla:
DROP POLICY IF EXISTS "Only owners can delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owners and admins can delete contact messages" ON public.contact_messages;

-- Crear política correcta que funcione con authenticated users que sean admin/dueño
CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages 
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public.admin_profiles
        WHERE admin_profiles.id = auth.uid() 
        AND admin_profiles.role IN ('dueño', 'admin', 'owner')
    )
);

-- Verificar que se creó
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contact_messages';
