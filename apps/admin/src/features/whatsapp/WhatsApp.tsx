
export default function WhatsApp() {
  return (
    <div className="space-y-6">
      {/* Pan de miga */}
      <nav className="text-sm text-gray-500 flex items-center space-x-2 mb-4" aria-label="Breadcrumb">
        <a href="/dashboard" className="hover:underline text-gray-600">Panel de Administración</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">WhatsApp</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold">WhatsApp</h1>
        <p className="text-gray-600 mt-2">Configura la integración de WhatsApp para tu tenant.</p>
      </div>
      <div>
        {/* Formulario de WhatsApp alineado */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow p-8 w-full max-w-xl flex flex-col items-center">
            <div className="flex items-center mb-4">
              <span className="text-green-500 text-3xl mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.042.613 3.938 1.665 5.537L2 22l4.634-1.527A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.798 0-3.484-.527-4.899-1.432l-.35-.222-2.75.906.935-2.687-.22-.347C4.527 15.484 4 13.798 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.293-5.293c-.293-.293-.768-.293-1.061 0l-.646.647a6.978 6.978 0 0 1-3.586-3.586l.647-.646c.293-.293.293-.768 0-1.061l-1.293-1.293c-.293-.293-.768-.293-1.061 0l-.647.647a1.003 1.003 0 0 0-.293.707c0 4.418 3.582 8 8 8a1.003 1.003 0 0 0 .707-.293l.647-.647c.293-.293.293-.768 0-1.061l-1.293-1.293z"/></svg>
              </span>
              <span className="text-xl font-bold">WhatsApp de contacto en la web</span>
            </div>
            <span className="text-gray-600 mb-4">Este número aparecerá como botón flotante en la web</span>
            <div className="flex w-full gap-2">
              <input type="text" className="border rounded px-4 py-2 flex-1" placeholder="Ej: +34 688 860 838" />
              <button className="bg-black text-white px-6 py-2 rounded">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
