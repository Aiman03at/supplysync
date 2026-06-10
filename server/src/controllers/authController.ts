import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/connection";
import { createError } from "../middleware/errorHandler";

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

    // bcrypt turns the password into a one-way hash. The original password
    // is never stored — only this hash. On login, bcrypt re-hashes the
    // candidate password and compares; they match without revealing the secret.
    // SALT_ROUNDS = 12 means 2^12 iterations, making brute-force infeasible.
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role`,
      [email, password_hash, name, role]
    );

    const user = result.rows[0] as { id: string; email: string; role: string };
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

    const result = await pool.query(
      "SELECT id, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0] as
      | { id: string; email: string; password_hash: string; role: string }
      | undefined;

    // Return the same message for wrong email or wrong password —
    // telling an attacker which one they got right would be information leakage.
    const match = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !match) {
      throw createError("Invalid email or password", 401);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}
