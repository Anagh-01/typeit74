# Deployment

This project is configured for a single Render web service. The Express server serves the built Vite client from `client/dist`, so one deployed service runs both the API and the frontend.

## 1. Create MongoDB Atlas Database

Create a MongoDB Atlas cluster and copy the application connection string. It should look like:

```text
mongodb+srv://USER:PASSWORD@HOST/typeit74?retryWrites=true&w=majority
```

Use a database user/password created in Atlas, not your Atlas account login.

## 2. Deploy on Render

1. Open Render and create a new Blueprint.
2. Select the GitHub repository: `Anagh-01/typeit74`.
3. Render will detect `render.yaml` at the repository root.
4. When prompted, enter `MONGO_URI` using your MongoDB Atlas connection string.
5. Deploy the Blueprint.

Render uses:

```bash
npm ci && npm ci --prefix server && npm ci --prefix client && npm run build
```

as the build command, and:

```bash
npm run start
```

as the start command.

## Required Environment Variables

| Key | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Generated automatically by Render |
| `NODE_ENV` | Set to `production` by `render.yaml` |

## After Deploy

Open:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api/health
```

You should see:

```json
{"ok":true}
```
