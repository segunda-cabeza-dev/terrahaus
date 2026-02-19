import './env.js';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { contactRoutes } from './routes/contacts.js';
import { prisma } from './db/prisma.js';
import { isLeadsWebhookEnabled, sendLeadWebhook } from './integrations/leadsWebhook.js';

const fastify = Fastify({
  logger: true,
});

// Configurar CORS
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// JWT (placeholder listo para usar)
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET es requerido en producción');
  }
  fastify.log.warn('JWT_SECRET no está configurado (usando valor inseguro solo para desarrollo).');
}

fastify.register(jwt, {
  secret: jwtSecret || 'dev-insecure-secret',
});

// Registrar rutas (compat: /contacts y /api/contacts)
fastify.register(contactRoutes, { prefix: '/contacts' });
fastify.register(contactRoutes, { prefix: '/api/contacts' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Version
fastify.get('/version', async () => {
  return {
    app: 'terrahaus-api',
    gitSha: process.env.GIT_SHA || null,
    gitRef: process.env.GIT_REF || null,
    appVersion: process.env.APP_VERSION || null,
    nodeEnv: process.env.NODE_ENV || null,
  };
});

// Debug helpers (solo dev)
if (process.env.NODE_ENV !== 'production') {
  fastify.get('/debug/leads-webhook', async () => {
    const token = process.env.LEADS_WEBHOOK_AUTHTOKEN || '';
    return {
      enabled: isLeadsWebhookEnabled(),
      url: process.env.LEADS_WEBHOOK_URL || null,
      hasToken: Boolean(token),
      tokenLen: token ? token.length : 0,
      sourceId: process.env.LEADS_WEBHOOK_SOURCE_ID || null,
      statusId: process.env.LEADS_WEBHOOK_STATUS_ID || null,
      assignedId: process.env.LEADS_WEBHOOK_ASSIGNED_ID || null,
      status: process.env.LEADS_WEBHOOK_STATUS || null,
      assigned: process.env.LEADS_WEBHOOK_ASSIGNED || null,
      tags: process.env.LEADS_WEBHOOK_TAGS || null,
      timeoutMs: process.env.LEADS_WEBHOOK_TIMEOUT_MS || null,
      logSuccess: process.env.LEADS_WEBHOOK_LOG_SUCCESS || null,
    };
  });

  fastify.post('/debug/test-leads-webhook', async (request, reply) => {
    if (!isLeadsWebhookEnabled()) {
      return reply.status(400).send({ ok: false, error: 'LEADS_WEBHOOK_URL/AUTHTOKEN no configurados' });
    }

    const startedAt = Date.now();
    try {
      const result = await sendLeadWebhook({
        source: process.env.LEADS_WEBHOOK_SOURCE_ID || 'terrahaus-web',
        status: process.env.LEADS_WEBHOOK_STATUS_ID || process.env.LEADS_WEBHOOK_STATUS || 'new',
        name: 'Test Lead (debug)',
        assigned: process.env.LEADS_WEBHOOK_ASSIGNED_ID || process.env.LEADS_WEBHOOK_ASSIGNED || 'web',
        email: 'test@example.com',
        phonenumber: '+34123456789',
        description: 'Prueba desde /debug/test-leads-webhook',
        tags: process.env.LEADS_WEBHOOK_TAGS || undefined,
      });

      return {
        ok: true,
        status: result.status,
        durationMs: Date.now() - startedAt,
      };
    } catch (err) {
      fastify.log.warn({ err }, 'Falló test de webhook de leads');
      return reply.status(502).send({
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - startedAt,
      });
    }
  });
}

// Arrancar servidor
const start = async () => {
  try {
    await prisma.$connect();

    const host = process.env.HOST || '0.0.0.0';
    const port = parseInt(process.env.PORT || '3000', 10);

    await fastify.listen({ host, port });
    console.log(`🚀 API corriendo en http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

async function shutdown() {
  try {
    await fastify.close();
  } finally {
    await prisma.$disconnect();
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
