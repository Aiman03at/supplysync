import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",            getOrders);
router.post("/",           authenticateToken, createOrder);
router.put("/:id/status",  authenticateToken, updateOrderStatus);

export default router;
