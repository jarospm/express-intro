#!/bin/bash
BASE="http://localhost:3000"

echo "=== GET /ping ==="
curl -s "$BASE/ping" | jq .
echo

echo "=== GET /random-person ==="
curl -s "$BASE/random-person" | jq .
echo

echo "=== POST /users (valid) ==="
curl -s -X POST "$BASE/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "age": 25, "email": "Alice@Test.com"}' | jq .
echo

echo "=== POST /users (no age — should default to 28) ==="
curl -s -X POST "$BASE/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob", "email": "bob@test.com"}' | jq .
echo

echo "=== POST /users (invalid — should 400) ==="
curl -s -X POST "$BASE/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "AB", "age": 5, "email": "not-an-email"}' | jq .
echo

echo "=== GET /random-login ==="
curl -s "$BASE/random-login" | jq .
echo
