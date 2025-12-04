import { useState, useEffect } from 'react';
import { PageHeader } from '../../shared';
import { supabase } from '@beltrame/shared/lib/supabase';
import { Mail, Phone, CheckCircle, Circle, Loader2, Trash2, Eye } from 'lucide-react';

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  notes: string | null;
  created_at: string;
}

export default function Contactos() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();

    // 🔄 Configurar Realtime para recibir nuevos mensajes al instante
    const channel = supabase
      .channel('contact_messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('📬 Nuevo mensaje de contacto recibido!', payload.new);
          const newContact = payload.new as ContactMessage;
          setContacts(prev => [newContact, ...prev]);
          // Opcional: notificación sonora o visual
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nuevo mensaje de contacto', {
              body: `${newContact.full_name}: ${newContact.message.substring(0, 50)}...`,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('📝 Mensaje actualizado', payload.new);
          const updatedContact = payload.new as ContactMessage;
          setContacts(prev => prev.map(c => 
            c.id === updatedContact.id ? updatedContact : c
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('🗑️ Mensaje eliminado', payload.old);
          const deletedId = (payload.old as { id: string }).id;
          setContacts(prev => prev.filter(c => c.id !== deletedId));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime activo en Contactos - Recibirás mensajes al instante');
        }
      });

    // Limpiar suscripción al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Solicitar permisos de notificación al cargar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (contact: ContactMessage) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !contact.is_read })
        .eq('id', contact.id);

      if (error) throw error;
      setContacts(contacts.map(c => 
        c.id === contact.id ? { ...c, is_read: !c.is_read } : c
      ));
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;
    
    console.log('🗑️ Intentando eliminar mensaje:', id);
    
    try {
      // Usar función RPC que bypasea RLS
      const { error, data } = await supabase
        .rpc('delete_contact_message', { message_id: id });

      console.log('Resultado del borrado:', { error, data });

      if (error) {
        console.error('❌ Error al borrar:', error);
        throw error;
      }

      console.log('✅ Mensaje eliminado correctamente');
      // Actualizar estado local
      setContacts(contacts.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error al eliminar el mensaje. Verifica los permisos en Supabase.');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Formularios de Contacto"
          description="Revisa y gestiona los mensajes recibidos de los clientes"
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Cargando mensajes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formularios de Contacto"
        description={`${contacts.length} mensaje${contacts.length !== 1 ? 's' : ''} recibido${contacts.length !== 1 ? 's' : ''}`}
      />
      
      {/* Vista de lista estilo inbox */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {contacts.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay mensajes de contacto</p>
          </div>
        ) : (
          <div className="divide-y">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !contact.is_read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Indicador de leído/no leído */}
                  <div className="pt-1">
                    {contact.is_read ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-blue-500 animate-pulse" />
                    )}
                  </div>

                  {/* Contenido principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-base truncate ${
                          !contact.is_read ? 'text-black' : 'text-gray-700'
                        }`}>
                          {contact.full_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <a 
                            href={`mailto:${contact.email}`} 
                            className="hover:text-blue-600 truncate flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            {contact.email}
                          </a>
                          {contact.phone && (
                            <a 
                              href={`tel:${contact.phone}`} 
                              className="hover:text-blue-600 flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                              {contact.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(contact.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Mensaje */}
                    <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                      {contact.message}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(contact);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title={contact.is_read ? 'Marcar como no leído' : 'Marcar como leído'}
                    >
                      <Eye className={`w-4 h-4 ${contact.is_read ? 'text-green-500' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteContact(contact.id);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar mensaje"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
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
