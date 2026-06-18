import { pool } from '../db/connection.js';
import { createError } from '../middleware/errorHandler.js';
export async function getWarehouses(_req, res, next) {
    try {
        const result = await pool.query(`
      SELECT
        w.*,
        COUNT(i.id)::int              AS product_count,
        COALESCE(SUM(i.quantity), 0)::int AS total_stock
      FROM warehouses w
      LEFT JOIN inventory i ON i.warehouse_id = w.id
      GROUP BY w.id
      ORDER BY w.name
    `);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
}
export async function createWarehouse(req, res, next) {
    try {
        const { name, location, capacity, manager_name } = req.body;
        if (!name || !location || !capacity || !manager_name) {
            throw createError('name, location, capacity, and manager_name are required', 400);
        }
        const result = await pool.query(`INSERT INTO warehouses (name, location, capacity, manager_name)
       VALUES ($1, $2, $3, $4) RETURNING *`, [name, location, capacity, manager_name]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
}
