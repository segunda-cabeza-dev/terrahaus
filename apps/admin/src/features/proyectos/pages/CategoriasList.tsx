import { Link } from 'react-router-dom';
import { supabase, useToast } from '@beltrame/shared';
import { PageHeader } from '@/shared/components/PageHeader';
import { Plus, Edit, Trash2, Folder, LayoutGrid } from 'lucide-react';
import { useProyectosData } from '../hooks/useProyectosData';

export function CategoriasList() {
  const { toast } = useToast();
  const { categorias, refetch } = useProyectosData();

  // Detectar categorías sin traducir
  const categoriasSinTraducir = categorias.filter(cat => {
    // Si no tiene contenido en español, no se considera sin traducir (se ignora)
    const hasSpanishName = cat.nombre && cat.nombre.trim().length > 0;
    
    // Si no tiene nada en español, no lo consideramos
    if (!hasSpanishName) return false;
    
    // Verificar si las traducciones están completas
    const missingEN = !cat.nombre_en || cat.nombre_en.trim() === '';
    const missingIT = !cat.nombre_it || cat.nombre_it.trim() === '';
    
    // Está sin traducir si falta al menos una traducción
    return missingEN || missingIT;
  });

  // Función para traducir texto
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      if (!response.ok) return text;
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }
      return text;
    } catch (error) {
      console.error(`Translation error for ${targetLang}:`, error);
      return text;
    }
  };

  // Función para traducir todas las categorías sin traducir
  const traducirTodasLasCategorias = async () => {
    if (!confirm(`¿Deseas traducir automáticamente ${categoriasSinTraducir.length} categoría(s) sin traducir?`)) return;

    toast({
      title: '🔄 Traduciendo categorías...',
      description: `Procesando ${categoriasSinTraducir.length} categorías`,
    });

    let successCount = 0;
    let errorCount = 0;

    for (const categoria of categoriasSinTraducir) {
      try {
        const hasSpanishName = categoria.nombre && categoria.nombre.trim().length > 0;
        
        // SOLO traducir lo que falta
        const needsENName = hasSpanishName && (!categoria.nombre_en || categoria.nombre_en.trim() === '');
        const needsITName = hasSpanishName && (!categoria.nombre_it || categoria.nombre_it.trim() === '');

        const translations = [];

        // Traducir nombre EN si falta
        if (needsENName) {
          const nombreEN = await translateText(categoria.nombre!, 'en');
          translations.push({ 
            entity_type: 'category', 
            entity_id: categoria.id, 
            language_code: 'en', 
            field_name: 'name', 
            value: nombreEN 
          });
        }

        // Traducir nombre IT si falta
        if (needsITName) {
          const nombreIT = await translateText(categoria.nombre!, 'it');
          translations.push({ 
            entity_type: 'category', 
            entity_id: categoria.id, 
            language_code: 'it', 
            field_name: 'name', 
            value: nombreIT 
          });
        }

        // Solo hacer upsert si hay traducciones que agregar
        if (translations.length > 0) {
          const { error } = await supabase
            .from('translations')
            .upsert(translations, {
              onConflict: 'entity_type,entity_id,language_code,field_name'
            });

          if (error) {
            console.error(`Error traduciendo categoría ${categoria.id}:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        }
      } catch (error) {
        console.error(`Error procesando categoría ${categoria.id}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: '✅ Traducción completada',
        description: `${successCount} categoría(s) traducida(s) correctamente${errorCount > 0 ? `. ${errorCount} con errores` : ''}`,
      });
      refetch();
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo traducir ninguna categoría',
        variant: 'destructive',
      });
    }
  };

  const eliminarCategoria = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombre}"? Esto NO eliminará los proyectos.`)) return;
    
    try {
      // Verificar si hay proyectos en esta categoría
      const { data: proyectosEnCategoria } = await supabase
        .from('projects')
        .select('id')
        .eq('category_id', id);

      if (proyectosEnCategoria && proyectosEnCategoria.length > 0) {
        toast({
          title: 'No se puede eliminar',
          description: `Esta categoría tiene ${proyectosEnCategoria.length} proyecto(s). Elimínalos primero.`,
          variant: 'destructive',
        });
        return;
      }

      // Eliminar la categoría (el trigger eliminará automáticamente las traducciones)
      const { error: categoryError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (categoryError) {
        console.error('Error eliminando categoría:', categoryError);
        throw categoryError;
      }

      toast({
        title: '✅ Categoría eliminada',
        description: 'La categoría se eliminó correctamente',
      });
      
      refetch();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la categoría',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyectos"
        description="Organiza tus categorías y personaliza sus portadas"
        actions={
          <div className="flex items-center gap-3">
            {/* Toggle de vista */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Link
                to="/admin/proyectos"
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-all text-gray-600 hover:text-gray-900"
              >
                <LayoutGrid size={18} />
                <span className="font-medium">Proyectos</span>
              </Link>
              <Link
                to="/admin/proyectos/categorias"
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-all bg-white text-blue-600 shadow-sm"
              >
                <Folder size={18} />
                <span className="font-medium">Categorías</span>
              </Link>
            </div>

            {/* Botón principal */}
            <Link
              to="/admin/proyectos/categorias/nueva"
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nueva Categoría</span>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Grid de categorías */}
        {categorias.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Folder size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay categorías todavía
            </h3>
            <p className="text-gray-500 mb-6">
              Las categorías se crean automáticamente cuando agregas proyectos
            </p>
            <Link
              to="/admin/proyectos/nuevo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Crear primer proyecto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Imagen de portada */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                  {categoria.imagen_portada ? (
                    <img
                      src={categoria.imagen_portada}
                      alt={categoria.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Folder size={64} className="text-blue-400" />
                    </div>
                  )}

                  {/* Badge cantidad */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900 shadow-sm">
                      {categoria.projectCount} {categoria.projectCount === 1 ? 'proyecto' : 'proyectos'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-3 group-hover:text-blue-600 transition-colors">
                    {categoria.nombre}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/proyectos/categorias/${categoria.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                      title="Editar"
                    >
                      <Edit size={14} />
                      Editar
                    </Link>
                    <button
                      onClick={() => eliminarCategoria(categoria.id, categoria.nombre || 'esta categoría')}
                      className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
