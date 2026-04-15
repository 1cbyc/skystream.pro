# SkyStream.pro

SkyStream.pro is your one stop point for everything real and live about space from NASA, ESA, and the ISS.

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
cp .env.example .env.local
```

2. Install dependencies:

```sh
npm ci
```

3. Start the app:

```sh
npm run dev
```

4. Open the site:

```txt
http://localhost:3009
```

## Verification

Run these after changes:

```sh
npm run lint
npm run build
```

## Docker

The root `docker-compose.yml` now runs the rebuilt Next.js app directly:

```sh
docker-compose up --build
```

## Vercel

Deploy from the repository root.

- Root Directory: `.`
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm ci`
- Environment Variables:
  - `NASA_API_KEY`
  - `NEXT_PUBLIC_SITE_URL`
