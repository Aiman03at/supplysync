<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connection.js';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(`
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT p.*, s.name as supplier_name FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id WHERE p.id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, sku, category, unit_price, supplier_id } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ error: 'Name and SKU required' });
    }

    const result = await pool.query(
      'INSERT INTO products (name, sku, category, unit_price, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, sku, category, unit_price, supplier_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, sku, category, unit_price, supplier_id } = req.body;

    const result = await pool.query(
      'UPDATE products SET name=$1, sku=$2, category=$3, unit_price=$4, supplier_id=$5 WHERE id=$6 RETURNING *',
      [name, sku, category, unit_price, supplier_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
=======
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
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c
  }
}
