-- List all players and their scores.
-- INNER JOIN connects three tables: scores -> players and scores -> games.
-- Foreign keys (player_id, game_id) are matched to their primary keys (id),
-- replacing raw IDs with readable names and titles.
SELECT p.name, g.title, s.score
FROM scores s
INNER JOIN players p ON s.player_id = p.id
INNER JOIN games g ON s.game_id = g.id;

-- Find top 3 high scorers.
-- GROUP BY collapses all rows with the same player name into one row,
-- allowing SUM() to add up all their scores into a single total.
-- ORDER BY DESC puts highest first, LIMIT 3 cuts to top 3.
SELECT p.name, SUM(s.score) AS total_score
FROM scores s
INNER JOIN players p ON s.player_id = p.id
GROUP BY p.name
ORDER BY total_score DESC
LIMIT 3;

-- Players who didn't play any games.
-- LEFT OUTER JOIN keeps every player even if they have no matching scores.
-- Unmatched rows get NULL in all scores columns.
-- WHERE s.id IS NULL filters to only those unmatched players.
SELECT p.name
FROM players p
LEFT OUTER JOIN scores s ON p.id = s.player_id
WHERE s.id IS NULL;

-- Find popular game genres.
-- COUNT(*) counts total score entries per genre.
-- GROUP BY collapses rows by genre, ORDER BY sorts most played first.
SELECT g.genre, COUNT(*) AS times_played
FROM scores s
INNER JOIN games g ON s.game_id = g.id
GROUP BY g.genre
ORDER BY times_played DESC;

-- Recently joined players.
-- CURRENT_DATE is a PostgreSQL built-in for today's date.
-- INTERVAL '30 days' subtracts 30 days to create the cutoff.
SELECT name, join_date
FROM players
WHERE join_date >= CURRENT_DATE - INTERVAL '30 days';

-- Each player's favorite game (most played).
-- GROUP BY on both name and title counts how many times
-- each player played each game. ORDER BY shows highest count first per player.
SELECT p.name, g.title, COUNT(*) AS times_played
FROM scores s
INNER JOIN players p ON s.player_id = p.id
INNER JOIN games g ON s.game_id = g.id
GROUP BY p.name, g.title
ORDER BY p.name, times_played DESC;
