# Express + Zod API

An Express API that fetches data from the RandomUser API and validates input with Zod (v4).

## Setup

```bash
npm install
npm run dev
```

## Endpoints

- **GET** `/ping` — health check
- **GET** `/random-person` — fetch a random person's full name and country
- **GET** `/random-login` — fetch a random user's username and registration date
- **POST** `/users` — create a user with Zod-validated `name`, `age`, `email`

## Testing

With the server running:

```bash
npm test
```

## PostgreSQL

The project includes a `compose.yml` for running PostgreSQL and pgAdmin via Docker.

```bash
docker compose up
```

- **pgAdmin:** `http://localhost:8080` (login: `admin@admin.com` / `root`)
- **PostgreSQL:** `localhost:5432` (user: `root` / `root`, database: `game_studio`)

Sample queries in `queries.sql`.
