CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('patient', 'clinician')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- M4 additions: records + appointments
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS records (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  record_date  DATE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_records_patient ON records(patient_id);

CREATE TABLE IF NOT EXISTS appointments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinician_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_at TIMESTAMPTZ NOT NULL,
  reason         TEXT,
  status         TEXT NOT NULL DEFAULT 'requested'
                 CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinician ON appointments(clinician_id);

-- ⚠️ Idempotent constraint upgrade for existing tables
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled'));