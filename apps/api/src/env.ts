import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load `apps/api/.env` regardless of the current working directory.
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: false });

// Optional: also load repo root `.env` (useful for shared vars).
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: false });

