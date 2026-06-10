import { Request, Response, NextFunction } from "express";
import pool from "../db/connection";
import { createError } from "../middleware/errorHandler";

export async function getProducts(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.name, p.sku, p.category, p.unit_price, p.created_at,
        s.id   AS supplier_id,
        s.name AS supplier_name,
        s.lead_time_days,
        s.reliability_score
      FROM products p
      JOIN suppliers s ON s.id = p.supplier_id
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, sku, category, unit_price, supplier_id } = req.body as {
      name: string;
      sku: string;
      category: string;
      unit_price: number;
      supplier_id: string;
    };

    if (!name || !sku || !category || unit_price == null || !supplier_id) {
      throw createError(
        "name, sku, category, unit_price, and supplier_id are required",
        400
      );
    }

    const result = await pool.query(
      `INSERT INTO products (name, sku, category, unit_price, supplier_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, sku, category, unit_price, supplier_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { name, sku, category, unit_price, supplier_id } = req.body as {
      name: string;
      sku: string;
      category: string;
      unit_price: number;
      supplier_id: string;
    };

    const result = await pool.query(
      `UPDATE products
       SET name = $1, sku = $2, category = $3, unit_price = $4, supplier_id = $5
       WHERE id = $6 AND deleted_at IS NULL
       RETURNING *`,
      [name, sku, category, unit_price, supplier_id, id]
    );

    if (result.rows.length === 0) throw createError("Product not found", 404);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Soft delete: stamp deleted_at rather than removing the row so that all
// orders and alerts referencing this product remain intact for audit purposes.
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE products
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) throw createError("Product not found", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
