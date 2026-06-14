import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/',     getAllProducts);
router.get('/:id',  getProductById);
router.post('/',    authenticateToken, createProduct);
router.put('/:id',  authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
