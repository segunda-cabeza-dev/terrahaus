
import { useState } from 'react';

export default function Contactos() {
  // Ejemplo de datos para mostrar algo funcional
  const [contacts] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@correo.com',
      created_at: new Date().toISOString(),
      mensaje: 'Hola, quiero más información.'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Pan de miga */}
      <nav className="text-sm text-gray-500 flex items-center space-x-2 mb-4" aria-label="Breadcrumb">
        <a href="/dashboard" className="hover:underline text-gray-600">Panel de Administración</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">Contactos</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold">Formularios de Contacto</h1>
        <p className="text-gray-600 mt-2">Mensajes recibidos</p>
      </div>
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="text-gray-600">No hay mensajes de contacto</div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="border rounded p-4 bg-white">
              <div className="font-bold">{contact.nombre}</div>
              <div className="text-sm text-gray-500">{contact.email}</div>
              <div className="text-xs text-gray-400">{new Date(contact.created_at).toLocaleString()}</div>
              <div className="mt-2 text-gray-700">{contact.mensaje}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
