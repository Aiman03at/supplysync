import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSuppliers, createSupplier } from '../controllers/supplierController.js';

const router = express.Router();

router.get('/', getSuppliers);
router.post('/', authenticateToken, createSupplier);

export default router;
