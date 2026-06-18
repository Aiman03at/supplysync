import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';
// __dirname is not available in ES modules — derive it from import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function migrate() {
    // schema.sql lives in src/db and is not emitted to dist by tsc, so read it
    // from the source tree (dist/db -> ../../src/db), falling back to alongside
    // this file in case the .sql is ever copied into dist.
    const distSchema = path.join(__dirname, 'schema.sql');
    const srcSchema = path.join(__dirname, '..', '..', 'src', 'db', 'schema.sql');
    const schemaPath = fs.existsSync(distSchema) ? distSchema : srcSchema;
    const sql = fs.readFileSync(schemaPath, 'utf8');
    const client = await pool.connect();
    try {
        console.log('Running migration...');
        await client.query(sql);
        console.log('Migration complete.');
    }
    finally {
        client.release();
        await pool.end();
    }
}
migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
