INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'dr.tan@clinic.com',
  '$2b$12$rxyrTkB.YAIosRBGcwaPyO9dSheNIiDRWGM8j3bXzLbB87Nv7soc6',
  'Dr. Tan',
  'clinician'
)
ON CONFLICT (email) DO NOTHING;

SELECT id, email, full_name, role, created_at FROM users;