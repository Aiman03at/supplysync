import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { testConnection } from './db/connection.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import inventoryRoutes from './routes/inventory.js';
import warehouseRoutes from './routes/warehouses.js';
import orderRoutes from './routes/orders.js';
import supplierRoutes from './routes/suppliers.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initializeSocket } from './websockets/socketHandler.js';
const app = express();
const httpServer = createServer(app);
export const io = new SocketServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
});
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
testConnection();
// Initialize Socket.io
initializeSocket(httpServer);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
initializeSocket(io);
httpServer.listen(PORT, () => {
    console.log(`SupplySync server running on port ${PORT}`);
    testConnection();
});
