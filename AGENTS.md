# AGENTS.md

## First Read

1. `README.md`
2. `docs/spec.md`
3. `src/App.jsx` for the current game registry and app entry flow
4. Focused game files under `src/games/<game>/` when changing a game

## Development Completion Rule

For this project, after finishing any development change:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Stage only the intended files.
4. Commit the completed change with `scripts/agent-commit.sh`.

Do not push, deploy, or wait for the GitHub Pages workflow unless the user
explicitly asks for it.

GitHub Pages deploys through `.github/workflows/deploy-pages.yml` after pushes
to `main`, or by manually dispatching that workflow. Agents should not wait for
or verify the workflow unless the user explicitly asks for it. Local `gh-pages`
branch publishes are not the normal deployment path.

## Commit Message Rule

Use the same Conventional Commits shape across Jungju service repos:

```text
<type>(<scope>): <summary>
```

Prefer the helper so the format stays consistent:

```sh
TYPE=feat SUMMARY="add focused game behavior" scripts/agent-commit.sh
TYPE=docs SUMMARY="update game guide" scripts/agent-commit.sh
```

The default scope is `pico`. Allowed types are `feat`, `fix`, `docs`, `test`,
`refactor`, `chore`, `ci`, `build`, `deploy`, and `content`.

## Git Rules

- Work on `main` unless the user asks for a branch.
- Stage only files that belong to the requested change.
- Do not commit `dist`, `node_modules`, local screenshots, `.env`, or secret
  files.
- Keep `public/CNAME`, `public/404.html`, `scripts/write-version.mjs`, and
  `.github/workflows/deploy-pages.yml` aligned with the GitHub Pages contract.
- User-facing behavior changes must update `README.md` and `docs/spec.md`.

## GitHub Pages Contract

- Deployment source is GitHub Actions, not a local `gh-pages` branch.
- `.github/workflows/deploy-pages.yml` handles both `main` pushes and manual
  `workflow_dispatch`.
- The workflow runs `npm ci`, `npm run lint`, and `npm run build`, then uploads
  `dist` as the Pages artifact.
- `public/CNAME` owns the custom domain `pico.jjgo.io`.
- `public/404.html` keeps direct SPA routes recoverable on GitHub Pages.
- `scripts/write-version.mjs` writes `dist/version.json` during build.
