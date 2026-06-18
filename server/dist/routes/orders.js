import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getOrders, createOrder, updateOrderStatus, } from '../controllers/orderController.js';
const router = express.Router();
router.get('/', getOrders);
router.post('/', authenticateToken, createOrder);
router.put('/:id/status', authenticateToken, updateOrderStatus);
export default router;
