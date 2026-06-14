import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { testConnection } from './db/connection.js';
import { initializeSocket } from './websockets/socketHandler.js';

import authRoutes      from './routes/auth.js';
import productRoutes   from './routes/products.js';
import inventoryRoutes from './routes/inventory.js';
import warehouseRoutes from './routes/warehouses.js';
import orderRoutes     from './routes/orders.js';
import supplierRoutes  from './routes/suppliers.js';

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Wrap Express in a plain HTTP server so Socket.io can share the same port.
const httpServer = createServer(app);

export const io = new SocketServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(helmet());
app.use(express.json());

testConnection();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/inventory',  inventoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/suppliers',  supplierRoutes);

// errorHandler must be the last app.use() — Express identifies it by its
// 4-argument signature (err, req, res, next).
app.use(errorHandler);

initializeSocket(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`SupplySync server running on port ${PORT}`);
});
