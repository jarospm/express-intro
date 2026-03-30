#!/bin/bash
BASE="http://localhost:3000"

echo "=== GET /players-scores ==="
curl -s "$BASE/players-scores" | jq .
echo

echo "=== GET /top-players ==="
curl -s "$BASE/top-players" | jq .
echo
