import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../models/schema.js';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('Please set up your database connection in the .env file');
  console.error('For testing purposes, you can use a local PostgreSQL or get a free Neon database at https://neon.tech');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
