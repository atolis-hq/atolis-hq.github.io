# Atolis Product Landing

Static Vite/React site for the Atolis OSS product surface.

## Local Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The static output is written to `dist/`.

## Routing

The app uses clean static routes:

- `/`
- `/corum`
- `/wake`

The build copies `dist/index.html` into `dist/corum/index.html` and `dist/wake/index.html`, so GitHub Pages can serve product pages directly without hash fragments.

## GitHub Pages

The app is ready to deploy as static files. A Pages workflow can run `npm ci`, `npm run build`, and upload `dist/`.

If this replaces the existing `web` deployment, adapt the current Pages workflow to use `landing` as the working directory.
