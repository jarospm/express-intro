import type { Express } from 'express';
import { pool } from './index.js';

export function pgRoutes(app: Express) {
  // List all players, the games they've played, and their scores
  app.get('/players-scores', async (_req, res) => {
    const result = await pool.query(`
      SELECT p.name, g.title, s.score
      FROM scores s
      INNER JOIN players p ON s.player_id = p.id
      INNER JOIN games g ON s.game_id = g.id
    `);

    res.json(result.rows);
  });
}
