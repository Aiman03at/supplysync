import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT i.*, p.name as product_name, w.name as warehouse_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY w.name, p.name
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:warehouseId', async (req, res, next) => {
  try {
    const { warehouseId } = req.params;
    const result = await pool.query(`
      SELECT i.*, p.name as product_name, p.sku
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.warehouse_id = $1
      ORDER BY p.name
    `, [warehouseId]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(
      'UPDATE inventory SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/alerts/active', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.name as product_name
      FROM alerts a
      JOIN products p ON a.product_id = p.id
      WHERE a.resolved = false
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
