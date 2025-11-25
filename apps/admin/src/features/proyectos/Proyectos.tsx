

export default function Proyectos() {
  // Ejemplo de categorías para mostrar algo funcional
  const categories = [
    {
      id: 1,
      nombre: 'Barandillas',
      descripcion: 'Railings',
      proyectos: 8,
      imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'
    },
    {
      id: 2,
      nombre: 'Barbacoas',
      descripcion: 'BBQ',
      proyectos: 7,
      imagen: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600'
    }
    // ...agrega más si quieres
  ];

  return (
    <div className="space-y-6">
      {/* Pan de miga */}
      <nav className="text-sm text-gray-500 flex items-center space-x-2 mb-4" aria-label="Breadcrumb">
        <a href="/dashboard" className="hover:underline text-gray-600">Panel de Administración</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">Proyectos</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold">Categorías de Proyectos</h1>
        <p className="text-gray-600 mt-2">Aquí podrás gestionar los proyectos del sistema.</p>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <img src={cat.imagen} alt={cat.nombre} className="w-full h-32 object-cover rounded mb-2" />
              <div className="font-bold text-lg">{cat.nombre}</div>
              <div className="text-sm text-gray-500">{cat.descripcion}</div>
              <div className="text-xs text-gray-400">{cat.proyectos} proyectos</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
