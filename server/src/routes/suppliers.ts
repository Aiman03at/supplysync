import { Router } from "express";
import { getSuppliers, createSupplier } from "../controllers/supplierController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",  getSuppliers);
router.post("/", authenticateToken, createSupplier);

export default router;
