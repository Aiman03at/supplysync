<<<<<<< HEAD
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
=======
import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login",    login);
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c

export default router;
