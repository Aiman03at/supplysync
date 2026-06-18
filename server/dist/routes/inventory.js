import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAllInventory, getInventoryByWarehouse, updateInventory, getAlerts, } from '../controllers/inventoryController.js';
const router = express.Router();
// /alerts/active MUST be before /:warehouseId — Express matches top-to-bottom,
// so the literal segment must be registered before the param segment.
router.get('/alerts/active', getAlerts);
router.get('/', getAllInventory);
router.get('/:warehouseId', getInventoryByWarehouse);
router.put('/:id', authenticateToken, updateInventory);
export default router;
