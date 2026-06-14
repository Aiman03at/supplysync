<<<<<<< HEAD
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, lead_time_days, reliability_score, contact_email } = req.body;

    if (!name || !contact_email) {
      return res.status(400).json({ error: 'Name and contact_email required' });
    }

    const result = await pool.query(
      'INSERT INTO suppliers (name, lead_time_days, reliability_score, contact_email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, lead_time_days || 0, reliability_score || 0, contact_email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
=======
import { Router } from "express";
import { getSuppliers, createSupplier } from "../controllers/supplierController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",  getSuppliers);
router.post("/", authenticateToken, createSupplier);
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c

export default router;
