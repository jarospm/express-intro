# Express Intro

An Express API covering Zod validation, RandomUser API integration, and PostgreSQL queries.

## Setup

```bash
npm install
```

## PostgreSQL (Docker)

Start the database:

```bash
docker compose up -d
npm run seed
```

- **pgAdmin:** `http://localhost:8080` (login: `admin@admin.com` / `root`)
- **PostgreSQL:** `localhost:5432` (user: `root` / `root`, database: `game_studio`)

The database is empty on first start — `npm run seed` creates tables and sample data.
If the container is removed or recreated, run `npm run seed` again.

## Development

```bash
npm run dev
```

## Endpoints

### Zod routes (a1-a3)

- **GET** `/ping` — health check
- **GET** `/random-person` — random person's name and country
- **GET** `/random-login` — random user's username and registration date
- **POST** `/users` — create a user with Zod-validated `name`, `age`, `email`

### PostgreSQL routes (a6)

- **GET** `/players-scores` — all players with their games and scores
- **GET** `/top-players` — top 3 players by total score
- **GET** `/inactive-players` — players who haven't played any games
- **GET** `/popular-genres` — game genres ranked by play count
- **GET** `/recent-players` — players who joined in the last 30 days

## Testing

With the server running:

```bash
npm run test:zod
npm run test:pg
```
