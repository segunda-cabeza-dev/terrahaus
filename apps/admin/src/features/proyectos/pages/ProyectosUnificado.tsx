import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, type Project, type Category, useToast } from '@beltrame/shared';
import { PageHeader } from '@/shared/components/PageHeader';
import { Plus, Edit, Trash2, Folder, Search, Settings, LayoutGrid, X } from 'lucide-react';
import { ProyectoEditor } from '../components/ProyectoEditor';
import { CategoriaEditor } from '../components/CategoriaEditor';
import { CategoriaNueva } from '../components/CategoriaNueva';

interface ProjectWithTranslations extends Project {
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

interface CategoryWithTranslations extends Category {
  nombre?: string;
  nombre_en?: string;
  nombre_it?: string;
  projectCount?: number;
  imagen_portada?: string;
}

export function ProyectosUnificado() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [proyectos, setProyectos] = useState<ProjectWithTranslations[]>([]);
  const [categorias, setCategorias] = useState<CategoryWithTranslations[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<number | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState<'proyectos' | 'categorias' | 'editor' | 'editor-categoria' | 'nueva-categoria'>('proyectos');
  const [proyectoEditando, setProyectoEditando] = useState<number | undefined>(undefined);
  const [categoriaProyectoEditando, setCategoriaProyectoEditando] = useState<number | undefined>(undefined);
  const [categoriaEditando, setCategoriaEditando] = useState<number | undefined>(undefined);
  const [paginaActual, setPaginaActual] = useState(1);
  const proyectosPorPagina = 12;
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // Inicializar vista desde URL al cargar
  useEffect(() => {
    const vista = searchParams.get('vista') as 'proyectos' | 'categorias' | 'editor' | 'editor-categoria' | 'nueva-categoria' | null;
    const proyectoId = searchParams.get('proyectoId');
    const categoriaId = searchParams.get('categoriaId');
    
    if (vista) {
      setVistaActual(vista);
      if (proyectoId) setProyectoEditando(parseInt(proyectoId));
      if (categoriaId) setCategoriaEditando(parseInt(categoriaId));
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Resetear vista solo cuando se hace clic en el botón del menú
  useEffect(() => {
    if (location.state?.resetView) {
      navigate('/admin/proyectos', { replace: true });
      setVistaActual('proyectos');
      setProyectoEditando(undefined);
      setCategoriaProyectoEditando(undefined);
      setCategoriaEditando(undefined);
    }
  }, [location.state]);

  // Funciones helper para cambiar vista y actualizar URL
  const irAEditarProyecto = (proyectoId?: number) => {
    if (proyectoId) {
      navigate(`/admin/proyectos?vista=editor&proyectoId=${proyectoId}`);
      setProyectoEditando(proyectoId);
    } else {
      navigate(`/admin/proyectos?vista=editor`);
      setProyectoEditando(undefined);
    }
    setVistaActual('editor');
  };

  const irAEditarCategoria = (categoriaId: number) => {
    navigate(`/admin/proyectos?vista=editor-categoria&categoriaId=${categoriaId}`);
    setCategoriaEditando(categoriaId);
    setVistaActual('editor-categoria');
  };

  const irACategorias = () => {
    navigate(`/admin/proyectos?vista=categorias`);
    setVistaActual('categorias');
  };

  const irANuevaCategoria = () => {
    navigate(`/admin/proyectos?vista=nueva-categoria`);
    setVistaActual('nueva-categoria');
  };

  const volverAProyectos = () => {
    navigate('/admin/proyectos');
    setVistaActual('proyectos');
    setProyectoEditando(undefined);
    setCategoriaEditando(undefined);
  };

  const cargarDatos = async () => {
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

      console.log('✅ Proyectos cargados:', processedProjects.length);
      console.log('✅ Categorías cargadas:', processedCategories.length);
      
      setProyectos(processedProjects);
      setCategorias(processedCategories);
    } catch (error) {
      console.error('Error en cargarDatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProyecto = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    
    try {
      // Primero eliminar las traducciones
      const { error: translationsError } = await supabase
        .from('translations')
        .delete()
        .eq('entity_type', 'project')
        .eq('entity_id', id);

      if (translationsError) {
        console.error('Error eliminando traducciones:', translationsError);
        throw translationsError;
      }

      // Luego eliminar el proyecto
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
      
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proyecto',
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

      // Primero eliminar las traducciones
      const { error: translationsError } = await supabase
        .from('translations')
        .delete()
        .eq('entity_type', 'category')
        .eq('entity_id', id);

      if (translationsError) {
        console.error('Error eliminando traducciones:', translationsError);
        throw translationsError;
      }

      // Luego eliminar la categoría
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
      
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la categoría',
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

  // Si estamos en modo editor de proyecto
  if (vistaActual === 'editor') {
    return (
      <ProyectoEditor
        proyectoId={proyectoEditando?.toString()}
        categoriaInicial={categoriaProyectoEditando?.toString()}
        onBack={() => {
          cargarDatos();
          volverAProyectos();
        }}
      />
    );
  }

  // Si estamos en modo editor de categoría
  if (vistaActual === 'editor-categoria' && categoriaEditando) {
    return (
      <CategoriaEditor
        categoriaId={categoriaEditando}
        onBack={() => {
          cargarDatos();
          irACategorias();
        }}
      />
    );
  }

  // Si estamos en modo crear nueva categoría
  if (vistaActual === 'nueva-categoria') {
    return (
      <CategoriaNueva
        onBack={() => {
          cargarDatos();
          irACategorias();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyectos"
        description={vistaActual === 'proyectos' 
          ? 'Gestiona todos tus proyectos desde un solo lugar' 
          : 'Organiza tus categorías y personaliza sus portadas'}
        actions={
          <div className="flex items-center gap-3">
            {/* Toggle de vista */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={volverAProyectos}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  vistaActual === 'proyectos'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid size={18} />
                <span className="font-medium">Proyectos</span>
              </button>
              <button
                onClick={irACategorias}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  vistaActual === 'categorias'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Folder size={18} />
                <span className="font-medium">Categorías</span>
              </button>
            </div>

            {/* Botón principal */}
            {vistaActual === 'proyectos' ? (
              <button
                onClick={() => irAEditarProyecto()}
                className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Nuevo Proyecto</span>
              </button>
            ) : vistaActual === 'categorias' && (
              <button
                onClick={irANuevaCategoria}
                className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Nueva Categoría</span>
              </button>
            )}
          </div>
        }
      />

      {/* ============================================ */}
      {/* VISTA DE PROYECTOS */}
      {/* ============================================ */}
      {vistaActual === 'proyectos' && (
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
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    console.log('Búsqueda actualizada:', e.target.value);
                  }}
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
                <button
                  onClick={irACategorias}
                  className="text-blue-600 hover:text-blue-700"
                  title="Gestionar categorías"
                >
                  <Settings size={18} />
                </button>
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
                    <button
                      onClick={() => window.location.href = '/admin/proyectos/nuevo'}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={20} />
                      Crear proyecto
                    </button>
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
                          <button
                            onClick={() => irAEditarProyecto(proyecto.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                          >
                            <Edit size={14} />
                            Editar
                          </button>
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
      )}

      {/* ============================================ */}
      {/* VISTA DE CATEGORÍAS */}
      {/* ============================================ */}
      {vistaActual === 'categorias' && (
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Aquí puedes personalizar la imagen de portada de cada categoría. 
              Las categorías se crean automáticamente cuando agregas proyectos.
            </p>
          </div>

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
              <button
                onClick={() => {
                  setProyectoEditando(undefined);
                  setCategoriaProyectoEditando(undefined);
                  setVistaActual('editor');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                Crear primer proyecto
              </button>
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
                      <button
                        onClick={() => irAEditarCategoria(categoria.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                        title="Editar"
                      >
                        <Edit size={14} />
                        Editar
                      </button>
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
      )}
    </div>
  );
}
