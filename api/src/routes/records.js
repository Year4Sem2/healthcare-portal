import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { db } from '../services/db.js';

const router = express.Router();

// ── List records ──────────────────────────────────────────
// Patient → own records | Clinician → ?patient_id=
router.get('/', authMiddleware, async (req, res) => {
  const { role, sub } = req.user;

  const patientId = role === 'patient' ? sub : req.query.patient_id;
  if (!patientId) return res.status(400).json({ error: 'patient_id required' });

  const result = await db.query(
    `SELECT r.*, c.full_name AS clinician_name
     FROM records r
     JOIN users c ON c.id = r.clinician_id
     WHERE r.patient_id = $1
     ORDER BY r.record_date DESC`,
    [patientId]
  );
  res.json(result.rows);
});

// ── Clinician creates a record ────────────────────────────
router.post('/', authMiddleware, requireRole('clinician'), async (req, res) => {
  const { patient_id, title, description, record_date } = req.body;
  if (!patient_id || !title || !record_date) {
    return res.status(400).json({ error: 'patient_id, title, record_date required' });
  }

  const result = await db.query(
    `INSERT INTO records (patient_id, clinician_id, title, description, record_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [patient_id, req.user.sub, title, description, record_date]
  );
  res.status(201).json(result.rows[0]);
});

// ── Clinician updates own record ──────────────────────────
router.put('/:id', authMiddleware, requireRole('clinician'), async (req, res) => {
  const { title, description, record_date } = req.body;
  const result = await db.query(
    `UPDATE records
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         record_date = COALESCE($3, record_date)
     WHERE id = $4 AND clinician_id = $5
     RETURNING *`,
    [title, description, record_date, req.params.id, req.user.sub]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// ── Clinician deletes own record ──────────────────────────
router.delete('/:id', authMiddleware, requireRole('clinician'), async (req, res) => {
  const result = await db.query(
    `DELETE FROM records WHERE id = $1 AND clinician_id = $2 RETURNING id`,
    [req.params.id, req.user.sub]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;