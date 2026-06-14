<<<<<<< HEAD
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✓ Database connected');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
  }
}
=======
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Keep idle connections alive; scale up to 10 under load.
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
  process.exit(1);
});

export default pool;
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c
