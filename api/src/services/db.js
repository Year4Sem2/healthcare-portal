import pg from 'pg';
import { getDbCredentials } from './secrets.js';

const creds = await getDbCredentials();

export const db = new pg.Pool({
  host: creds.host,
  port: creds.port,
  user: creds.username,
  password: creds.password,
  database: creds.dbname,
  ssl: { rejectUnauthorized: false },
});

console.log(`✅ DB pool ready: ${creds.host}/${creds.dbname}`);