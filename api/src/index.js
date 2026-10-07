import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env.js';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import recordRoutes from './routes/records.js';
import appointmentRoutes from './routes/appointments.js';
import patientRoutes from './routes/patients.js';


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_, res) => res.json({ ok: true, service: 'healthcare-portal-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`🚀 API listening on port ${config.port}`);
});

app.use('/api/records', recordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);