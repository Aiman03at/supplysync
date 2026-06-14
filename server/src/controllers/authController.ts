<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connection.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '24h'
    });

    res.status(201).json({ token, userId: user.id });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '24h'
    });

    res.json({ token, userId: user.id });
  } catch (error) {
    next(error);
=======
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/connection";
import { createError } from "../middleware/errorHandler";

// 12 rounds = 2^12 iterations. Expensive enough to resist brute-force,
// fast enough that a real login takes ~300ms.
const SALT_ROUNDS = 12;

function signToken(payload: { id: string; email: string; role: string }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw createError("JWT_SECRET not configured", 500);
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, name, role = "viewer" } = req.body as {
      email: string;
      password: string;
      name: string;
      role?: string;
    };

    if (!email || !password || !name) {
      throw createError("email, password, and name are required", 400);
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      throw createError("Email already registered", 409);
    }

    // bcrypt.hash() generates a random salt internally and bakes it into the
    // output string, so each call produces a different hash even for the same
    // password. The plain-text password is never stored anywhere.
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query<{ id: string; email: string; role: string }>(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role`,
      [email, password_hash, name, role]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      throw createError("email and password are required", 400);
    }

    const result = await pool.query<{
      id: string;
      email: string;
      password_hash: string;
      role: string;
    }>("SELECT id, email, password_hash, role FROM users WHERE email = $1", [email]);

    const user = result.rows[0];

    // Run bcrypt.compare even when user is not found to prevent timing attacks
    // that would reveal whether an email exists in the system.
    const match = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !match) {
      throw createError("Invalid email or password", 401);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c
  }
}
