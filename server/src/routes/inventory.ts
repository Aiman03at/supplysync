import { Router } from "express";
import {
  getAllInventory,
  getInventoryByWarehouse,
  updateInventory,
  getAlerts,
} from "../controllers/inventoryController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Order matters: /alerts must be registered before /:warehouseId
// so Express doesn't try to treat "alerts" as a UUID parameter.
router.get("/alerts",           getAlerts);
router.get("/",                 getAllInventory);
router.get("/:warehouseId",     getInventoryByWarehouse);
router.put("/:id",              authenticateToken, updateInventory);

export default router;
