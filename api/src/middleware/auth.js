import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}