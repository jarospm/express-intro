#!/bin/bash
BASE="http://localhost:3000"

echo "=== GET / ==="
curl -s "$BASE/"
echo

echo "=== GET /users ==="
curl -s "$BASE/users" | jq .
echo

echo "=== POST /users ==="
curl -s -X POST "$BASE/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie", "age": 28}' | jq .
echo

echo "=== GET /greet ==="
curl -s "$BASE/greet"
echo

echo "=== POST /submit ==="
curl -s -X POST "$BASE/submit" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 25}' | jq .
