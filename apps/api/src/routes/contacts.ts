import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { contacts, NewContact } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';

interface CreateContactBody {
  name: string;
  email: string;
  phone?: string;
  reformType?: string;
  message?: string;
  source?: string;
}

export async function contactRoutes(fastify: FastifyInstance) {
  // Crear contacto (para formularios)
  fastify.post('/', async (request: FastifyRequest<{ Body: CreateContactBody }>, reply: FastifyReply) => {
    const { name, email, phone, reformType, message, source } = request.body;

    // Validación básica
    if (!name || !email) {
      return reply.status(400).send({ error: 'Nombre y email son obligatorios' });
    }

    try {
      const newContact: NewContact = {
        name,
        email,
        phone: phone || null,
        reformType: reformType || null,
        message: message || null,
        source: source || 'web',
      };

      const [inserted] = await db.insert(contacts).values(newContact).returning();
      
      fastify.log.info(`Nuevo contacto registrado: ${email} desde ${source}`);
      
      return reply.status(201).send({
        success: true,
        message: 'Contacto registrado correctamente',
        contact: { id: inserted.id, name: inserted.name, email: inserted.email },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Error al guardar el contacto' });
    }
  });

  // Listar contactos (para admin)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const allContacts = await db
        .select()
        .from(contacts)
        .orderBy(desc(contacts.createdAt))
        .limit(100);
      
      return { contacts: allContacts, total: allContacts.length };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Error al obtener contactos' });
    }
  });

  // Obtener un contacto por ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    try {
      const [contact] = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, parseInt(id, 10)));
      
      if (!contact) {
        return reply.status(404).send({ error: 'Contacto no encontrado' });
      }
      
      return { contact };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Error al obtener el contacto' });
    }
  });

  // Marcar contacto como procesado
  fastify.patch('/:id/processed', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    try {
      const [updated] = await db
        .update(contacts)
        .set({ processed: true, updatedAt: new Date() })
        .where(eq(contacts.id, parseInt(id, 10)))
        .returning();
      
      if (!updated) {
        return reply.status(404).send({ error: 'Contacto no encontrado' });
      }
      
      return { success: true, contact: updated };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Error al actualizar el contacto' });
    }
  });
}
