import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { z } from 'zod';
import zodRoutes from './routes-zod.js';
import pgRoutes from './routes-pg.js';

const envSchema = z.object({
  PG_HOST: z.string(),
  PG_PORT: z.coerce.number(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_DATABASE: z.string(),
});

const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error('Invalid environment variables:', z.treeifyError(validatedEnv.error));
  process.exit(1);
}

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } = validatedEnv.data;

const app = express();
const PORT = 3000;

export const pool = new pg.Pool({
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
});

app.use(express.json());

// Health check endpoint
app.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

app.use(zodRoutes);
app.use(pgRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
