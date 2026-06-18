import { pool } from '../db/connection.js';
export function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        // CLIENT → SERVER: update an inventory quantity
        socket.on('inventory:update', async (data) => {
            try {
                await pool.query('UPDATE inventory SET quantity = $1, updated_at = NOW() WHERE id = $2', [data.quantity, data.inventoryId]);
                // Broadcast the new quantity to all connected clients
                io.emit('inventory:changed', {
                    inventoryId: data.inventoryId,
                    productId: data.productId,
                    warehouseId: data.warehouseId,
                    quantity: data.quantity,
                });
                // Auto-alert if stock dropped below reorder point
                const result = await pool.query(`SELECT i.reorder_point, p.name AS product_name
             FROM inventory i
             JOIN products p ON p.id = i.product_id
             WHERE i.id = $1`, [data.inventoryId]);
                const row = result.rows[0];
                if (row && data.quantity < row.reorder_point) {
                    const alertResult = await pool.query(`INSERT INTO alerts (type, severity, message, product_id)
               SELECT 'low_stock', 'high',
                      $1 || ' is below reorder point (' || $2 || ' units remaining)',
                      product_id
               FROM inventory WHERE id = $3
               RETURNING id, type, severity, message, product_id, created_at`, [row.product_name, data.quantity, data.inventoryId]);
                    if (alertResult.rows[0]) {
                        io.emit('alert:triggered', {
                            ...alertResult.rows[0],
                            product_name: row.product_name,
                        });
                    }
                }
            }
            catch (err) {
                console.error('inventory:update error:', err);
            }
        });
        // CLIENT → SERVER: create a new order
        socket.on('order:create', async (data) => {
            try {
                const result = await pool.query(`INSERT INTO orders (type, quantity, product_id)
             VALUES ($1, $2, $3)
             RETURNING *`, [data.type, data.quantity, data.productId]);
                io.emit('order:statusChanged', {
                    ...result.rows[0],
                    previousStatus: null,
                });
            }
            catch (err) {
                console.error('order:create error:', err);
            }
        });
        // CLIENT → SERVER: acknowledge (resolve) an alert
        socket.on('alert:acknowledge', async (data) => {
            try {
                await pool.query('UPDATE alerts SET resolved = TRUE WHERE id = $1', [data.alertId]);
                // Only notify the sender — other clients keep the alert visible until they refresh
                socket.emit('alert:acknowledged', { alertId: data.alertId });
            }
            catch (err) {
                console.error('alert:acknowledge error:', err);
            }
        });
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
