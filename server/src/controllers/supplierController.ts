import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connection.js';
import { createError } from '../middleware/errorHandler.js';

export async function getSuppliers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(`
      SELECT
        s.*,
        COUNT(p.id)::int AS product_count
      FROM suppliers s
      LEFT JOIN products p ON p.supplier_id = s.id AND p.deleted_at IS NULL
      GROUP BY s.id
      ORDER BY s.name
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function createSupplier(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, lead_time_days, reliability_score, contact_email } = req.body as {
      name: string;
      lead_time_days: number;
      reliability_score: number;
      contact_email: string;
    };

    if (!name || lead_time_days == null || reliability_score == null || !contact_email) {
      throw createError(
        'name, lead_time_days, reliability_score, and contact_email are required',
        400
      );
    }

    const result = await pool.query(
      `INSERT INTO suppliers (name, lead_time_days, reliability_score, contact_email)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, lead_time_days, reliability_score, contact_email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}
