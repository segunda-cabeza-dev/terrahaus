import { useState, useEffect, useCallback } from 'react';
import { supabase, type Project, type Category, useToast } from '@beltrame/shared';

export interface ProjectWithTranslations extends Project {
  nombre?: string;
  nombre_en?: string;
  nombre_it?: string;
  descripcion?: string;
  descripcion_en?: string;
  descripcion_it?: string;
  categoria_nombre?: string;
  imagen_principal?: string;
  imagenes?: string[];
}

export interface CategoryWithTranslations extends Category {
  nombre?: string;
  nombre_en?: string;
  nombre_it?: string;
  projectCount?: number;
  imagen_portada?: string;
}

export function useProyectosData() {
  const { toast } = useToast();
  const [proyectos, setProyectos] = useState<ProjectWithTranslations[]>([]);
  const [categorias, setCategorias] = useState<CategoryWithTranslations[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (categoriesError) throw categoriesError;

      // Cargar proyectos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (projectsError) throw projectsError;

      // Cargar traducciones
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .in('entity_type', ['category', 'project']);
      
      if (translationsError) throw translationsError;

      // Procesar traducciones
      const getTranslationValue = (items: any[], entityId: number, entityType: string, lang: string, field: string) => {
        const translation = items.find((t: any) => 
          t.entity_type === entityType && 
          t.entity_id === entityId && 
          t.language_code?.toLowerCase() === lang && 
          t.field_name === field
        );
        return translation?.value?.trim() || '';
      };

      const slugToTitle = (value: string) =>
        value ? value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

      // Procesar proyectos
      const processedProjects = projectsData.map((proj: any) => {
        const nombreEs = getTranslationValue(translationsData, proj.id, 'project', 'es', 'name') || slugToTitle(proj.slug);
        const nombreEn = getTranslationValue(translationsData, proj.id, 'project', 'en', 'name') || nombreEs;
        const nombreIt = getTranslationValue(translationsData, proj.id, 'project', 'it', 'name') || nombreEs;
        
        const descripcionEs = getTranslationValue(translationsData, proj.id, 'project', 'es', 'description');
        const descripcionEn = getTranslationValue(translationsData, proj.id, 'project', 'en', 'description') || descripcionEs;
        const descripcionIt = getTranslationValue(translationsData, proj.id, 'project', 'it', 'description') || descripcionEs;

        // Obtener nombre de categoría
        const categoria = categoriesData.find((c: any) => c.id === proj.category_id);
        const categoriaNombre = categoria ? (getTranslationValue(translationsData, categoria.id, 'category', 'es', 'name') || slugToTitle(categoria.slug)) : '';

        return {
          ...proj,
          nombre: nombreEs,
          nombre_en: nombreEn,
          nombre_it: nombreIt,
          descripcion: descripcionEs,
          descripcion_en: descripcionEn,
          descripcion_it: descripcionIt,
          categoria_nombre: categoriaNombre,
          imagen_principal: proj.image_urls?.[0] || '',
          imagenes: proj.image_urls || []
        };
      });

      // Procesar categorías
      const processedCategories = categoriesData.map((cat: any) => {
        const nombreEs = getTranslationValue(translationsData, cat.id, 'category', 'es', 'name') || slugToTitle(cat.slug);
        const nombreEn = getTranslationValue(translationsData, cat.id, 'category', 'en', 'name') || nombreEs;
        const nombreIt = getTranslationValue(translationsData, cat.id, 'category', 'it', 'name') || nombreEs;

        // Contar proyectos de esta categoría
        const projectCount = projectsData.filter((p: any) => p.category_id === cat.id).length;

        return {
          ...cat,
          nombre: nombreEs,
          nombre_en: nombreEn,
          nombre_it: nombreIt,
          projectCount,
          imagen_portada: cat.cover_image_url || ''
        };
      });
      
      setProyectos(processedProjects);
      setCategorias(processedCategories);
    } catch (error) {
      console.error('Error en cargarDatos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    proyectos,
    categorias,
    loading,
    refetch: cargarDatos
  };
}
