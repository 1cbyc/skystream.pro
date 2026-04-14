# SkyStream.pro

SkyStream.pro is now a full-stack NASA mission dashboard built on Next.js.

The previous Laravel + Next prototype, docs, and service wiring are preserved in `v1/` exactly as a backup. The active app was rebuilt to make development and deployment simpler, while expanding NASA coverage into one coherent product surface.

## What The Rebuild Covers

- APOD explorer
- NeoWs asteroid tracking
- Mars Rover manifests and imagery
- EPIC Earth imagery
- NASA Earth assets lookup
- EONET natural events
- DONKI space weather
- NASA Image and Video Library search
- Exoplanet Archive browsing
- A date-based NASA capsule generator

## Active Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Next Route Handlers for NASA integrations

## Local Development

1. Copy the frontend env file:

```sh
cp frontend/.env.example frontend/.env.local
```

2. Install dependencies:

```sh
cd frontend
npm ci
```

3. Start the app:

```sh
npm run dev
```

4. Open the site:

```txt
http://localhost:3000
```

## Verification

Run these after changes:

```sh
cd frontend
npm run lint
npm run build
```

## Docker

The root `docker-compose.yml` now runs the rebuilt Next.js app directly:

```sh
docker-compose up --build
```

## Legacy Backup

Everything that existed before the rebuild is preserved under:

```txt
v1/
```
