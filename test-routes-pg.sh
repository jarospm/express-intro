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
