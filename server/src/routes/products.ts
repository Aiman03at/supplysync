<<<<<<< HEAD
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);
=======
import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",       getProducts);
router.post("/",      authenticateToken, createProduct);
router.put("/:id",    authenticateToken, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c

export default router;
