import { useState, useEffect } from 'react';
import { PageHeader } from '../../shared';
import { supabase } from '@beltrame/shared/lib/supabase';
import { Mail, Phone, Calendar, CheckCircle, Circle, Loader2, Trash2, Eye } from 'lucide-react';

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
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);

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
          if (selectedContact?.id === updatedContact.id) {
            setSelectedContact(updatedContact);
          }
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
          if (selectedContact?.id === deletedId) {
            setSelectedContact(null);
          }
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
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContacts(contacts.filter(c => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Lista de mensajes */}
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay mensajes de contacto</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => {
                  setSelectedContact(contact);
                  if (!contact.is_read) toggleRead(contact);
                }}
                className={`border rounded-lg p-4 bg-white cursor-pointer transition-all hover:shadow-md ${
                  selectedContact?.id === contact.id ? 'ring-2 ring-black' : ''
                } ${!contact.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {contact.is_read ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                      <span className={`font-semibold truncate ${!contact.is_read ? 'text-black' : 'text-gray-700'}`}>
                        {contact.full_name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{contact.message}</p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(contact.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel de detalle */}
        {selectedContact && (
          <div className="bg-white border rounded-lg p-6 h-fit sticky top-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg">{selectedContact.full_name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleRead(selectedContact)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={selectedContact.is_read ? 'Marcar como no leído' : 'Marcar como leído'}
                >
                  <Eye className={`w-4 h-4 ${selectedContact.is_read ? 'text-green-500' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                  title="Eliminar mensaje"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${selectedContact.email}`} className="hover:text-black">
                  {selectedContact.email}
                </a>
              </div>
              
              {selectedContact.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedContact.phone}`} className="hover:text-black">
                    {selectedContact.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedContact.created_at)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm text-gray-500 mb-2">Mensaje</h4>
              <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
