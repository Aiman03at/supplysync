import { pool } from '../db/connection.js';
export async function getAllProducts(req, res, next) {
    try {
        const result = await pool.query(`
      SELECT p.*, s.name as supplier_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
    `);
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
}
export async function getProductById(req, res, next) {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT p.*, s.name as supplier_name
       FROM products p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = $1 AND p.deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
}
export async function createProduct(req, res, next) {
    try {
        const { name, sku, category, unit_price, supplier_id } = req.body;
        if (!name || !sku) {
            return res.status(400).json({ error: 'Name and SKU required' });
        }
        const result = await pool.query('INSERT INTO products (name, sku, category, unit_price, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, sku, category, unit_price, supplier_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
}
export async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const { name, sku, category, unit_price, supplier_id } = req.body;
        const result = await pool.query(`UPDATE products
       SET name=$1, sku=$2, category=$3, unit_price=$4, supplier_id=$5
       WHERE id=$6 AND deleted_at IS NULL
       RETURNING *`, [name, sku, category, unit_price, supplier_id, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;
        const result = await pool.query(`UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
