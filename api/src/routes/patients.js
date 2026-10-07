import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { db } from '../services/db.js';

const router = express.Router();

// ── Clinician: list all patients ──────────────────────────
router.get('/', authMiddleware, requireRole('clinician'), async (_req, res) => {
  const result = await db.query(
    `SELECT id, email, full_name, created_at
     FROM users WHERE role = 'patient' ORDER BY full_name`
  );
  res.json(result.rows);
});

// ── Public: list clinicians (for patient appointment form) ─
router.get('/clinicians', authMiddleware, async (_req, res) => {
  const result = await db.query(
    `SELECT id, full_name FROM users WHERE role = 'clinician' ORDER BY full_name`
  );
  res.json(result.rows);
});

// ── Clinician: get patient detail ─────────────────────────
router.get('/:id', authMiddleware, requireRole('clinician'), async (req, res) => {
  const result = await db.query(
    `SELECT id, email, full_name, created_at
     FROM users WHERE id = $1 AND role = 'patient'`,
    [req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});


export default router;