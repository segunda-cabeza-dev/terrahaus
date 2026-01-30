import Fastify from 'fastify';
import cors from '@fastify/cors';
import { contactRoutes } from './routes/contacts.js';
import { db, testConnection } from './db/index.js';

const fastify = Fastify({
  logger: true,
});

// Configurar CORS
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Registrar rutas
fastify.register(contactRoutes, { prefix: '/api/contacts' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Arrancar servidor
const start = async () => {
  try {
    // Verificar conexión a BD
    await testConnection();
    
    const host = process.env.HOST || '0.0.0.0';
    const port = parseInt(process.env.PORT || '3001', 10);
    
    await fastify.listen({ host, port });
    console.log(`🚀 API corriendo en http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
