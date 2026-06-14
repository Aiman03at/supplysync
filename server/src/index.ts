<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Database
import { testConnection } from './db/connection.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import inventoryRoutes from './routes/inventory.js';
import warehouseRoutes from './routes/warehouses.js';
import orderRoutes from './routes/orders.js';
import supplierRoutes from './routes/suppliers.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Test database connection on startup
testConnection();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);

// Error handler MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SupplySync server running on port ${PORT}`);
});
=======
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes      from "./routes/auth";
import productRoutes   from "./routes/products";
import inventoryRoutes from "./routes/inventory";
import warehouseRoutes from "./routes/warehouses";
import orderRoutes     from "./routes/orders";
import supplierRoutes  from "./routes/suppliers";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth",       authRoutes);
app.use("/api/products",   productRoutes);
app.use("/api/inventory",  inventoryRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/orders",     orderRoutes);
app.use("/api/suppliers",  supplierRoutes);

// errorHandler must be the last app.use() call. Express identifies it as an
// error handler by its 4-argument signature (err, req, res, next).
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SupplySync server running on port ${PORT}`);
});
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c
