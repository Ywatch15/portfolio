# One-click deploys with auto-updates

This repo is set up for a quick deploy where future commits update the live site automatically.

## Option A: Render (server + static client)

1) Push to GitHub (main branch recommended).
2) Create a Render account and click New → Blueprint → use this repo URL.
3) Confirm `render.yaml` detection and deploy both services:
   - `portfolio-server` (Node web service)
   - `portfolio-client` (Static site)
4) After first deploys, copy the server URL (e.g., https://portfolio-server.onrender.com) and set on the client:
   - On Render → portfolio-client → Environment → add/update `VITE_API_BASE_URL` to `https://portfolio-server.onrender.com/api`
   - Redeploy client.
5) On the server service, set `FRONTEND_ORIGIN` to your client domain (e.g., `https://portfolio-client.onrender.com`).

Notes:
- DB is optional; if you want it, add a free Mongo service and set `MONGO_URI`.
- Place your resume file at `server/public/resume.pdf` and `git push` to include it.

## Option B: Vercel (client) + Render (server)

- Deploy the server to Render (Node web service). Set `FRONTEND_ORIGIN` to the Vercel domain once known.
- Deploy the client to Vercel. Add env var `VITE_API_BASE_URL=https://<render-server-domain>/api`.

## Option C: Netlify (client) + Render (server)

- Same as Vercel but using Netlify for the client. Set `VITE_API_BASE_URL` accordingly.

## Auto updates

All options support auto-deploy on git push to main. Recruiters will always see the latest changes on refresh/click.

## Local docker-compose (optional)

`docker-compose up --build` will bring up Mongo, server (on 4001), and Nginx-hosted client (on 5173 mapped to 80). Update `FRONTEND_ORIGIN` if you change ports.
