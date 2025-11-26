import { useState } from 'react';
import { PageHeader } from '../../shared';

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
      <PageHeader
        title="Formularios de Contacto"
        description="Revisa y gestiona los mensajes recibidos de los clientes"
      />
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
