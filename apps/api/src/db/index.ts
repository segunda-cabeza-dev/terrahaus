import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'terrahaus',
  password: process.env.DB_PASSWORD || 'terrahaus_secret',
  database: process.env.DB_NAME || 'terrahaus',
});

export const db = drizzle(pool, { schema });

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida');
    client.release();
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    throw error;
  }
}

export { pool };
