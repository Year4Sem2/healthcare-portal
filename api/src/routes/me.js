import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const result = await db.query(
    'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
    [req.user.sub]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
});

export default router;