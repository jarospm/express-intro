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

  // Top 3 players with highest total scores across all games
  app.get('/top-players', async (_req, res) => {
    const result = await pool.query(`
      SELECT p.name, SUM(s.score) AS total_score
      FROM scores s
      INNER JOIN players p ON s.player_id = p.id
      GROUP BY p.name
      ORDER BY total_score DESC
      LIMIT 3
    `);

    res.json(result.rows);
  });

  // Players who haven't played any games
  app.get('/inactive-players', async (_req, res) => {
    const result = await pool.query(`
      SELECT p.name
      FROM players p
      LEFT OUTER JOIN scores s ON p.id = s.player_id
      WHERE s.id IS NULL
    `);

    res.json(result.rows);
  });

  // Most popular game genres by number of times played
  app.get('/popular-genres', async (_req, res) => {
    const result = await pool.query(`
      SELECT g.genre, COUNT(*) AS times_played
      FROM scores s
      INNER JOIN games g ON s.game_id = g.id
      GROUP BY g.genre
      ORDER BY times_played DESC
    `);

    res.json(result.rows);
  });

  // Players who joined in the last 30 days
  app.get('/recent-players', async (_req, res) => {
    const result = await pool.query(`
      SELECT name, join_date
      FROM players
      WHERE join_date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(result.rows);
  });
}
