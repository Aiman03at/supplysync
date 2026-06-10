import { Router } from "express";
import {
  getAllInventory,
  getInventoryByWarehouse,
  updateInventory,
  getAlerts,
} from "../controllers/inventoryController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// /alerts must be registered before /:warehouseId — Express matches routes
// top-to-bottom, so a literal segment must come before a param segment.
router.get("/alerts",        getAlerts);
router.get("/",              getAllInventory);
router.get("/:warehouseId",  getInventoryByWarehouse);
router.put("/:id",           authenticateToken, updateInventory);

export default router;
