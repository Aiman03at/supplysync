export function errorHandler(err, _req, res, _next) {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({ error: message, status });
}
// Attach a .status property so errorHandler picks it up correctly.
export function createError(message, status) {
    const err = new Error(message);
    err.status = status;
    return err;
}
