import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { db } from '../services/db.js';

const router = express.Router();

// ── List appointments ─────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  const { role, sub } = req.user;
  const filterCol = role === 'patient' ? 'a.patient_id' : 'a.clinician_id';

  const result = await db.query(
    `SELECT a.*,
            p.full_name AS patient_name,
            c.full_name AS clinician_name
     FROM appointments a
     JOIN users p ON p.id = a.patient_id
     JOIN users c ON c.id = a.clinician_id
     WHERE ${filterCol} = $1
     ORDER BY a.appointment_at DESC`,
    [sub]
  );
  res.json(result.rows);
});

// ── Patient requests an appointment ───────────────────────
router.post('/', authMiddleware, requireRole('patient'), async (req, res) => {
  const { clinician_id, appointment_at, reason } = req.body;
  if (!clinician_id || !appointment_at) {
    return res.status(400).json({ error: 'clinician_id and appointment_at required' });
  }

  const result = await db.query(
    `INSERT INTO appointments (patient_id, clinician_id, appointment_at, reason)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [req.user.sub, clinician_id, appointment_at, reason]
  );
  res.status(201).json(result.rows[0]);
});

// ── Clinician confirms ────────────────────────────────────
router.put('/:id/confirm', authMiddleware, requireRole('clinician'), async (req, res) => {
  const result = await db.query(
    `UPDATE appointments SET status = 'confirmed'
     WHERE id = $1 AND clinician_id = $2 AND status = 'requested'
     RETURNING *`,
    [req.params.id, req.user.sub]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found or wrong status' });
  res.json(result.rows[0]);
});

// ── Clinician cancels ─────────────────────────────────────
router.put('/:id/cancel', authMiddleware, requireRole('clinician'), async (req, res) => {
  const result = await db.query(
    `UPDATE appointments SET status = 'cancelled'
     WHERE id = $1 AND clinician_id = $2 AND status IN ('requested', 'confirmed')
     RETURNING *`,
    [req.params.id, req.user.sub]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found or wrong status' });
  res.json(result.rows[0]);
});

// ── Clinician marks completed (visit happened) ────────────
router.put('/:id/complete', authMiddleware, requireRole('clinician'), async (req, res) => {
  const result = await db.query(
    `UPDATE appointments SET status = 'completed'
     WHERE id = $1 AND clinician_id = $2 AND status = 'confirmed'
     RETURNING *`,
    [req.params.id, req.user.sub]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found or not confirmed' });
  res.json(result.rows[0]);
});

export default router;