<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    error: message,
    status
  });
=======
import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  // Never expose internal details for 500s — log them server-side only.
  const message = statusCode === 500 ? "Internal server error" : err.message;

  console.error(`[${new Date().toISOString()}] ${statusCode} — ${err.message}`);
  if (statusCode === 500) console.error(err.stack);

  res.status(statusCode).json({ error: message });
}

export function createError(message: string, statusCode: number): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  return err;
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c
}
