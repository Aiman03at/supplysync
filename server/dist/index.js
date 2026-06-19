import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import { testConnection } from './db/connection.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import inventoryRoutes from './routes/inventory.js';
import warehouseRoutes from './routes/warehouses.js';
import orderRoutes from './routes/orders.js';
import supplierRoutes from './routes/suppliers.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initializeSocket } from './websockets/socketHandler.js';
dotenv.config();
const app = express();
const httpServer = http.createServer(app);
app.use(cors());
// Disable CSP so the static WebSocket tester page (public/test.html), which uses
// inline scripts + onclick handlers, can run. All other helmet protections stay on.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static('public'));
// Convenience redirect so /test resolves to the static tester page.
app.get('/test', (_req, res) => res.redirect('/test.html'));
testConnection();
// Initialize Socket.io
initializeSocket(httpServer);
app.get('/health', (req, res) => {
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
httpServer.listen(PORT, () => {
    console.log(`SupplySync server running on port ${PORT}`);
});
