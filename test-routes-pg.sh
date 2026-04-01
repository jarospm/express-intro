#!/bin/bash
BASE="http://localhost:3000"

echo "=== GET /players-scores ==="
curl -s "$BASE/players-scores" | jq .
echo

echo "=== GET /top-players ==="
curl -s "$BASE/top-players" | jq .
echo

echo "=== GET /inactive-players ==="
curl -s "$BASE/inactive-players" | jq .
echo

echo "=== GET /popular-genres ==="
curl -s "$BASE/popular-genres" | jq .
echo

echo "=== GET /recent-players ==="
curl -s "$BASE/recent-players" | jq .
echo

# -- Query param validation --

echo "=== GET /top-players?limit=2 (valid) ==="
curl -s "$BASE/top-players?limit=2" | jq .
echo

echo "=== GET /top-players?limit=-5 (invalid — below min) ==="
curl -s "$BASE/top-players?limit=-5" | jq .
echo

echo "=== GET /top-players?limit=abc (invalid — not a number) ==="
curl -s "$BASE/top-players?limit=abc" | jq .
echo

echo "=== GET /recent-players?days=60 (valid) ==="
curl -s "$BASE/recent-players?days=60" | jq .
echo

echo "=== GET /recent-players?days=0 (invalid — below min) ==="
curl -s "$BASE/recent-players?days=0" | jq .
echo

# -- POST /players validation --

echo "=== POST /players (valid) ==="
curl -s -X POST "$BASE/players" \
  -H "Content-Type: application/json" \
  -d '{"name": "Frank", "join_date": "2026-03-15"}' | jq .
echo

echo "=== POST /players (valid — no join_date, defaults to today) ==="
curl -s -X POST "$BASE/players" \
  -H "Content-Type: application/json" \
  -d '{"name": "Grace"}' | jq .
echo

echo "=== POST /players (invalid — empty name) ==="
curl -s -X POST "$BASE/players" \
  -H "Content-Type: application/json" \
  -d '{"name": ""}' | jq .
echo

echo "=== POST /players (invalid — bad date format) ==="
curl -s -X POST "$BASE/players" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "join_date": "not-a-date"}' | jq .
echo

# -- POST /games validation --

echo "=== POST /games (valid) ==="
curl -s -X POST "$BASE/games" \
  -H "Content-Type: application/json" \
  -d '{"title": "Pac-Man", "genre": "Arcade"}' | jq .
echo

echo "=== POST /games (invalid — missing genre) ==="
curl -s -X POST "$BASE/games" \
  -H "Content-Type: application/json" \
  -d '{"title": "Pac-Man"}' | jq .
echo

# -- POST /scores validation --

echo "=== POST /scores (valid) ==="
curl -s -X POST "$BASE/scores" \
  -H "Content-Type: application/json" \
  -d '{"player_id": 1, "game_id": 1, "score": 999}' | jq .
echo

echo "=== POST /scores (invalid — negative score) ==="
curl -s -X POST "$BASE/scores" \
  -H "Content-Type: application/json" \
  -d '{"player_id": 1, "game_id": 1, "score": -10}' | jq .
echo

echo "=== POST /scores (invalid — missing fields) ==="
curl -s -X POST "$BASE/scores" \
  -H "Content-Type: application/json" \
  -d '{"player_id": 1}' | jq .
echo
