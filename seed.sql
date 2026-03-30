-- Drop tables if they exist (clean slate)
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS players;

-- Players
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  join_date DATE NOT NULL
);

-- Games
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL
);

-- Scores
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  game_id INTEGER REFERENCES games(id),
  score INTEGER NOT NULL,
  date_played DATE NOT NULL
);

-- Sample players (some joined recently, some long ago)
INSERT INTO players (name, join_date) VALUES
  ('Alice', CURRENT_DATE - INTERVAL '10 days'),
  ('Bob', CURRENT_DATE - INTERVAL '60 days'),
  ('Charlie', CURRENT_DATE - INTERVAL '5 days'),
  ('Diana', CURRENT_DATE - INTERVAL '90 days'),
  ('Eve', CURRENT_DATE - INTERVAL '2 days');

-- Sample games
INSERT INTO games (title, genre) VALUES
  ('Space Invaders', 'Arcade'),
  ('Dragon Quest', 'RPG'),
  ('FIFA 25', 'Sports'),
  ('Call of Duty', 'Shooter'),
  ('Tetris', 'Puzzle');

-- Sample scores (Eve has no scores — she's inactive)
INSERT INTO scores (player_id, game_id, score, date_played) VALUES
  (1, 1, 500, CURRENT_DATE - INTERVAL '5 days'),
  (1, 2, 800, CURRENT_DATE - INTERVAL '3 days'),
  (1, 2, 750, CURRENT_DATE - INTERVAL '1 day'),
  (2, 1, 600, CURRENT_DATE - INTERVAL '30 days'),
  (2, 3, 400, CURRENT_DATE - INTERVAL '20 days'),
  (2, 4, 900, CURRENT_DATE - INTERVAL '10 days'),
  (3, 5, 1200, CURRENT_DATE - INTERVAL '2 days'),
  (3, 1, 300, CURRENT_DATE - INTERVAL '1 day'),
  (4, 2, 950, CURRENT_DATE - INTERVAL '50 days'),
  (4, 3, 700, CURRENT_DATE - INTERVAL '40 days'),
  (4, 4, 850, CURRENT_DATE - INTERVAL '30 days'),
  (4, 4, 900, CURRENT_DATE - INTERVAL '20 days');
