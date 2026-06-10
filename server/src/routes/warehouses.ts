import { Router } from "express";
import { getWarehouses, createWarehouse } from "../controllers/warehouseController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",  getWarehouses);
router.post("/", authenticateToken, createWarehouse);

export default router;
