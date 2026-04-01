import { Router } from 'express';
import { z } from 'zod';
import { pool } from './index.js';

// -- Query param schemas --

const TopPlayersQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(3),
});

const RecentPlayersQuery = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

// -- Body schemas for POST routes --

const CreatePlayerBody = z.object({
  name: z.string().min(1).max(100),
  join_date: z.iso.date().optional(),
});

const CreateGameBody = z.object({
  title: z.string().min(1).max(100),
  genre: z.string().min(1).max(50),
});

const CreateScoreBody = z.object({
  player_id: z.number().int().positive(),
  game_id: z.number().int().positive(),
  score: z.number().int().min(0),
  date_played: z.iso.date().optional(),
});

const router = Router();

// List all players, the games they've played, and their scores
router.get('/players-scores', async (_req, res) => {
  const result = await pool.query(`
    SELECT p.name, g.title, s.score
    FROM scores s
    INNER JOIN players p ON s.player_id = p.id
    INNER JOIN games g ON s.game_id = g.id
  `);

  res.json(result.rows);
});

// Top players with highest total scores across all games
router.get('/top-players', async (req, res) => {
  const parsed = TopPlayersQuery.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ errors: z.treeifyError(parsed.error) });
    return;
  }

  const result = await pool.query(
    `SELECT p.name, SUM(s.score) AS total_score
     FROM scores s
     INNER JOIN players p ON s.player_id = p.id
     GROUP BY p.name
     ORDER BY total_score DESC
     LIMIT $1`,
    [parsed.data.limit]
  );

  res.json(result.rows);
});

// Players who haven't played any games
router.get('/inactive-players', async (_req, res) => {
  const result = await pool.query(`
    SELECT p.name
    FROM players p
    LEFT OUTER JOIN scores s ON p.id = s.player_id
    WHERE s.id IS NULL
  `);

  res.json(result.rows);
});

// Most popular game genres by number of times played
router.get('/popular-genres', async (_req, res) => {
  const result = await pool.query(`
    SELECT g.genre, COUNT(*) AS times_played
    FROM scores s
    INNER JOIN games g ON s.game_id = g.id
    GROUP BY g.genre
    ORDER BY times_played DESC
  `);

  res.json(result.rows);
});

// Players who joined in the last N days (default 30)
router.get('/recent-players', async (req, res) => {
  const parsed = RecentPlayersQuery.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ errors: z.treeifyError(parsed.error) });
    return;
  }

  const result = await pool.query(
    `SELECT name, join_date
     FROM players
     WHERE join_date >= CURRENT_DATE - make_interval(days => $1)`,
    [parsed.data.days]
  );

  res.json(result.rows);
});

// Create a new player
router.post('/players', async (req, res) => {
  const parsed = CreatePlayerBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: z.treeifyError(parsed.error) });
    return;
  }

  const { name, join_date } = parsed.data;
  const result = await pool.query(
    `INSERT INTO players (name, join_date)
     VALUES ($1, $2)
     RETURNING *`,
    [name, join_date ?? new Date().toISOString().slice(0, 10)]
  );

  res.status(201).json(result.rows[0]);
});

// Create a new game
router.post('/games', async (req, res) => {
  const parsed = CreateGameBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: z.treeifyError(parsed.error) });
    return;
  }

  const { title, genre } = parsed.data;
  const result = await pool.query(
    `INSERT INTO games (title, genre)
     VALUES ($1, $2)
     RETURNING *`,
    [title, genre]
  );

  res.status(201).json(result.rows[0]);
});

// Record a new score
router.post('/scores', async (req, res) => {
  const parsed = CreateScoreBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: z.treeifyError(parsed.error) });
    return;
  }

  const { player_id, game_id, score, date_played } = parsed.data;
  const result = await pool.query(
    `INSERT INTO scores (player_id, game_id, score, date_played)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [player_id, game_id, score, date_played ?? new Date().toISOString().slice(0, 10)]
  );

  res.status(201).json(result.rows[0]);
});

export default router;
