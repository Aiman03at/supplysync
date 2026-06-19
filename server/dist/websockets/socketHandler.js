import { pool } from '../db/connection.js';
export function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);
        // ─── inventory:update ──────────────────────────────────────────────────
        // Updates stock in the DB, broadcasts the new level to every client,
        // and auto-inserts + broadcasts an alert when stock falls below reorder point.
        socket.on('inventory:update', async (data) => {
            const { productId, warehouseId, quantity } = data;
            try {
                const result = await pool.query(`UPDATE inventory
           SET quantity = $1, updated_at = NOW()
           WHERE product_id = $2 AND warehouse_id = $3
           RETURNING *`, [quantity, productId, warehouseId]);
                if (result.rows.length === 0) {
                    socket.emit('error', { message: 'Inventory record not found' });
                    return;
                }
                const row = result.rows[0];
                // Broadcast the updated stock level to ALL connected clients.
                io.emit('inventory:changed', {
                    id: row.id,
                    productId: row.product_id,
                    warehouseId: row.warehouse_id,
                    quantity: row.quantity,
                    reorderPoint: row.reorder_point,
                    updatedAt: row.updated_at,
                });
                // If the new quantity is below the reorder point, create an alert
                // in the DB and broadcast it to everyone immediately.
                if (quantity < row.reorder_point) {
                    const productRes = await pool.query('SELECT name, sku FROM products WHERE id = $1', [productId]);
                    const product = productRes.rows[0];
                    const severity = quantity === 0 ? 'critical'
                        : quantity < row.reorder_point * 0.5 ? 'high'
                            : 'medium';
                    const alertRes = await pool.query(`INSERT INTO alerts (type, severity, product_id, message)
             VALUES ('low_stock', $1, $2, $3)
             RETURNING *`, [
                        severity,
                        productId,
                        `${product?.name ?? 'Product'} (${product?.sku ?? productId}) dropped to ${quantity} units — reorder point is ${row.reorder_point}.`,
                    ]);
                    // Broadcast the new alert to ALL connected clients.
                    io.emit('alert:triggered', {
                        ...alertRes.rows[0],
                        productName: product?.name,
                    });
                }
            }
            catch (err) {
                console.error('[Socket] inventory:update error:', err);
                socket.emit('error', { message: 'Failed to update inventory' });
            }
        });
        // ─── order:create ──────────────────────────────────────────────────────
        socket.on('order:create', async (data) => {
            const { productId, quantity, type } = data;
            try {
                if (!['purchase', 'sales'].includes(type)) {
                    socket.emit('error', { message: "type must be 'purchase' or 'sales'" });
                    return;
                }
                const result = await pool.query(`INSERT INTO orders (type, status, quantity, product_id)
           VALUES ($1, 'pending', $2, $3)
           RETURNING *`, [type, quantity, productId]);
                const order = result.rows[0];
                // Broadcast the new order (status = 'pending') to ALL clients.
                io.emit('order:statusChanged', {
                    id: order.id,
                    type: order.type,
                    status: order.status,
                    quantity: order.quantity,
                    productId: order.product_id,
                    previousStatus: null,
                    createdAt: order.created_at,
                });
            }
            catch (err) {
                console.error('[Socket] order:create error:', err);
                socket.emit('error', { message: 'Failed to create order' });
            }
        });
        // ─── alert:acknowledge ─────────────────────────────────────────────────
        // Marks an alert resolved in the DB and confirms back to the sender only.
        // Other clients will remove it on their next /api/inventory/alerts poll.
        socket.on('alert:acknowledge', async (data) => {
            const { alertId } = data;
            try {
                const result = await pool.query(`UPDATE alerts SET resolved = TRUE WHERE id = $1 RETURNING id`, [alertId]);
                if (result.rows.length === 0) {
                    socket.emit('error', { message: 'Alert not found' });
                    return;
                }
                // Reply only to the client that acknowledged — not a global broadcast.
                socket.emit('alert:acknowledged', { alertId });
            }
            catch (err) {
                console.error('[Socket] alert:acknowledge error:', err);
                socket.emit('error', { message: 'Failed to acknowledge alert' });
            }
        });
        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });
}
