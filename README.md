# Airport Ops Tracker (MERN + Kafka + Redis)

Quickstart (dev):

1. Server env

Copy `server/.env.example` to `server/.env` and adjust if needed. By default Kafka/Redis are disabled so the app runs without them.

2. Install deps

- In `server`: `npm i`
- In `client`: `npm i`

3. Run dev

- Start MongoDB locally
- In `server`: `npm run dev`
- In `client`: `npm run dev`

Login with seeded admin: `admin@airport.local` / `admin123`

Optional: Enable Redis/Kafka by setting `ENABLE_REDIS=true` and `ENABLE_KAFKA=true` and ensure services are reachable.