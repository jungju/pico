# Pico

Pico is a small collection of English learning games. The first game is
Find & Learn, a spot-the-difference picture game with clickable English objects.

Pico is deployed as a static GitHub Pages app at:

```text
https://pico.jjgo.io
```

## Documentation

- `docs/spec.md`: product scope and game data contract
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

## Find & Learn

Find & Learn uses stage data instead of transparent DOM click layers.

- Stage data lives in `src/games/findLearn/stages/stage001.js`.
- Hit testing lives in `src/games/findLearn/hitTesting.js`.
- Images live in `public/assets/`.
- All `area` coordinates use image-relative 0-100 percent coordinates.
- Click priority is always difference, object, wrong.
- Markers use `difference.marker`.
- `DEBUG_AREAS` defaults to `false` and only draws non-clickable SVG overlays.

Supported area types:

- `circle`
- `rect`
- `polygon`

## Deployment

- `main` branch push runs `.github/workflows/deploy-pages.yml`.
- The workflow runs lint, build, and GitHub Pages deploy.
- `public/CNAME` sets the custom domain to `pico.jjgo.io`.
- Manual redeploy can be triggered with:

```sh
gh workflow run deploy-pages.yml --ref main
```

## ohmesh

Pico is registered in ohmesh for future login and progress storage.
The current Find & Learn prototype runs fully client-side.

No OAuth secret belongs in this repository. OAuth client IDs and secrets stay in
`ohmesh`.
