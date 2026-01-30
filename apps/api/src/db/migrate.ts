import { pool } from './index.js';

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Ejecutando migraciones...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        reform_type VARCHAR(100),
        message TEXT,
        source VARCHAR(100),
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Índices para búsquedas frecuentes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
      CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_contacts_processed ON contacts(processed);
    `);
    
    console.log('✅ Migraciones completadas');
  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
