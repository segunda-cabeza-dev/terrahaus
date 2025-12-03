-- ============================================================
-- LIMPIEZA DE TRADUCCIONES HUÉRFANAS
-- ============================================================
-- Este script elimina traducciones que apuntan a categorías o proyectos
-- que ya no existen en la base de datos.

-- 1. Ver cuántas traducciones huérfanas hay (solo para verificar)
SELECT 
    entity_type,
    COUNT(*) as orphan_count
FROM translations t
WHERE 
    (entity_type = 'category' AND NOT EXISTS (
        SELECT 1 FROM categories c WHERE c.id = t.entity_id
    ))
    OR
    (entity_type = 'project' AND NOT EXISTS (
        SELECT 1 FROM projects p WHERE p.id = t.entity_id
    ))
GROUP BY entity_type;

-- 2. Eliminar traducciones huérfanas de categorías
DELETE FROM translations
WHERE entity_type = 'category' 
AND NOT EXISTS (
    SELECT 1 FROM categories c WHERE c.id = translations.entity_id
);

-- 3. Eliminar traducciones huérfanas de proyectos
DELETE FROM translations
WHERE entity_type = 'project' 
AND NOT EXISTS (
    SELECT 1 FROM projects p WHERE p.id = translations.entity_id
);

-- ============================================================
-- PREVENCIÓN: CASCADE DELETE
-- ============================================================
-- Agregar foreign keys con ON DELETE CASCADE para eliminar
-- automáticamente las traducciones cuando se elimina la entidad

-- Nota: Como translations usa una columna genérica entity_id,
-- no podemos usar foreign keys tradicionales.
-- En su lugar, usaremos TRIGGERS.

-- 4. Trigger para eliminar traducciones cuando se elimina una categoría
CREATE OR REPLACE FUNCTION delete_category_translations()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM translations 
    WHERE entity_type = 'category' 
    AND entity_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_delete_category_translations ON categories;
CREATE TRIGGER trigger_delete_category_translations
    BEFORE DELETE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION delete_category_translations();

-- 5. Trigger para eliminar traducciones cuando se elimina un proyecto
CREATE OR REPLACE FUNCTION delete_project_translations()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM translations 
    WHERE entity_type = 'project' 
    AND entity_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_delete_project_translations ON projects;
CREATE TRIGGER trigger_delete_project_translations
    BEFORE DELETE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION delete_project_translations();

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- Ver el estado final (debería ser 0)
SELECT 
    entity_type,
    COUNT(*) as orphan_count
FROM translations t
WHERE 
    (entity_type = 'category' AND NOT EXISTS (
        SELECT 1 FROM categories c WHERE c.id = t.entity_id
    ))
    OR
    (entity_type = 'project' AND NOT EXISTS (
        SELECT 1 FROM projects p WHERE p.id = t.entity_id
    ))
GROUP BY entity_type;

-- Ver totales actuales
SELECT 
    entity_type,
    COUNT(*) as total_translations
FROM translations
GROUP BY entity_type
ORDER BY entity_type;
