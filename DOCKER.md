# SkillzLink Docker Setup

Run the full stack with Docker:

```bash
docker compose up --build
```

Services:

- Frontend (React): `http://localhost:5173`
- Backend API (Laravel): `http://localhost:18080`
- MySQL: `localhost:3308` (db: `skillzlink`, user: `skillzlink`, pass: `skillzlink`)
- Redis: `localhost:6379`

API health check:

```bash
curl http://localhost:18080/api/health
```

Stop stack:

```bash
docker compose down
```

Reset including MySQL data:

```bash
docker compose down -v
```
