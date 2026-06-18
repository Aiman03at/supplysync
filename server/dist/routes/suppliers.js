import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
router.get('/', async (_req, res, next) => {
    try {
        const result = await pool.query(`
      SELECT s.*, COUNT(p.id)::int AS product_count
      FROM suppliers s
      LEFT JOIN products p ON p.supplier_id = s.id AND p.deleted_at IS NULL
      GROUP BY s.id
      ORDER BY s.name
    `);
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { name, lead_time_days, reliability_score, contact_email } = req.body;
        if (!name || !contact_email) {
            return res.status(400).json({ error: 'Name and contact_email required' });
        }
        const result = await pool.query('INSERT INTO suppliers (name, lead_time_days, reliability_score, contact_email) VALUES ($1, $2, $3, $4) RETURNING *', [name, lead_time_days || 0, reliability_score || 0, contact_email]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
});
export default router;
