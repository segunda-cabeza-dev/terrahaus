-- Fix: Permitir borrar mensajes de contacto a dueño y admin
-- Problema: La política solo permitía 'owner' pero el rol real es 'dueño'

-- Eliminar la política antigua
DROP POLICY IF EXISTS "Only owners can delete contact messages" ON public.contact_messages;

-- Crear nueva política que permita borrar a dueño y admin
CREATE POLICY "Owners and admins can delete contact messages"
    ON public.contact_messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('dueño', 'admin', 'owner')
        )
    );
