import { pool } from '../db/connection.js';
import { createError } from '../middleware/errorHandler.js';
export async function getAllInventory(_req, res, next) {
    try {
        const result = await pool.query(`
      SELECT
        i.id, i.quantity, i.reorder_point, i.updated_at,
        p.id   AS product_id,
        p.name AS product_name,
        p.sku,
        w.id   AS warehouse_id,
        w.name AS warehouse_name,
        w.location
      FROM inventory i
      JOIN products   p ON p.id = i.product_id
      JOIN warehouses w ON w.id = i.warehouse_id
      WHERE p.deleted_at IS NULL
      ORDER BY w.name, p.name
    `);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
}
export async function getInventoryByWarehouse(req, res, next) {
    try {
        const { warehouseId } = req.params;
        const result = await pool.query(`SELECT
         i.id, i.quantity, i.reorder_point, i.updated_at,
         p.id   AS product_id,
         p.name AS product_name,
         p.sku,
         p.unit_price,
         w.id   AS warehouse_id,
         w.name AS warehouse_name
       FROM inventory i
       JOIN products   p ON p.id = i.product_id
       JOIN warehouses w ON w.id = i.warehouse_id
       WHERE i.warehouse_id = $1 AND p.deleted_at IS NULL
       ORDER BY p.name`, [warehouseId]);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
}
export async function updateInventory(req, res, next) {
    try {
        const { id } = req.params;
        const { quantity, reorder_point } = req.body;
        if (quantity == null || reorder_point == null) {
            throw createError('quantity and reorder_point are required', 400);
        }
        const result = await pool.query(`UPDATE inventory
       SET quantity = $1, reorder_point = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`, [quantity, reorder_point, id]);
        if (result.rows.length === 0)
            throw createError('Inventory record not found', 404);
        res.json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
}
export async function getAlerts(_req, res, next) {
    try {
        const result = await pool.query(`
      SELECT
        a.id, a.type, a.severity, a.message, a.resolved, a.created_at,
        p.id   AS product_id,
        p.name AS product_name,
        p.sku
      FROM alerts a
      JOIN products p ON p.id = a.product_id
      WHERE a.resolved = FALSE
      ORDER BY
        CASE a.severity
          WHEN 'critical' THEN 1
          WHEN 'high'     THEN 2
          WHEN 'medium'   THEN 3
          ELSE 4
        END,
        a.created_at DESC
    `);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
}
