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
