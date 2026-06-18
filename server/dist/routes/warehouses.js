import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getWarehouses, createWarehouse } from '../controllers/warehouseController.js';
const router = express.Router();
router.get('/', getWarehouses);
router.post('/', authenticateToken, createWarehouse);
export default router;
