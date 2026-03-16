#!/bin/bash
BASE="http://localhost:3000"

echo "=== GET /ping ==="
curl -s "$BASE/ping" | jq .
echo
