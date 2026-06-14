<<<<<<< HEAD
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';

// __dirname is not available in ES modules — derive it from import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate(): Promise<void> {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const client = await pool.connect();
  try {
    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration complete.');
=======
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import pool from "./connection";

async function migrate(): Promise<void> {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  const client = await pool.connect();
  try {
    console.log("Running migration...");
    await client.query(sql);
    console.log("Migration complete.");
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
<<<<<<< HEAD
  console.error('Migration failed:', err);
=======
  console.error("Migration failed:", err);
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c
  process.exit(1);
});
