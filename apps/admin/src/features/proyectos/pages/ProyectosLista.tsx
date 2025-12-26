import { useState, useEffect } from 'react';
import { supabase } from '@beltrame/shared';
import { PageHeader } from '@/shared/components/PageHeader';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

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

export function ProyectosLista() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
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
    const matchCategoria = filtroCategoria === 'todos' || p.categoria === filtroCategoria;
    const matchBusqueda = p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                         p.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const categorias = [...new Set(proyectos.map(p => p.categoria))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyectos"
        description="Gestiona los proyectos de tu portfolio"
        actions={
          <button
            onClick={() => window.location.href = '/admin/proyectos/nuevo'}
            className="flex items-center gap-2 px-4 py-2 bg-[#b35427] text-white rounded-lg hover:bg-[#a3471d] transition-colors"
          >
            <Plus size={20} />
            Nuevo Proyecto
          </button>
        }
      />

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título o ubicación..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total: {proyectosFiltrados.length} proyectos</span>
          <span>•</span>
          <span>Publicados: {proyectosFiltrados.filter(p => p.estado === 'publicado').length}</span>
          <span>•</span>
          <span>Borradores: {proyectosFiltrados.filter(p => p.estado === 'borrador').length}</span>
        </div>
      </div>

      {/* Lista de proyectos */}
      {loading ? (
        <div className="text-center py-12">Cargando proyectos...</div>
      ) : proyectosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No hay proyectos todavía</p>
          <button
            onClick={() => window.location.href = '/admin/proyectos/nuevo'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#b35427] text-white rounded-lg hover:bg-[#a3471d]"
          >
            <Plus size={20} />
            Crear tu primer proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectosFiltrados.map((proyecto) => (
            <div
              key={proyecto.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Imagen */}
              <div className="aspect-video bg-gray-200 relative">
                {proyecto.imagen_principal ? (
                  <img
                    src={proyecto.imagen_principal}
                    alt={proyecto.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Sin imagen
                  </div>
                )}
                
                {/* Badge de estado */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      proyecto.estado === 'publicado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {proyecto.estado}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {proyecto.titulo}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {proyecto.descripcion}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {proyecto.categoria}
                  </span>
                  <span>•</span>
                  <span>{proyecto.ubicacion}</span>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(`/proyectos/${proyecto.id}`, '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    <button
                      onClick={() => window.location.href = `/admin/proyectos/editar/${proyecto.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[#b35427] text-white rounded hover:bg-[#a3471d]"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProyecto(proyecto.id)}
                      className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => window.open(`/es/proyectos/${proyecto.id}`, '_blank')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-[#b35427] text-[#b35427] rounded hover:bg-[#f7ede7] mt-1"
                  >
                    🌐 Vista web
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
