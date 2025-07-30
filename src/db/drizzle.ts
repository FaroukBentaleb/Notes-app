// src/db/drizzle.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Initialize db only on server-side
let db: PostgresJsDatabase | undefined;

if (typeof window === 'undefined') {
  const { config } = await import('dotenv');
  config();
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql);
}

// Throw error if db is accessed before initialization
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}