import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import pool from "./connection";

async function migrate(): Promise<void> {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  const client = await pool.connect();
  try {
    console.log("Running migration...");
    await client.query(sql);
    console.log("Migration complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
