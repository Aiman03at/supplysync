<<<<<<< HEAD
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM warehouses ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, location, capacity, manager_name } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location required' });
    }

    const result = await pool.query(
      'INSERT INTO warehouses (name, location, capacity, manager_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, location, capacity, manager_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
=======
import { Router } from "express";
import { getWarehouses, createWarehouse } from "../controllers/warehouseController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",  getWarehouses);
router.post("/", authenticateToken, createWarehouse);
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c

export default router;
