-- =====================================================
-- FIX: Permitir que admins también puedan eliminar
-- =====================================================
-- Problema: Solo los usuarios con rol 'owner' pueden eliminar
-- categorías y proyectos. Los usuarios 'admin' no pueden.
-- Esta migración permite que tanto 'owner' como 'admin' puedan eliminar.
-- =====================================================

-- Eliminar políticas restrictivas existentes
DROP POLICY IF EXISTS "Only owners can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Only owners can delete projects" ON public.projects;

-- Crear nuevas políticas que permitan a owners Y admins eliminar

-- Para categorías
CREATE POLICY "Owners and admins can delete categories"
    ON public.categories FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Para proyectos
CREATE POLICY "Owners and admins can delete projects"
    ON public.projects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- =====================================================
-- Verificar que las políticas se crearon correctamente
-- =====================================================
-- SELECT policyname, tablename, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('categories', 'projects') AND cmd = 'DELETE';
