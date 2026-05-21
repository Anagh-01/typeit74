# Typeit74

A typing tutor web app with practice modes, lessons, leaderboard, and user stats. Built with React (Vite), Express, MongoDB, and Socket.io.

## Prerequisites

- Node.js 18+
- MongoDB running locally (or update `MONGO_URI` in `server/.env`)

## Setup

1. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

2. Configure environment:

```bash
cp server/.env.example server/.env
# Edit server/.env if needed (JWT_SECRET, MONGO_URI, PORT)
```

3. Seed the database:

```bash
npm run seed
```

## Development

Run both client and server:

```bash
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5001

If MongoDB is not installed locally, the server automatically uses an in-memory database for development.

Or run separately:

```bash
npm run dev:server
npm run dev:client
```

## Demo account

After seeding:

- Email: `demo@typeit74.local`
- Password: `demo1234`

## Production build

```bash
npm run build
npm run start
```

Set `VITE_API_URL` when building the client if the API is hosted on a different origin.

## Deployment

This repository includes `render.yaml` for deploying the full-stack app as one Render web service. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the Render + MongoDB Atlas setup steps.
