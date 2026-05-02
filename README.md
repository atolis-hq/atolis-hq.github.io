# Corum Landing Skeleton

React web app built with Vite, TypeScript, and Three.js.

## Prerequisites

- Node.js 20 or newer
- npm

## Install

```bash
npm install
```

## Run Locally

Start the Vite development server:

```bash
npm run dev
```

The app runs at:

```text
http://127.0.0.1:5173
```

If Vite chooses a different port because `5173` is already in use, use the URL printed in the terminal.

## Build

Create a production build in `dist/`:

```bash
npm run build
```

This runs TypeScript project checks first, then builds the Vite app.

## Deployment

Pushes to `main` publish the production build to GitHub Pages:

```text
https://atolis-hq.github.io/
```

Deployment is handled by `.github/workflows/deploy-pages.yml`, which installs dependencies, runs unit tests, builds the app, and uploads `dist/` as the Pages artifact.

## Tests

Run unit tests:

```bash
npm test
```

Run Playwright end-to-end tests:

```bash
npm run test:e2e
```

The Playwright config starts the dev server automatically at `http://127.0.0.1:5173` when needed.
