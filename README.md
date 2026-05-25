# Pico

Pico is a small React app for collecting short personal notes and task fragments.
It is deployed as a static GitHub Pages app at:

```text
https://pico.jjgo.io
```

Pico uses `ohmesh` for OAuth login, session cookies, and per-user JSON record
storage.

## Documentation

- `docs/spec.md`: product scope and ohmesh data contract
- `README.md`: quick start and deployment notes
- `AGENTS.md`: agent workflow, validation, and commit rules

## Run

```sh
npm install
npm run dev -- --host 0.0.0.0 --port 5175
```

The local app URL is:

```text
http://localhost:5175
```

## Check

```sh
npm run lint
npm run build
```

## ohmesh Setup

Pico expects this ohmesh app registration:

- App slug: `pico`
- Default redirect URL: `https://pico.jjgo.io`
- Domains:
  - `https://pico.jjgo.io`
  - `http://localhost:5175`

Frontend configuration is intentionally public and small:

```sh
cp .env.example .env
```

```text
VITE_OHMESH_BASE_URL=https://ohmesh.jjgo.io
VITE_OHMESH_APP_SLUG=pico
```

No OAuth secret belongs in this repository. OAuth client IDs and secrets stay in
`ohmesh`.

## Deployment

- `main` branch push runs `.github/workflows/deploy-pages.yml`.
- The workflow runs lint, build, and GitHub Pages deploy.
- `public/CNAME` sets the custom domain to `pico.jjgo.io`.
- Manual redeploy can be triggered with:

```sh
gh workflow run deploy-pages.yml --ref main
```

## Record Shape

Pico stores one latest record per user:

- App slug: `pico`
- Record type: `pico-state`

```json
{
  "v": 1,
  "items": [
    {
      "id": "pico-abc123",
      "title": "Small thing to remember",
      "body": "A short note or task fragment",
      "done": false,
      "createdAt": "2026-05-25T00:00:00.000Z",
      "updatedAt": "2026-05-25T00:00:00.000Z"
    }
  ],
  "updatedAt": "2026-05-25T00:00:00.000Z"
}
