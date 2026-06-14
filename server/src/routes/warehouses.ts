import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db/connection.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT w.*,
        COUNT(i.id)::int              AS product_count,
        COALESCE(SUM(i.quantity), 0)::int AS total_stock
      FROM warehouses w
      LEFT JOIN inventory i ON i.warehouse_id = w.id
      GROUP BY w.id
      ORDER BY w.name
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, location, capacity, manager_name } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location required' });
    }

    const result = await pool.query(
      'INSERT INTO warehouses (name, location, capacity, manager_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, location, capacity, manager_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
