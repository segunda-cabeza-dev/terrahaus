import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma.js';
import { isLeadsWebhookEnabled, sendLeadWebhook } from '../integrations/leadsWebhook.js';

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
      const leadSource = source || 'web';
      const inserted = await prisma.contact.create({
        data: {
          name,
          email,
          phone: phone || null,
          reformType: reformType || null,
          message: message || null,
          source: leadSource,
        },
        select: { id: true, name: true, email: true },
      });

      fastify.log.info(`Nuevo contacto registrado: ${email} desde ${leadSource}`);

      // Webhook externo (opcional por env). No bloquea el guardado local.
      if (isLeadsWebhookEnabled()) {
        try {
          if (process.env.LEADS_WEBHOOK_LOG_SUCCESS === 'true') {
            fastify.log.info('Enviando webhook de leads...');
          }

          const webhookSource = process.env.LEADS_WEBHOOK_SOURCE_ID || leadSource;
          const webhookStatus = process.env.LEADS_WEBHOOK_STATUS_ID || process.env.LEADS_WEBHOOK_STATUS || 'new';
          const webhookAssigned = process.env.LEADS_WEBHOOK_ASSIGNED_ID || process.env.LEADS_WEBHOOK_ASSIGNED || 'web';

          const result = await sendLeadWebhook({
            source: webhookSource,
            status: webhookStatus,
            name,
            assigned: webhookAssigned,
            email,
            phonenumber: phone,
            description: [reformType ? `Reforma: ${reformType}` : null, message ? `Mensaje: ${message}` : null]
              .filter(Boolean)
              .join('\n'),
            tags: process.env.LEADS_WEBHOOK_TAGS || undefined,
          });
          if (process.env.LEADS_WEBHOOK_LOG_SUCCESS === 'true') {
            fastify.log.info({ status: result.status }, 'Webhook de leads enviado');
          }
        } catch (err) {
          fastify.log.warn({ err }, 'Falló envío de webhook de leads (se guardó el contacto local igual).');
        }
      }

      return reply.status(201).send({
        success: true,
        message: 'Contacto registrado correctamente',
        contact: inserted,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Error al guardar el contacto' });
    }
  });

  // Listar contactos (para admin)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const allContacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      return { contacts: allContacts, total: allContacts.length };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Error al obtener contactos' });
    }
  });

  // Obtener un contacto por ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;

    const contactId = Number(id);
    if (!Number.isInteger(contactId)) {
      return reply.status(400).send({ error: 'ID inválido' });
    }

    try {
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
      });

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

    const contactId = Number(id);
    if (!Number.isInteger(contactId)) {
      return reply.status(400).send({ error: 'ID inválido' });
    }

    try {
      const updated = await prisma.contact.update({
        where: { id: contactId },
        data: { processed: true },
      });

      return { success: true, contact: updated };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Error al actualizar el contacto' });
    }
  });
}
