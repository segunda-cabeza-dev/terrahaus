import { useState, useEffect } from 'react';
import { supabase } from '@beltrame/shared';
import { PageHeader } from '@/shared/components/PageHeader';
import { Plus, Edit, Trash2, Eye, Folder, Search } from 'lucide-react';

interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  fecha: string;
  imagen_principal: string;
  estado: 'borrador' | 'publicado';
  created_at: string;
}

export function ProyectosListaConSidebar() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProyectos(data);
    }
    setLoading(false);
  };

  const eliminarProyecto = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    
    const { error } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', id);

    if (!error) {
      cargarProyectos();
    }
  };

  const proyectosFiltrados = proyectos.filter(p => {
    const matchCategoria = categoriaActiva === 'todos' || p.categoria === categoriaActiva;
    const matchBusqueda = busqueda === '' || 
                         p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                         p.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  // Agrupar por categoría
  const categorias = proyectos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyectos"
        description="Gestiona todo tu portfolio desde un solo lugar"
        actions={
          <button
            onClick={() => window.location.href = '/admin/proyectos/nuevo'}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span className="font-medium">Nuevo Proyecto</span>
          </button>
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
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Categorías</h3>
            <div className="space-y-1">
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
                  Todos
                </span>
                <span className="text-sm font-medium">{proyectos.length}</span>
              </button>
              
              {Object.entries(categorias).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    categoriaActiva === cat
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Folder size={16} />
                    {cat}
                  </span>
                  <span className="text-sm font-medium">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Publicados</span>
                <span className="font-medium text-green-600">
                  {proyectos.filter(p => p.estado === 'publicado').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Borradores</span>
                <span className="font-medium text-yellow-600">
                  {proyectos.filter(p => p.estado === 'borrador').length}
                </span>
              </div>
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
              {/* Header con contador */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold text-gray-900">{proyectosFiltrados.length}</span> {proyectosFiltrados.length === 1 ? 'proyecto' : 'proyectos'}
                  {categoriaActiva !== 'todos' && <> en <span className="font-semibold text-blue-600">{categoriaActiva}</span></>}
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {proyectosFiltrados.map((proyecto) => (
                  <div
                    key={proyecto.id}
                    className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Imagen */}
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      {proyecto.imagen_principal ? (
                        <img
                          src={proyecto.imagen_principal}
                          alt={proyecto.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Folder size={48} />
                        </div>
                      )}
                      
                      {/* Badge de estado */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            proyecto.estado === 'publicado'
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}
                        >
                          {proyecto.estado === 'publicado' ? '✓ Publicado' : 'Borrador'}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {proyecto.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {proyecto.descripcion}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">
                          {proyecto.categoria}
                        </span>
                        <span>•</span>
                        <span>{proyecto.ubicacion}</span>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/proyectos/${proyecto.id}`, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/proyectos/editar/${proyecto.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProyecto(proyecto.id)}
                          className="px-3 py-2.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
