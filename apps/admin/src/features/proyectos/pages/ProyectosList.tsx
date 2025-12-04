import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, useToast } from '@beltrame/shared';
import { PageHeader } from '@/shared/components/PageHeader';
import { Plus, Edit, Trash2, Folder, Search, Settings, LayoutGrid, X } from 'lucide-react';
import { useProyectosData } from '../hooks/useProyectosData';

export function ProyectosList() {
  const { toast } = useToast();
  const { proyectos, categorias, loading, refetch } = useProyectosData();
  
  const [categoriaActiva, setCategoriaActiva] = useState<number | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const proyectosPorPagina = 12;
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  const eliminarProyecto = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    
    try {
      // Eliminar el proyecto (el trigger eliminará automáticamente las traducciones)
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (projectError) {
        console.error('Error eliminando proyecto:', projectError);
        throw projectError;
      }

      toast({
        title: '✅ Proyecto eliminado',
        description: 'El proyecto se eliminó correctamente',
      });
      
      refetch();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proyecto',
        variant: 'destructive',
      });
    }
  };

  const proyectosFiltrados = proyectos.filter(p => {
    const matchCategoria = categoriaActiva === 'todos' || p.category_id === categoriaActiva;
    const busquedaLower = busqueda.trim().toLowerCase();
    const matchBusqueda = busquedaLower === '' || 
                         (p.nombre && p.nombre.toLowerCase().includes(busquedaLower)) ||
                         (p.descripcion && p.descripcion.toLowerCase().includes(busquedaLower)) ||
                         (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(busquedaLower));
    return matchCategoria && matchBusqueda;
  });

  // Paginación
  const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);
  const indiceInicio = (paginaActual - 1) * proyectosPorPagina;
  const indiceFin = indiceInicio + proyectosPorPagina;
  const proyectosPaginados = proyectosFiltrados.slice(indiceInicio, indiceFin);

  // Reset página cuando cambia el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva, busqueda]);

  // Detectar proyectos sin traducir
  const proyectosSinTraducir = proyectos.filter(p => {
    // Si no tiene contenido en español, no se considera sin traducir (se ignora)
    const hasSpanishTitle = p.nombre && p.nombre.trim().length > 0;
    const hasSpanishDesc = p.descripcion && p.descripcion.trim().length > 0;
    
    // Si no tiene nada en español, no lo consideramos
    if (!hasSpanishTitle) return false;
    
    // Verificar si las traducciones están completas
    const titleMissingEN = !p.nombre_en || p.nombre_en.trim() === '';
    const titleMissingIT = !p.nombre_it || p.nombre_it.trim() === '';
    
    // Para descripción, solo verificar si existe en español
    let descMissingEN = false;
    let descMissingIT = false;
    
    if (hasSpanishDesc) {
      descMissingEN = !p.descripcion_en || p.descripcion_en.trim() === '';
      descMissingIT = !p.descripcion_it || p.descripcion_it.trim() === '';
    }
    
    // Está sin traducir si falta al menos una traducción
    return titleMissingEN || titleMissingIT || descMissingEN || descMissingIT;
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

  // Función para traducir todos los proyectos sin traducir
  const traducirTodosLosProyectos = async () => {
    if (!confirm(`¿Deseas traducir automáticamente ${proyectosSinTraducir.length} proyecto(s) sin traducir?`)) return;

    toast({
      title: '🔄 Traduciendo proyectos...',
      description: `Procesando ${proyectosSinTraducir.length} proyectos`,
    });

    let successCount = 0;
    let errorCount = 0;

    for (const proyecto of proyectosSinTraducir) {
      try {
        const hasSpanishTitle = proyecto.nombre && proyecto.nombre.trim().length > 0;
        const hasSpanishDesc = proyecto.descripcion && proyecto.descripcion.trim().length > 0;

        // SOLO traducir lo que falta
        const needsENTitle = hasSpanishTitle && (!proyecto.nombre_en || proyecto.nombre_en.trim() === '');
        const needsITTitle = hasSpanishTitle && (!proyecto.nombre_it || proyecto.nombre_it.trim() === '');
        const needsENDesc = hasSpanishDesc && (!proyecto.descripcion_en || proyecto.descripcion_en.trim() === '');
        const needsITDesc = hasSpanishDesc && (!proyecto.descripcion_it || proyecto.descripcion_it.trim() === '');

        const translations = [];

        // Traducir título EN si falta
        if (needsENTitle) {
          const tituloEN = await translateText(proyecto.nombre!, 'en');
          translations.push({ 
            entity_type: 'project', 
            entity_id: proyecto.id, 
            language_code: 'en', 
            field_name: 'name', 
            value: tituloEN 
          });
        }

        // Traducir título IT si falta
        if (needsITTitle) {
          const tituloIT = await translateText(proyecto.nombre!, 'it');
          translations.push({ 
            entity_type: 'project', 
            entity_id: proyecto.id, 
            language_code: 'it', 
            field_name: 'name', 
            value: tituloIT 
          });
        }

        // Traducir descripción EN si falta
        if (needsENDesc) {
          const descripcionEN = await translateText(proyecto.descripcion!, 'en');
          translations.push({ 
            entity_type: 'project', 
            entity_id: proyecto.id, 
            language_code: 'en', 
            field_name: 'description', 
            value: descripcionEN 
          });
        }

        // Traducir descripción IT si falta
        if (needsITDesc) {
          const descripcionIT = await translateText(proyecto.descripcion!, 'it');
          translations.push({ 
            entity_type: 'project', 
            entity_id: proyecto.id, 
            language_code: 'it', 
            field_name: 'description', 
            value: descripcionIT 
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
            console.error(`Error traduciendo proyecto ${proyecto.id}:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        }
      } catch (error) {
        console.error(`Error procesando proyecto ${proyecto.id}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: '✅ Traducción completada',
        description: `${successCount} proyecto(s) traducido(s) correctamente${errorCount > 0 ? `. ${errorCount} con errores` : ''}`,
      });
      refetch();
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo traducir ningún proyecto',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyectos"
        description="Gestiona todos tus proyectos desde un solo lugar"
        actions={
          <div className="flex items-center gap-3">
            {/* Toggle de vista */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Link
                to="/admin/proyectos"
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-all bg-white text-blue-600 shadow-sm"
              >
                <LayoutGrid size={18} />
                <span className="font-medium">Proyectos</span>
              </Link>
              <Link
                to="/admin/proyectos/categorias"
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-all text-gray-600 hover:text-gray-900"
              >
                <Folder size={18} />
                <span className="font-medium">Categorías</span>
              </Link>
            </div>

            {/* Botón principal */}
            <Link
              to="/admin/proyectos/nuevo"
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nuevo Proyecto</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de categorías */}
        <div className="lg:col-span-1 space-y-4">
          {/* Buscador */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar proyectos..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Filtrar por categoría</h3>
              <Link
                to="/admin/proyectos/categorias"
                className="text-blue-600 hover:text-blue-700"
                title="Gestionar categorías"
              >
                <Settings size={18} />
              </Link>
            </div>
            
            {/* Dropdown personalizado - Solo móvil */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-400 transition-all flex items-center justify-between"
              >
                <span>
                  {categoriaActiva === 'todos' 
                    ? `Todos los proyectos (${proyectos.length})`
                    : `${categorias.find(c => c.id === categoriaActiva)?.nombre || ''} (${categorias.find(c => c.id === categoriaActiva)?.projectCount || 0})`
                  }
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform ${dropdownAbierto ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownAbierto && (
                <>
                  {/* Overlay para cerrar al hacer clic fuera */}
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownAbierto(false)}
                  />
                  
                  {/* Menú desplegable */}
                  <div 
                    className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#999 transparent'
                    }}
                  >
                    <style>
                      {`
                        .dropdown-menu::-webkit-scrollbar {
                          width: 6px;
                        }
                        .dropdown-menu::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .dropdown-menu::-webkit-scrollbar-thumb {
                          background-color: #999;
                          border-radius: 3px;
                        }
                      `}
                    </style>
                    <button
                      onClick={() => {
                        setCategoriaActiva('todos');
                        setDropdownAbierto(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-black hover:text-white transition-colors ${
                        categoriaActiva === 'todos' ? 'font-bold bg-gray-50' : ''
                      }`}
                    >
                      Todos los proyectos ({proyectos.length})
                    </button>
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoriaActiva(cat.id);
                          setDropdownAbierto(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-black hover:text-white transition-colors border-t border-gray-100 ${
                          categoriaActiva === cat.id ? 'font-bold bg-gray-50' : ''
                        }`}
                      >
                        {cat.nombre} ({cat.projectCount})
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Botones - Solo desktop */}
            <div className="hidden lg:block space-y-1">
              <button
                onClick={() => setCategoriaActiva('todos')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  categoriaActiva === 'todos'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder size={16} />
                  Todos los proyectos
                </span>
                <span className="text-sm font-medium">{proyectos.length}</span>
              </button>
              
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaActiva(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    categoriaActiva === cat.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Folder size={16} />
                    {cat.nombre}
                  </span>
                  <span className="text-sm font-medium">{cat.projectCount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de proyectos */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando proyectos...</p>
            </div>
          ) : proyectosFiltrados.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="max-w-sm mx-auto">
                <Folder size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {busqueda ? 'No se encontraron proyectos' : 'No hay proyectos todavía'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {busqueda 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Comienza creando tu primer proyecto'}
                </p>
                {!busqueda && (
                  <Link
                    to="/admin/proyectos/nuevo"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    Crear proyecto
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              {busqueda && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-800">
                    Se encontraron <strong>{proyectosFiltrados.length}</strong> proyecto{proyectosFiltrados.length !== 1 ? 's' : ''} que coinciden con "{busqueda}"
                  </p>
                </div>
              )}
              
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {proyectosPaginados.map((proyecto) => (
                  <div
                    key={proyecto.id}
                    className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Imagen */}
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      {proyecto.imagen_principal ? (
                        <img
                          src={proyecto.imagen_principal}
                          alt={proyecto.nombre || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Folder size={48} />
                        </div>
                      )}
                      
                      {/* Badge de categoría */}
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-blue-600 text-white">
                          {proyecto.categoria_nombre || 'Sin categoría'}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {proyecto.nombre || 'Sin título'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                        {proyecto.descripcion || '\u00A0'}
                      </p>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 mt-auto">
                        <Link
                          to={`/admin/proyectos/${proyecto.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                        >
                          <Edit size={14} />
                          Editar
                        </Link>
                        <button
                          onClick={() => eliminarProyecto(proyecto.id)}
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

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                    disabled={paginaActual === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  
                  {/* Números de página - Solo en desktop */}
                  <div className="hidden md:flex items-center gap-2">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                      <button
                        key={numero}
                        onClick={() => setPaginaActual(numero)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          paginaActual === numero
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {numero}
                      </button>
                    ))}
                  </div>

                  {/* Indicador de página - Solo en móvil */}
                  <div className="md:hidden px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                    {paginaActual} / {totalPaginas}
                  </div>

                  <button
                    onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                    disabled={paginaActual === totalPaginas}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
