import { useState, useEffect } from 'react';
import { supabase, galleryService } from '@beltrame/shared';
import { Button } from '@beltrame/shared/ui/button';
import { Input } from '@beltrame/shared/ui/input';
import { Label } from '@beltrame/shared/ui/label';
import { useToast } from '@beltrame/shared';
import { ArrowLeft, Trash2, Plus, Image as ImageIcon, X, Loader2 } from 'lucide-react';


interface ProyectoFormData {
  titulo: string;
  titulo_en: string;
  titulo_it: string;
  descripcion: string;
  descripcion_en: string;
  descripcion_it: string;
  categoria: string;
  estado: 'borrador' | 'publicado';
  imagenes: string[];
}

interface ProyectoEditorProps {
  proyectoId?: string;
  categoriaInicial?: string;
  onBack: () => void;
}

export function ProyectoEditor({ proyectoId, categoriaInicial, onBack }: ProyectoEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeLanguageTab, setActiveLanguageTab] = useState<'ES' | 'EN' | 'IT'>('ES');
  const [showImageSourceDialog, setShowImageSourceDialog] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ id: string | number; url: string; name: string }[]>([]);
  const [loadingGalleryImages, setLoadingGalleryImages] = useState(false);
  const [gallerySearchTerm, setGallerySearchTerm] = useState('');
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<{id: number, nombre: string, slug: string}[]>([]);
  const [showNuevaCategoriaInput, setShowNuevaCategoriaInput] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [projectSlug, setProjectSlug] = useState<string>('');
  
  const [form, setForm] = useState<ProyectoFormData>({
    titulo: '',
    titulo_en: '',
    titulo_it: '',
    descripcion: '',
    descripcion_en: '',
    descripcion_it: '',
    categoria: categoriaInicial || '',
    estado: 'borrador',
    imagenes: [],
  });

  const { toast } = useToast();

  useEffect(() => {
    const cancelledRef = { current: false };
    
    const loadData = async () => {
      if (cancelledRef.current) return;
      
      // Siempre cargar categorías disponibles
      await cargarCategorias(cancelledRef);
      
      if (proyectoId && !cancelledRef.current) {
        await cargarProyecto(cancelledRef);
      }
    };
    
    loadData();
    
    // Cleanup para evitar actualizaciones si el componente se desmonta
    return () => {
      cancelledRef.current = true;
    };
  }, [proyectoId]);

  // Función de traducción automática con Google Translate
  const handleTranslateProject = async () => {
    if (!form.titulo.trim()) {
      toast({
        title: 'Error',
        description: 'Escribe primero el título en español',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    toast({
      title: '🔄 Traduciendo...',
      description: 'Usando IA para traducción',
      duration: 2000,
    });

    try {
      // Función para traducir texto usando Google Translate API pública
      const translateText = async (text: string, targetLang: string): Promise<string> => {
        try {
          const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(
              text
            )}`
          );

          if (!response.ok) {
            console.error(`Translation API error for ${targetLang}:`, response.status);
            return text;
          }

          const data = await response.json();

          // Google Translate retorna: [[["texto traducido", "original", null, null, 10]]]
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
          }

          return text;
        } catch (error) {
          console.error(`Translation error for ${targetLang}:`, error);
          return text;
        }
      };

      // Traducir solo lo que falta
      const needsENTitle = !form.titulo_en?.trim();
      const needsITTitle = !form.titulo_it?.trim();
      const needsENDesc = form.descripcion && !form.descripcion_en?.trim();
      const needsITDesc = form.descripcion && !form.descripcion_it?.trim();

      const [tituloEN, tituloIT, descripcionEN, descripcionIT] = await Promise.all([
        needsENTitle ? translateText(form.titulo, 'en') : Promise.resolve(form.titulo_en),
        needsITTitle ? translateText(form.titulo, 'it') : Promise.resolve(form.titulo_it),
        needsENDesc ? translateText(form.descripcion, 'en') : Promise.resolve(form.descripcion_en || ''),
        needsITDesc ? translateText(form.descripcion, 'it') : Promise.resolve(form.descripcion_it || ''),
      ]);

      // Actualizar el formulario
      setForm((prev) => ({
        ...prev,
        titulo_en: tituloEN,
        titulo_it: tituloIT,
        descripcion_en: descripcionEN,
        descripcion_it: descripcionIT,
      }));

      // Si estamos editando un proyecto existente, guardar traducciones inmediatamente
      if (proyectoId) {
        const projectIdNum = parseInt(proyectoId);
        const translations = [
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'en', field_name: 'name', value: tituloEN },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'it', field_name: 'name', value: tituloIT },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'en', field_name: 'description', value: descripcionEN },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'it', field_name: 'description', value: descripcionIT },
        ];

        const { error: translationsError } = await supabase
          .from('translations')
          .upsert(translations, {
            onConflict: 'entity_type,entity_id,language_code,field_name'
          });

        if (translationsError) {
          console.error('❌ Error guardando traducciones automáticas:', translationsError);
          toast({
            title: '⚠️ Traducción completada',
            description: 'Pero hubo un error al guardar. Guarda el proyecto manualmente.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: '✨ Traducción guardada',
          description: 'Las traducciones se guardaron automáticamente',
          duration: 3000,
        });
      } else {
        toast({
          title: '✨ Traducción completada',
          description: 'Guarda el proyecto para conservar las traducciones',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error translating:', error);
      toast({
        title: 'Error al traducir',
        description: 'Intenta nuevamente',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const cargarCategorias = async (cancelledRef?: { current: boolean }) => {
    try {
      // Cargar categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, slug, display_order')
        .order('display_order', { ascending: true });
      
      if (cancelledRef?.current) return;
      
      if (categoriesError) throw categoriesError;

      // Cargar SOLO las traducciones en español de categorías (nombre)
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('entity_id, value')
        .eq('entity_type', 'category')
        .eq('language_code', 'es')
        .eq('field_name', 'name');
      
      if (cancelledRef?.current) return;
      if (translationsError) throw translationsError;

      // Procesar categorías con sus nombres en español
      const categorias = categoriesData.map((cat: any) => {
        const translation = translationsData.find((t: any) => t.entity_id === cat.id);
        return {
          id: cat.id,
          nombre: translation?.value || cat.slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()),
          slug: cat.slug
        };
      });

      if (!cancelledRef?.current) {
        setCategoriasDisponibles(categorias);
      }
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
      setCategoriasDisponibles([]);
    }
  };

  const cargarProyecto = async (cancelledRef?: { current: boolean }) => {
    if (!proyectoId) return;
    
    // Solo mostrar loading si no hay datos cargados
    const shouldShowLoading = !form.titulo;
    if (shouldShowLoading) {
      setLoading(true);
    }
    
    try {
      // Cargar proyecto desde la tabla projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', proyectoId)
        .single();

      if (cancelledRef?.current) {
        if (shouldShowLoading) setLoading(false);
        return;
      }

      if (projectError) throw projectError;

      // Cargar SOLO las traducciones de este proyecto específico
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .eq('entity_type', 'project')
        .eq('entity_id', proyectoId);

      if (cancelledRef?.current) {
        if (shouldShowLoading) setLoading(false);
        return;
      }

      if (translationsError) throw translationsError;

      // Procesar traducciones
      const getTrans = (lang: string, field: string) => 
        translationsData.find(t => t.language_code === lang && t.field_name === field)?.value || '';

      if (!cancelledRef?.current) {
        setForm({
          titulo: getTrans('es', 'name'),
          titulo_en: getTrans('en', 'name'),
          titulo_it: getTrans('it', 'name'),
          descripcion: getTrans('es', 'description'),
          descripcion_en: getTrans('en', 'description'),
          descripcion_it: getTrans('it', 'description'),
          categoria: projectData.category_id?.toString() || '',
          estado: projectData.is_active ? 'publicado' : 'borrador',
          imagenes: projectData.image_urls || [],
        });

        // Guardar el slug del proyecto para el link de vista previa
        setProjectSlug(projectData.slug || '');
      }
    } catch (error) {
      console.error('Error cargando proyecto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el proyecto',
        variant: 'destructive',
      });
    } finally {
      if (!cancelledRef?.current && shouldShowLoading) {
        setLoading(false);
      }
    }
  };

  const loadGalleryImages = async () => {
    if (galleryImages.length > 0) return;
    setLoadingGalleryImages(true);
    try {
      const result = await galleryService.listAllImages();
      setGalleryImages(
        result.map((img) => ({
          id: img.id,
          url: img.url,
          name: img.name.replace(/\.[^/.]+$/, ''),
        }))
      );
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setLoadingGalleryImages(false);
    }
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      toast({
        title: 'Error',
        description: 'El título en español es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    if (!form.categoria || form.categoria.trim() === '' || isNaN(parseInt(form.categoria))) {
      toast({
        title: '⚠️ Categoría requerida',
        description: 'Debes seleccionar una categoría para el proyecto',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (proyectoId) {
        // Actualizar proyecto existente
        const projectIdNum = parseInt(proyectoId);
        
        // NO actualizar el slug en proyectos existentes para evitar conflictos
        const updateData = {
          category_id: parseInt(form.categoria),
          image_urls: form.imagenes,
          is_active: form.estado === 'publicado',
        };
        
        const { error: projectError } = await supabase
          .from('projects')
          .update(updateData)
          .eq('id', projectIdNum)
          .select();

        if (projectError) {
          console.error('❌ Error actualizando proyecto:', projectError);
          throw projectError;
        }

        // Actualizar traducciones - BATCH UPSERT (1 sola llamada en vez de 6)
        const translations = [
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'es', field_name: 'name', value: form.titulo },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'en', field_name: 'name', value: form.titulo_en || '' },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'it', field_name: 'name', value: form.titulo_it || '' },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'es', field_name: 'description', value: form.descripcion || '' },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'en', field_name: 'description', value: form.descripcion_en || '' },
          { entity_type: 'project', entity_id: projectIdNum, language_code: 'it', field_name: 'description', value: form.descripcion_it || '' },
        ];

        const { error: translationsError } = await supabase
          .from('translations')
          .upsert(translations, {
            onConflict: 'entity_type,entity_id,language_code,field_name'
          })
          .select();

        if (translationsError) {
          console.error('❌ Error guardando traducciones:', translationsError);
          throw translationsError;
        }

        toast({
          title: '✅ Proyecto actualizado',
          description: 'Los cambios se guardaron correctamente',
        });

        setTimeout(() => {
          onBack();
        }, 500);
      } else {
        // Crear nuevo proyecto
        // Primero generar slug base
        let baseSlug = form.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Verificar si el slug ya existe y generar uno único
        let slug = baseSlug;
        let counter = 1;
        let slugExists = true;
        
        while (slugExists) {
          const { data: existingProject } = await supabase
            .from('projects')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();
          
          if (!existingProject) {
            slugExists = false;
          } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
        }

        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .insert({
            category_id: parseInt(form.categoria),
            slug,
            image_urls: form.imagenes,
            display_order: 999,
            is_active: form.estado === 'publicado',
          })
          .select()
          .single();

        if (projectError) throw projectError;

        // Crear traducciones - BATCH INSERT (1 sola llamada en vez de 6)
        const translations = [
          { entity_type: 'project', entity_id: projectData.id, language_code: 'es', field_name: 'name', value: form.titulo },
          { entity_type: 'project', entity_id: projectData.id, language_code: 'en', field_name: 'name', value: form.titulo_en || '' },
          { entity_type: 'project', entity_id: projectData.id, language_code: 'it', field_name: 'name', value: form.titulo_it || '' },
          { entity_type: 'project', entity_id: projectData.id, language_code: 'es', field_name: 'description', value: form.descripcion || '' },
          { entity_type: 'project', entity_id: projectData.id, language_code: 'en', field_name: 'description', value: form.descripcion_en || '' },
          { entity_type: 'project', entity_id: projectData.id, language_code: 'it', field_name: 'description', value: form.descripcion_it || '' },
        ];

        const { error: translationsError } = await supabase
          .from('translations')
          .insert(translations);

        if (translationsError) {
          console.error('Error guardando traducciones:', translationsError);
          throw translationsError;
        }

        toast({
          title: '✅ Proyecto creado',
          description: 'El proyecto se creó correctamente',
        });

        setTimeout(() => {
          onBack();
        }, 500);
      }
    } catch (error) {
      console.error('Error guardando proyecto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el proyecto',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddImagesFromComputer = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length === 0) return;

      try {
        setSaving(true);
        const uploadPromises = files.map(file => galleryService.uploadImage(file));
        const uploadedImages = await Promise.all(uploadPromises);
        const urls = uploadedImages.map(img => img.url);
        
        setForm((prev) => ({
          ...prev,
          imagenes: [...prev.imagenes, ...urls],
        }));
        
        setShowImageSourceDialog(false);
        toast({
          title: '✅ Imágenes subidas',
          description: `Se subieron ${files.length} imagen${files.length > 1 ? 'es' : ''} correctamente`,
        });
      } catch (error) {
        console.error('Error uploading images:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron subir las imágenes',
          variant: 'destructive',
        });
      } finally {
        setSaving(false);
      }
    };
    input.click();
  };

  const handleAddImagesFromGallery = () => {
    setShowImageSourceDialog(false);
    setShowGalleryModal(true);
    loadGalleryImages();
  };

  const agregarImagenesDeGaleria = (urls: string[]) => {
    setForm((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...urls],
    }));
    setShowGalleryModal(false);
  };

  const eliminarImagen = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const moverImagen = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= form.imagenes.length) return;
    
    setForm((prev) => {
      const newImages = [...prev.imagenes];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return { ...prev, imagenes: newImages };
    });
  };

  const filteredGalleryImages = galleryImages.filter((img) =>
    img.name.toLowerCase().includes(gallerySearchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Volver a proyectos</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {proyectoId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">Completa la información en todos los idiomas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alerta de estado de traducciones */}
          {form.titulo && (
            (() => {
              // Solo verificar traducciones si existe contenido en español
              const hasSpanishTitle = form.titulo.trim().length > 0;
              const hasSpanishDesc = form.descripcion && form.descripcion.trim().length > 0;
              
              // Verificar traducciones solo para campos que existen en español
              const titleMissingEN = hasSpanishTitle && !form.titulo_en?.trim();
              const titleMissingIT = hasSpanishTitle && !form.titulo_it?.trim();
              
              const descMissingEN = hasSpanishDesc && !form.descripcion_en?.trim();
              const descMissingIT = hasSpanishDesc && !form.descripcion_it?.trim();
              
              // Si hay descripción en español, debe estar traducida. Si no hay descripción, no importa.
              const missingEN = titleMissingEN || descMissingEN;
              const missingIT = titleMissingIT || descMissingIT;
              
              const allTranslated = !missingEN && !missingIT;

              if (allTranslated) {
                return (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">Todas las traducciones completas</p>
                      <p className="text-xs text-green-700 mt-0.5">Este proyecto está disponible en los 3 idiomas</p>
                    </div>
                  </div>
                );
              }

              if (missingEN && missingIT) {
                return (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">Faltan traducciones</p>
                      <p className="text-xs text-yellow-700 mt-0.5">Este proyecto no está traducido al inglés ni italiano</p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleTranslateProject}
                      disabled={saving}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {saving ? 'Traduciendo...' : '✨ Traducir todo'}
                    </Button>
                  </div>
                );
              }

              return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <span className="text-blue-600 text-xl">ℹ️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Traducciones incompletas</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Faltan: {missingEN && 'Inglés'}{missingEN && missingIT && ', '}{missingIT && 'Italiano'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleTranslateProject}
                    disabled={saving}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {saving ? 'Traduciendo...' : '✨ Completar'}
                  </Button>
                </div>
              );
            })()
          )}

          {/* Tabs de idiomas con botón de traducción */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveLanguageTab('ES')}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors ${
                  activeLanguageTab === 'ES'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-base">🇪🇸</span> ES
              </button>
              <button
                type="button"
                onClick={() => setActiveLanguageTab('EN')}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors relative ${
                  activeLanguageTab === 'EN'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-base">🇬🇧</span> EN
                {(() => {
                  const hasSpanishTitle = form.titulo.trim().length > 0;
                  const hasSpanishDesc = form.descripcion && form.descripcion.trim().length > 0;
                  
                  const hasTitleEN = form.titulo_en?.trim().length > 0;
                  const hasDescEN = form.descripcion_en?.trim().length > 0;
                  
                  // Si hay título en español, debe tener traducción. Mismo para descripción.
                  const titleComplete = hasSpanishTitle ? hasTitleEN : true;
                  const descComplete = hasSpanishDesc ? hasDescEN : true;
                  
                  if (titleComplete && descComplete) {
                    return <span className="text-xs text-green-600 font-bold">✓</span>;
                  } else if (hasTitleEN || hasDescEN) {
                    return <span className="text-xs text-yellow-600">◐</span>;
                  } else {
                    return <span className="text-xs text-red-600">✗</span>;
                  }
                })()}
              </button>
              <button
                type="button"
                onClick={() => setActiveLanguageTab('IT')}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-colors relative ${
                  activeLanguageTab === 'IT'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-base">🇮🇹</span> IT
                {(() => {
                  const hasSpanishTitle = form.titulo.trim().length > 0;
                  const hasSpanishDesc = form.descripcion && form.descripcion.trim().length > 0;
                  
                  const hasTitleIT = form.titulo_it?.trim().length > 0;
                  const hasDescIT = form.descripcion_it?.trim().length > 0;
                  
                  // Si hay título en español, debe tener traducción. Mismo para descripción.
                  const titleComplete = hasSpanishTitle ? hasTitleIT : true;
                  const descComplete = hasSpanishDesc ? hasDescIT : true;
                  
                  if (titleComplete && descComplete) {
                    return <span className="text-xs text-green-600 font-bold">✓</span>;
                  } else if (hasTitleIT || hasDescIT) {
                    return <span className="text-xs text-yellow-600">◐</span>;
                  } else {
                    return <span className="text-xs text-red-600">✗</span>;
                  }
                })()}
              </button>
            </div>

            {/* Formulario por idioma */}
            <div className="space-y-3">
              <div>
                <Label htmlFor={`titulo-${activeLanguageTab}`} className="text-sm">
                  Título {activeLanguageTab === 'ES' && '*'}
                </Label>
                <Input
                  id={`titulo-${activeLanguageTab}`}
                  value={
                    activeLanguageTab === 'ES'
                      ? form.titulo
                      : activeLanguageTab === 'EN'
                      ? form.titulo_en
                      : form.titulo_it
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [activeLanguageTab === 'ES'
                        ? 'titulo'
                        : activeLanguageTab === 'EN'
                        ? 'titulo_en'
                        : 'titulo_it']: e.target.value,
                    }))
                  }
                  placeholder={`Título del proyecto en ${
                    activeLanguageTab === 'ES' ? 'español' : activeLanguageTab === 'EN' ? 'inglés' : 'italiano'
                  }`}
                  className="text-base"
                />
              </div>

              <div>
                <Label htmlFor={`descripcion-${activeLanguageTab}`} className="text-sm">Descripción</Label>
                <textarea
                  id={`descripcion-${activeLanguageTab}`}
                  value={
                    activeLanguageTab === 'ES'
                      ? form.descripcion
                      : activeLanguageTab === 'EN'
                      ? form.descripcion_en
                      : form.descripcion_it
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [activeLanguageTab === 'ES'
                        ? 'descripcion'
                        : activeLanguageTab === 'EN'
                        ? 'descripcion_en'
                        : 'descripcion_it']: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder={`Descripción del proyecto en ${
                    activeLanguageTab === 'ES' ? 'español' : activeLanguageTab === 'EN' ? 'inglés' : 'italiano'
                  }`}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Galería de imágenes */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Imágenes del proyecto</h3>
                <p className="text-xs text-gray-500">La primera imagen será la portada</p>
              </div>
              <Button
                onClick={() => setShowImageSourceDialog(true)}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar imágenes
              </Button>
            </div>

            {form.imagenes.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No hay imágenes agregadas</p>
                <Button
                  onClick={() => setShowImageSourceDialog(true)}
                  variant="outline"
                >
                  Agregar imágenes
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {form.imagenes.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        Portada
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-2">
                      <button
                        onClick={() => moverImagen(index, index - 1)}
                        disabled={index === 0}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-white text-gray-900 rounded disabled:opacity-50"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => eliminarImagen(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => moverImagen(index, index + 1)}
                        disabled={index === form.imagenes.length - 1}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-white text-gray-900 rounded disabled:opacity-50"
                      >
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Configuración */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Configuración</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="categoria">Categoría *</Label>
                {showNuevaCategoriaInput ? (
                  // Input para crear nueva categoría
                  <div className="space-y-2">
                    <Input
                      id="nueva-categoria"
                      value={nuevaCategoria}
                      onChange={(e) => setNuevaCategoria(e.target.value)}
                      placeholder="Nombre de la nueva categoría..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (nuevaCategoria.trim()) {
                            setForm((prev) => ({ ...prev, categoria: nuevaCategoria.trim() }));
                            setNuevaCategoria('');
                            setShowNuevaCategoriaInput(false);
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Agregar
                      </Button>
                      <Button
                        onClick={() => {
                          setNuevaCategoria('');
                          setShowNuevaCategoriaInput(false);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Selector de categoría existente
                  <div className="space-y-2">
                    <select
                      id="categoria"
                      value={form.categoria}
                      onChange={(e) => setForm((prev) => ({ ...prev, categoria: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categoriasDisponibles.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={() => setShowNuevaCategoriaInput(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Botón guardar */}
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full bg-black hover:bg-gray-800 text-white mt-6"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Proyecto'
              )}
            </Button>
          </div>

          {/* Vista previa */}
          {form.imagenes.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Vista previa</h3>
                {proyectoId && projectSlug && form.categoria && (
                  <button
                    onClick={() => {
                      // Obtener el slug de la categoría seleccionada
                      const categoria = categoriasDisponibles.find(c => c.id.toString() === form.categoria);
                      if (categoria) {
                        // Construir URL: /es/proyectos/:categoriaSlug/:proyectoSlug
                        const webUrl = `http://localhost:5173/es/proyectos/${categoria.slug}/${projectSlug}`;
                        window.open(webUrl, '_blank');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver cómo se verá en la web"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Ver en web</span>
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <img
                  src={form.imagenes[0]}
                  alt="Portada"
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <h4 className="font-semibold text-gray-900">{form.titulo || 'Sin título'}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{form.descripcion || 'Sin descripción'}</p>
                {categoriasDisponibles.find(c => c.id.toString() === form.categoria) && (
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    {categoriasDisponibles.find(c => c.id.toString() === form.categoria)?.nombre}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de selección de fuente de imagen */}
      {showImageSourceDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImageSourceDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Agregar Imagen</h2>
            <p className="text-gray-600 mb-6">¿Desde dónde quieres agregar la imagen?</p>
            
            <div className="space-y-3">
              <button
                onClick={handleAddImagesFromComputer}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Subir desde mi computadora</p>
                  <p className="text-sm text-gray-500">Seleccionar archivos locales</p>
                </div>
              </button>
              
              <button
                onClick={handleAddImagesFromGallery}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Galería del Admin</p>
                  <p className="text-sm text-gray-500">Usar imágenes ya subidas</p>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowImageSourceDialog(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de galería */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Seleccionar imágenes de la galería</h2>
                <button
                  onClick={() => setShowGalleryModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <Input
                placeholder="Buscar imágenes..."
                value={gallerySearchTerm}
                onChange={(e) => setGallerySearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingGalleryImages ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredGalleryImages.map((img) => {
                    const isSelected = form.imagenes.includes(img.url);
                    return (
                      <button
                        key={img.id}
                        onClick={() => {
                          if (isSelected) {
                            setForm((prev) => ({
                              ...prev,
                              imagenes: prev.imagenes.filter((url) => url !== img.url),
                            }));
                          } else {
                            setForm((prev) => ({
                              ...prev,
                              imagenes: [...prev.imagenes, img.url],
                            }));
                          }
                        }}
                        className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-400'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full aspect-video object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-blue-600 text-white rounded-full p-2">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                {form.imagenes.length} {form.imagenes.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowGalleryModal(false)}>Cancelar</Button>
                <Button onClick={() => setShowGalleryModal(false)} className="bg-black hover:bg-gray-800 text-white">
                  Agregar imágenes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
