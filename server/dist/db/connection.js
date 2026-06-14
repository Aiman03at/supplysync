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
    }
    catch (error) {
        console.error('✗ Database connection failed:', error);
    }
}
