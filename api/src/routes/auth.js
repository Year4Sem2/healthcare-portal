import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../services/db.js';
import { config } from '../config/env.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, full_name, role } = req.body;

  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['patient', 'clinician'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const hash = await bcrypt.hash(password, 12);

  try {
    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role`,
      [email, hash, full_name, role]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    res.status(201).json({ token, user });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
  res.json({
    token,
    user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
  });
});

export default router;