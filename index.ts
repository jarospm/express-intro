import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { zodRoutes } from './zod-routes.js';
import { pgRoutes } from './pg-routes.js';

const app = express();
const PORT = 3000;

export const pool = new pg.Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

app.use(express.json());

// Health check endpoint
app.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

zodRoutes(app);
pgRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
