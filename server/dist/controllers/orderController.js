import { pool } from '../db/connection.js';
import { createError } from '../middleware/errorHandler.js';
const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
export async function getOrders(_req, res, next) {
    try {
        const result = await pool.query(`
      SELECT
        o.id, o.type, o.status, o.quantity, o.created_at,
        p.id   AS product_id,
        p.name AS product_name,
        p.sku,
        s.id   AS supplier_id,
        s.name AS supplier_name,
        s.lead_time_days
      FROM orders o
      JOIN products  p ON p.id = o.product_id
      JOIN suppliers s ON s.id = p.supplier_id
      ORDER BY o.created_at DESC
    `);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
}
export async function createOrder(req, res, next) {
    try {
        const { type, quantity, product_id } = req.body;
        if (!type || quantity == null || !product_id) {
            throw createError('type, quantity, and product_id are required', 400);
        }
        if (!['purchase', 'sales'].includes(type)) {
            throw createError("type must be 'purchase' or 'sales'", 400);
        }
        const result = await pool.query(`INSERT INTO orders (type, quantity, product_id)
       VALUES ($1, $2, $3)
       RETURNING *`, [type, quantity, product_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
}
export async function updateOrderStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !VALID_STATUSES.includes(status)) {
            throw createError(`status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
        }
        const result = await pool.query(`UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
        if (result.rows.length === 0)
            throw createError('Order not found', 404);
        res.json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
}
