<<<<<<< HEAD
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT o.*, p.name as product_name, p.sku, s.name as supplier_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { type, quantity, product_id } = req.body;

    if (!type || !quantity || !product_id) {
      return res.status(400).json({ error: 'Type, quantity, and product_id required' });
    }

    const result = await pool.query(
      'INSERT INTO orders (type, status, quantity, product_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, 'pending', quantity, product_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
=======
import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",           getOrders);
router.post("/",          authenticateToken, createOrder);
router.put("/:id/status", authenticateToken, updateOrderStatus);
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c

export default router;
